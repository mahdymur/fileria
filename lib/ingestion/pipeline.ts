import { extname } from "node:path";
import { Buffer } from "node:buffer";
import { createCanvas } from "@napi-rs/canvas";
import type { Canvas } from "@napi-rs/canvas";
import Tesseract from "tesseract.js";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist/types/src/pdf";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import { runCohereEmbeddingJob } from "@/lib/rag/embedding";

// Chunking defaults favor ~300 tokens per chunk to keep prompts small while preserving context.
// They can be tuned via env vars without redeploying.
const CHUNK_SIZE = Number(process.env.RAG_CHUNK_SIZE ?? 1200);
const CHUNK_OVERLAP = Number(process.env.RAG_CHUNK_OVERLAP ?? 200);

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


type PdfTextItem = { str?: string };
const PDF_BINARY_MARKER_REGEX = /(endobj|endstream|%PDF-|\bxref\b|\/ProcSet)/i;
const OCR_ENABLED = process.env.RAG_ENABLE_PDF_OCR !== "false";
const OCR_MAX_PAGES = Number(process.env.RAG_PDF_OCR_MAX_PAGES ?? 25);
const OCR_RENDER_SCALE = Number(process.env.RAG_PDF_OCR_SCALE ?? 2);
type WorkerOptionsParam = NonNullable<Parameters<typeof Tesseract.createWorker>[2]>;
type TesseractLoggerMessage = WorkerOptionsParam extends { logger?: (message: infer M) => void } ? M : unknown;
type TesseractWorker = Awaited<ReturnType<typeof Tesseract.createWorker>>;
let ocrWorkerPromise: Promise<TesseractWorker> | null = null;

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

    guardAgainstBinaryGarbage(text);

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

    const { embedded } = await runCohereEmbeddingJob({
      filingId: filing.id,
      userId: filing.user_id,
      supabaseAdmin,
    });

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
    return extractPdfText(buffer);
  }

  return { text: sanitizeExtractedText(buffer.toString("utf-8")), pageCount: null };
}

async function extractPdfText(buffer: Buffer): Promise<{ text: string; pageCount: number | null }> {
  try {
    type DocumentParams = Parameters<typeof pdfjsLib.getDocument>[0];
    const documentParams: DocumentParams & { disableWorker?: boolean } = {
      data: new Uint8Array(buffer),
      useSystemFonts: true,
      isEvalSupported: false,
      ownerDocument: undefined,
    };
    documentParams.disableWorker = true;
    const loadingTask = pdfjsLib.getDocument(documentParams);
    const pdf = await loadingTask.promise;
    const textual = await extractPdfTextViaSelectableContent(pdf);
    if (textual.trim()) {
      return {
        text: sanitizeExtractedText(textual),
        pageCount: pdf.numPages,
      };
    }

    if (OCR_ENABLED) {
      const ocrText = await extractPdfTextWithOcr(pdf);
      if (ocrText.trim()) {
        return {
          text: sanitizeExtractedText(ocrText),
          pageCount: pdf.numPages,
        };
      }
    } else {
      console.warn(
        "[ingestion] PDF contains no selectable text; set RAG_ENABLE_PDF_OCR=true to enable image OCR fallback",
      );
    }

    throw new Error("PDF extraction yielded no selectable text");
  } catch (error) {
    console.error("[ingestion] pdfjs-dist parsing failed", error);
    throw new Error("Failed to extract text from PDF document");
  }
}

async function extractPdfTextViaSelectableContent(pdf: PDFDocumentProxy): Promise<string> {
  let fullText = "";

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = (textContent.items as PdfTextItem[])
      .map((item) => item.str ?? "")
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    if (pageText) {
      fullText += (fullText ? "\n" : "") + pageText;
    }
  }

  return fullText;
}

async function extractPdfTextWithOcr(pdf: PDFDocumentProxy): Promise<string> {
  const ocrTexts: string[] = [];
  const maxPages = Number.isFinite(OCR_MAX_PAGES) && OCR_MAX_PAGES > 0 ? OCR_MAX_PAGES : pdf.numPages;

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    if (pageNum > maxPages) {
      console.warn(
        `[ingestion] OCR page limit (${maxPages}) reached; remaining ${pdf.numPages - maxPages} pages will be skipped`,
      );
      break;
    }

    const page = await pdf.getPage(pageNum);
    const imageBuffer = await renderPageToImageBuffer(page, OCR_RENDER_SCALE);
    const recognized = await recognizeImageBuffer(imageBuffer);
    const trimmed = recognized.replace(/\s+/g, " ").trim();
    if (trimmed) {
      ocrTexts.push(trimmed);
    } else {
      console.warn(`[ingestion] OCR returned no text for page ${pageNum}`);
    }
  }

  return ocrTexts.join("\n");
}

async function recognizeImageBuffer(buffer: Buffer): Promise<string> {
  const worker = await getOcrWorker();
  const { data } = await worker.recognize(buffer);
  return data?.text ?? "";
}

async function getOcrWorker(): Promise<TesseractWorker> {
  if (!ocrWorkerPromise) {
    ocrWorkerPromise = (async () => {
      const logger =
        process.env.RAG_OCR_DEBUG === "true"
          ? (message: TesseractLoggerMessage) => console.debug("[ocr]", message)
          : undefined;
      const workerOptions = logger ? { cacheMethod: "none", logger } : { cacheMethod: "none" };
      const worker = await Tesseract.createWorker(undefined, undefined, workerOptions);
      await worker.reinitialize("eng");
      return worker;
    })();
  }

  return ocrWorkerPromise;
}

type CanvasContext = NonNullable<ReturnType<Canvas["getContext"]>>;
type CanvasAndContext = {
  canvas: Canvas;
  context: CanvasContext;
};

async function renderPageToImageBuffer(page: PDFPageProxy, scale: number): Promise<Buffer> {
  const viewport = page.getViewport({ scale });
  const canvasFactory = new NodeCanvasFactory();
  const canvasAndContext = canvasFactory.create(viewport.width, viewport.height);
  const renderContext = {
    canvasContext: canvasAndContext.context,
    viewport,
    canvasFactory,
  };

  await page.render(renderContext as never).promise;
  const buffer = canvasAndContext.canvas.toBuffer("image/png");
  canvasFactory.destroy(canvasAndContext);
  return buffer;
}

class NodeCanvasFactory {
  create(width: number, height: number): CanvasAndContext {
    if (width <= 0 || height <= 0) {
      throw new Error("Invalid canvas size");
    }
    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Failed to get 2D context from canvas");
    }
    return { canvas, context };
  }

  reset(target: CanvasAndContext, width: number, height: number) {
    target.canvas.width = width;
    target.canvas.height = height;
  }

  destroy(target: CanvasAndContext) {
    target.canvas.width = 0;
    target.canvas.height = 0;
  }
}

function guardAgainstBinaryGarbage(text: string) {
  if (!text) {
    throw new Error("Extracted text is empty; check the source document");
  }

  const sample = text.slice(0, 4000);
  if (PDF_BINARY_MARKER_REGEX.test(sample)) {
    throw new Error(
      "Extracted text still looks like raw PDF binary; blocking ingestion instead of embedding garbage",
    );
  }
}

function chunkText(text: string): ChunkPayload[] {
  // Normalize whitespace aggressively so deterministic chunk hashes stay stable across re-ingests.
  const clean = text.replace(/\s+/g, " ").trim();
  const rawChunks: ChunkPayload[] = [];

  if (!clean) {
    return rawChunks;
  }

  // Sliding window with overlap prevents sentences from being split harshly at boundaries.
  let start = 0;
  let chunkIndex = 0;
  while (start < clean.length) {
    const end = Math.min(start + CHUNK_SIZE, clean.length);
    const slice = clean.slice(start, end);
    rawChunks.push({
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

  const meaningfulChunks = rawChunks
    .filter((chunk) => isMeaningfulChunk(chunk.content))
    .map((chunk, index) => ({
      ...chunk,
      chunk_index: index,
    }));

  if (meaningfulChunks.length > 0) {
    return meaningfulChunks;
  }

  // If we filtered everything, fall back to a looser heuristic so short filings still ingest.
  const fallbackChunks = rawChunks
    .filter((chunk) => hasMinimumAlpha(chunk.content, 10))
    .map((chunk, index) => ({
      ...chunk,
      chunk_index: index,
    }));

  if (fallbackChunks.length > 0) {
    console.warn("[ingestion] Chunk noise filter fell back to looser heuristic for filing");
    return fallbackChunks;
  }

  return rawChunks;
}

// When analysts see "ReportLab" or raw PDF operators in answers, it's a sign
// that binary streams slipped into the chunk store. This regex blocks the most
// common offenders before they reach embeddings.
const NOISE_MARKER_REGEX = /(endobj|endstream|\bxref\b|\/ProcSet|ReportLab Generated PDF)/i;

function isMeaningfulChunk(content: string): boolean {
  const trimmed = content.trim();
  if (trimmed.length < 40) {
    return false;
  }

  if (NOISE_MARKER_REGEX.test(trimmed)) {
    return false;
  }

  const alphaCount = (trimmed.match(/[A-Za-z]/g) ?? []).length;
  const digitCount = (trimmed.match(/\d/g) ?? []).length;
  const lexicalRatio = (alphaCount + digitCount) / Math.max(trimmed.length, 1);

  // Require a reasonable amount of letters/numbers so we keep prose but drop binary blobs.
  return alphaCount >= 25 && lexicalRatio >= 0.2;
}

function hasMinimumAlpha(content: string, minAlpha: number) {
  const alphaCount = (content.match(/[A-Za-z]/g) ?? []).length;
  return alphaCount >= minAlpha;
}

function estimateTokens(content: string) {
  return Math.max(1, Math.round(content.length / 4));
}

function sanitizeExtractedText(text: string): string {
  if (!text) {
    return "";
  }

  return text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
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

export const __TEST_ONLY__ = {
  extractText,
  guardAgainstBinaryGarbage,
};
