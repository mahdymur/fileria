import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import { embedText, getCohereEmbeddingModel } from "@/lib/cohere";

// Cohere caps /embeddings at 96 inputs per call. We reserve a little wiggle room
// for future metadata attachments by hard-limiting batches to 90 rows.
const COHERE_BATCH_LIMIT = 90;
const CONFIGURED_BATCH_SIZE = Number(process.env.RAG_EMBED_BATCH_SIZE ?? COHERE_BATCH_LIMIT);
const EMBED_BATCH_SIZE = Math.min(
  COHERE_BATCH_LIMIT,
  Math.max(1, Number.isFinite(CONFIGURED_BATCH_SIZE) ? Math.floor(CONFIGURED_BATCH_SIZE) : COHERE_BATCH_LIMIT),
);

export type PendingChunkRow = {
  id: string;
  chunk_index: number;
  content: string;
};

export type CohereEmbeddingJobResult = {
  embedded: number;
  remaining: number;
};

async function fetchPendingChunks(
  supabaseAdmin: SupabaseClient,
  filingId: string,
  userId: string,
): Promise<PendingChunkRow[]> {
  const { data, error } = await supabaseAdmin
    .from("filing_chunks")
    .select("id, chunk_index, content")
    .eq("filing_id", filingId)
    .eq("user_id", userId)
    .is("embedding", null)
    .order("chunk_index", { ascending: true });

  if (error) {
    throw new Error(`Unable to load pending chunks: ${error.message}`);
  }

  return (data ?? []) as PendingChunkRow[];
}

async function updateFilingStatus(
  supabaseAdmin: SupabaseClient,
  filingId: string,
  userId: string,
  fields: Record<string, unknown>,
) {
  const { error } = await supabaseAdmin
    .from("filings")
    .update({
      ...fields,
      updated_at: new Date().toISOString(),
    })
    .eq("id", filingId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Unable to update filing status: ${error.message}`);
  }
}

export async function runCohereEmbeddingJob(params: {
  filingId: string;
  userId: string;
  supabaseAdmin?: SupabaseClient;
}): Promise<CohereEmbeddingJobResult> {
  const supabaseAdmin = params.supabaseAdmin ?? createAdminClient();
  const model = getCohereEmbeddingModel();
  const pendingChunks = await fetchPendingChunks(supabaseAdmin, params.filingId, params.userId);

  if (pendingChunks.length === 0) {
    await updateFilingStatus(supabaseAdmin, params.filingId, params.userId, {
      ingestion_status: "ready",
      ingestion_error: null,
      embedding_model: model,
    });
    return { embedded: 0, remaining: 0 };
  }

  await updateFilingStatus(supabaseAdmin, params.filingId, params.userId, {
    ingestion_status: "embedding",
    embedding_model: model,
    ingestion_error: null,
  });

  let totalEmbedded = 0;
  for (let index = 0; index < pendingChunks.length; index += EMBED_BATCH_SIZE) {
    const batch = pendingChunks.slice(index, index + EMBED_BATCH_SIZE);
    // Cohere caps /embeddings at 96 inputs per request. We keep 90 to leave headroom
    // for future metadata fields and to respect soft rate limits.
    const embeddings = await embedText(batch.map((chunk) => chunk.content));
    const embeddedAt = new Date().toISOString();

    await Promise.all(
      batch.map(async (chunk, idx) => {
        const { error } = await supabaseAdmin
          .from("filing_chunks")
          .update({
            embedding: embeddings[idx],
            embedding_model: model,
            embedded_at: embeddedAt,
          })
          .eq("id", chunk.id)
          .eq("user_id", params.userId)
          .select("id")
          .single();

        if (error) {
          throw new Error(
            `Failed to persist embedding for chunk ${chunk.id} (index ${chunk.chunk_index}): ${error.message}`,
          );
        }
      }),
    );

    totalEmbedded += batch.length;
  }

  await updateFilingStatus(supabaseAdmin, params.filingId, params.userId, {
    ingestion_status: "ready",
    ingestion_error: null,
    embedding_model: model,
  });

  return {
    embedded: totalEmbedded,
    remaining: Math.max(0, pendingChunks.length - totalEmbedded),
  };
}