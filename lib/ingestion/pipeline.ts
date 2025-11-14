import { extname } from "node:path";
import { Buffer } from "node:buffer";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import { embedTexts, getGroqEmbeddingModel } from "@/lib/embeddings/groq";

// Chunking defaults favor ~300 tokens per chunk to keep prompts small while preserving context.
// They can be tuned via env vars without redeploying.
const CHUNK_SIZE = Number(process.env.RAG_CHUNK_SIZE ?? 1200);
const CHUNK_OVERLAP = Number(process.env.RAG_CHUNK_OVERLAP ?? 200);
const MAX_CHUNKS_PER_EMBED_REQUEST = Number(process.env.RAG_EMBED_BATCH_SIZE ?? 90);
const DEFAULT_EMBEDDING_MODEL = getGroqEmbeddingModel();

type FilingRecord = {
  id: string;
  user_id: string;
  storage_path: string | null;
  content_type: string | null;
  ingestion_status: string | null;
  title: string | null;
  original_filename: string | null;
};

type ChunkPayload = {
  chunk_index: number;
  content: string;
  token_count: number;
};

type PersistableChunk = {
  chunkIndex: number;
  pageNumber: number | null;
  content: string;
  tokenCount: number;
};

type PendingChunkRecord = {
  id: string;
  chunk_index: number;
  content: string;
};

type PdfParseFn = (data: Buffer) => Promise<{ text: string; numpages?: number | undefined }>;

export async function ingestFiling(filingId: string) {
  const supabaseAdmin = createAdminClient();
  let filing: FilingRecord | null = null;

  try {
    filing = await fetchFiling(supabaseAdmin, filingId);

    if (!filing.storage_path) {
      throw new Error("Filing is missing storage_path; cannot ingest.");
    }

    if (filing.ingestion_status === "ready") {
      return { status: "noop", message: "Filing already ingested" } as const;
    }

    await updateFilingStatus(supabaseAdmin, filingId, {
      ingestion_status: "extracting",
      ingestion_error: null,
    });

    const fileBuffer = await downloadFilingBuffer(supabaseAdmin, filing.storage_path);
    const { text, pageCount } = await extractText(
      fileBuffer,
      filing.content_type ?? filing.original_filename,
    );

    if (!text?.trim()) {
      throw new Error("Extracted text is empty; check the source document");
    }

    const chunks = chunkText(text);

    if (chunks.length === 0) {
      throw new Error("Chunker returned no chunks");
    }

    await updateFilingStatus(supabaseAdmin, filingId, {
      ingestion_status: "chunked",
      extracted_at: new Date().toISOString(),
      content: text,
      chunk_count: chunks.length,
    });

    const persistableChunks: PersistableChunk[] = chunks.map((chunk) => ({
      chunkIndex: chunk.chunk_index,
      pageNumber: pageCount ? Math.min(pageCount, chunk.chunk_index + 1) : null,
      content: chunk.content,
      tokenCount: chunk.token_count,
    }));

    await replaceFilingChunksWithContent(
      supabaseAdmin,
      filing.id,
      filing.user_id,
      persistableChunks,
    );

    const { embedded } = await embedPendingChunksForFiling(supabaseAdmin, filing);

    return {
      status: "success" as const,
      chunks: persistableChunks.length,
      embedded,
    };
  } catch (error) {
    if (filing?.id) {
      const message = error instanceof Error ? error.message : "Unknown ingestion error";
      await updateFilingStatus(supabaseAdmin, filing.id, {
        ingestion_status: "failed",
        ingestion_error: message,
      });
    }
    throw error;
  }
}

async function fetchFiling(supabase: SupabaseClient, filingId: string): Promise<FilingRecord> {
  const { data, error } = await supabase
    .from("filings")
    .select("id, user_id, storage_path, content_type, ingestion_status, title, original_filename")
    .eq("id", filingId)
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Filing not found");
  }

  return data as FilingRecord;
}

async function downloadFilingBuffer(supabase: SupabaseClient, storagePath: string) {
  const { data, error } = await supabase.storage.from("filings").download(storagePath);
  if (error || !data) {
    throw new Error(error?.message ?? "Unable to download filing from storage");
  }

  const arrayBuffer = await data.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function extractText(buffer: Buffer, hint?: string | null): Promise<{ text: string; pageCount: number | null }> {
  const mime = (hint ?? "").toLowerCase();
  const extension = extname(hint ?? "").toLowerCase();
  const isPdf = mime.includes("pdf") || extension === ".pdf";

  if (isPdf) {
    const pdfModule = (await import("pdf-parse")) as { default?: PdfParseFn } | PdfParseFn;
    const pdfParseExport = typeof pdfModule === "function" ? pdfModule : pdfModule.default;

    if (!pdfParseExport) {
      throw new Error("Failed to load pdf-parse");
    }

    const parsed = await pdfParseExport(buffer);
    return {
      text: parsed.text ?? "",
      pageCount: parsed.numpages ?? null,
    };
  }

  return { text: buffer.toString("utf-8"), pageCount: null };
}

function chunkText(text: string): ChunkPayload[] {
  // Normalize whitespace aggressively so deterministic chunk hashes stay stable across re-ingests.
  const clean = text.replace(/\s+/g, " ").trim();
  const chunks: ChunkPayload[] = [];

  if (!clean) {
    return chunks;
  }

  // Sliding window with overlap prevents sentences from being split harshly at boundaries.
  let start = 0;
  let chunkIndex = 0;
  while (start < clean.length) {
    const end = Math.min(start + CHUNK_SIZE, clean.length);
    const slice = clean.slice(start, end);
    chunks.push({
      chunk_index: chunkIndex,
      content: slice,
      token_count: estimateTokens(slice),
    });
    chunkIndex += 1;
    if (end === clean.length) {
      break;
    }
    start += CHUNK_SIZE - CHUNK_OVERLAP;
  }

  return chunks;
}

function estimateTokens(content: string) {
  return Math.max(1, Math.round(content.length / 4));
}

async function replaceFilingChunksWithContent(
  supabaseAdmin: SupabaseClient,
  filingId: string,
  userId: string,
  chunks: PersistableChunk[],
) {
  await supabaseAdmin
    .from("filing_chunks")
    .delete()
    .eq("filing_id", filingId);

  if (chunks.length === 0) {
    return;
  }

  const rows = chunks.map((chunk) => ({
    filing_id: filingId,
    user_id: userId,
    chunk_index: chunk.chunkIndex,
    page_number: chunk.pageNumber,
    token_count: chunk.tokenCount,
    content: chunk.content,
    embedding: null,
    embedding_model: null,
  }));

  const { error } = await supabaseAdmin.from("filing_chunks").insert(rows);

  if (error) {
    throw new Error(`Failed to persist filing chunks: ${error.message}`);
  }
}

export async function embedFilingChunks(filingId: string) {
  const supabaseAdmin = createAdminClient();
  const filing = await fetchFiling(supabaseAdmin, filingId);
  return embedPendingChunksForFiling(supabaseAdmin, filing);
}

async function embedPendingChunksForFiling(
  supabaseAdmin: SupabaseClient,
  filing: FilingRecord,
) {
  const pendingChunks = await fetchPendingChunks(supabaseAdmin, filing.id);

  if (pendingChunks.length === 0) {
    if (filing.ingestion_status !== "ready") {
      await updateFilingStatus(supabaseAdmin, filing.id, {
        ingestion_status: "ready",
        ingestion_error: null,
      });
    }

    return { embedded: 0 } as const;
  }

  await updateFilingStatus(supabaseAdmin, filing.id, {
    ingestion_status: "embedding",
    embedding_model: DEFAULT_EMBEDDING_MODEL,
  });

  const totalEmbedded = await processEmbeddingBatches(
    supabaseAdmin,
    pendingChunks,
  );

  await updateFilingStatus(supabaseAdmin, filing.id, {
    ingestion_status: "ready",
    ingestion_error: null,
    embedding_model: DEFAULT_EMBEDDING_MODEL,
  });

  return { embedded: totalEmbedded } as const;
}

async function fetchPendingChunks(supabaseAdmin: SupabaseClient, filingId: string) {
  const { data, error } = await supabaseAdmin
    .from("filing_chunks")
    .select("id, chunk_index, content")
    .eq("filing_id", filingId)
    .is("embedding", null)
    .order("chunk_index", { ascending: true });

  if (error) {
    throw new Error(`Unable to load pending chunks: ${error.message}`);
  }

  return (data ?? []) as PendingChunkRecord[];
}

async function processEmbeddingBatches(
  supabaseAdmin: SupabaseClient,
  chunks: PendingChunkRecord[],
) {
  const batchSize = MAX_CHUNKS_PER_EMBED_REQUEST;
  let totalEmbedded = 0;

  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);
    const vectors = await embedTexts(batch.map((chunk) => chunk.content));

    const timestamp = new Date().toISOString();
    const payload = batch.map((chunk, idx) => ({
      id: chunk.id,
      embedding: vectors[idx],
      embedding_model: DEFAULT_EMBEDDING_MODEL,
      embedded_at: timestamp,
    }));

    const { error } = await supabaseAdmin.from("filing_chunks").upsert(payload);

    if (error) {
      throw new Error(
        `Failed to persist embeddings for batch starting at chunk index ${batch[0]?.chunk_index}: ${error.message}`,
      );
    }

    totalEmbedded += payload.length;
  }

  return totalEmbedded;
}

async function updateFilingStatus(
  supabase: SupabaseClient,
  filingId: string,
  fields: Record<string, unknown>,
) {
  const { error } = await supabase
    .from("filings")
    .update({
      ...fields,
      updated_at: new Date().toISOString(),
    })
    .eq("id", filingId);

  if (error) {
    throw new Error(`Unable to update filing status: ${error.message}`);
  }
}
