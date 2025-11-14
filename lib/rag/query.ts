import type { SupabaseClient } from "@supabase/supabase-js";
import { embedTexts } from "@/lib/embeddings/groq";
import { callGroqChat, type ChatMessage } from "@/lib/llm/groq";

export type AskFilters = {
  filingIds?: Array<string | number>;
  ticker?: string;
  filingTypes?: string[];
  dateFrom?: string;
  dateTo?: string;
};

export type NormalizedFilters = {
  filingIds: number[] | null;
  tickerPattern: string | null;
  filingTypes: string[] | null;
  dateFrom: string | null;
  dateTo: string | null;
};

export type RetrievedChunk = {
  chunk_id: string;
  filing_id: number;
  user_id: string;
  content: string;
  similarity: number;
  ticker: string | null;
  filing_type: string | null;
  filing_date: string | null;
};

const DEFAULT_MAX_CHUNKS = Number(process.env.RAG_TOP_K ?? 12);
const MIN_SIMILARITY = Number(process.env.RAG_MIN_SIMILARITY ?? 0.1);
const MAX_CHUNK_CHAR_COUNT = 1200;

export function normalizeFilters(filters?: AskFilters | null): NormalizedFilters {
  if (!filters) {
    return {
      filingIds: null,
      tickerPattern: null,
      filingTypes: null,
      dateFrom: null,
      dateTo: null,
    };
  }

  const filingIds = Array.isArray(filters.filingIds)
    ? filters.filingIds
        .map((value) => {
          if (typeof value === "number" && Number.isFinite(value)) {
            return Math.trunc(value);
          }
          if (typeof value === "string" && value.trim()) {
            const parsed = Number(value.trim());
            return Number.isFinite(parsed) ? Math.trunc(parsed) : null;
          }
          return null;
        })
        .filter((value): value is number => typeof value === "number")
    : null;

  const tickerPattern = filters.ticker?.trim()
    ? `%${filters.ticker.trim().toUpperCase()}%`
    : null;

  const filingTypes = Array.isArray(filters.filingTypes) && filters.filingTypes.length > 0
    ? filters.filingTypes.map((type) => type.trim()).filter(Boolean)
    : null;

  const dateFrom = filters.dateFrom && !Number.isNaN(Date.parse(filters.dateFrom))
    ? filters.dateFrom.slice(0, 10)
    : null;

  const dateTo = filters.dateTo && !Number.isNaN(Date.parse(filters.dateTo))
    ? filters.dateTo.slice(0, 10)
    : null;

  return {
    filingIds: filingIds && filingIds.length > 0 ? filingIds : null,
    tickerPattern,
    filingTypes,
    dateFrom,
    dateTo,
  };
}

export async function embedQuestion(question: string) {
  const [vector] = await embedTexts([question]);
  if (!vector) {
    throw new Error("Failed to generate embedding for question");
  }
  return vector;
}

export async function vectorSearchChunks(
  supabaseAdmin: SupabaseClient,
  params: {
    userId: string;
    questionEmbedding: number[];
    filters: NormalizedFilters;
    matchLimit?: number;
    minSimilarity?: number;
  },
): Promise<RetrievedChunk[]> {
  const { userId, questionEmbedding, filters, matchLimit, minSimilarity } = params;
  const { data, error } = await supabaseAdmin.rpc("match_user_filing_chunks", {
    p_user_id: userId,
    p_query_embedding: questionEmbedding,
    p_limit: matchLimit ?? DEFAULT_MAX_CHUNKS,
    p_min_similarity: typeof minSimilarity === "number" ? minSimilarity : MIN_SIMILARITY,
    p_filing_ids: filters.filingIds,
    p_ticker: filters.tickerPattern,
    p_filing_types: filters.filingTypes,
    p_date_from: filters.dateFrom,
    p_date_to: filters.dateTo,
  });

  if (error) {
    throw new Error(error.message);
  }

  return (data as RetrievedChunk[]) ?? [];
}

export function buildQaMessages(question: string, chunks: RetrievedChunk[]): ChatMessage[] {
  const systemPrompt = `You are a meticulous financial analyst. Answer only with the context chunks provided. If the context does not answer the question, say you cannot find the information. Always cite the chunk id in square brackets like [chunk-id].`;

  const context = chunks
    .map((chunk, index) => {
      const snippet = chunk.content
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, MAX_CHUNK_CHAR_COUNT);
      const metaParts = [
        chunk.ticker ? `Ticker: ${chunk.ticker}` : null,
        chunk.filing_type ? `Type: ${chunk.filing_type}` : null,
        chunk.filing_date ? `Date: ${chunk.filing_date}` : null,
        `Sim: ${chunk.similarity.toFixed(3)}`,
      ].filter(Boolean);
      return `Chunk ${index + 1} | ID: ${chunk.chunk_id} | Filing ${chunk.filing_id}${metaParts.length ? ` | ${metaParts.join(" | ")}` : ""}\n${snippet}`;
    })
    .join("\n\n");

  const userPrompt = `Question: ${question}\n\nContext Chunks:\n${context}\n\nInstructions:\n- Reference only the provided chunks.\n- Quote or paraphrase concisely.\n- Attach citations using the chunk ID in square brackets.\n- If multiple chunks support the same point, cite all relevant IDs.`;

  return [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];
}

export async function answerWithChunks(question: string, chunks: RetrievedChunk[]) {
  if (!chunks.length) {
    return "I could not find any relevant excerpts in your filings to answer that question.";
  }

  const messages = buildQaMessages(question, chunks);
  return callGroqChat(messages);
}

export function buildCitations(chunks: RetrievedChunk[]) {
  return chunks.map((chunk) => ({
    chunkId: chunk.chunk_id,
    filingId: String(chunk.filing_id),
    similarity: chunk.similarity,
    snippet: chunk.content.replace(/\s+/g, " ").slice(0, 280),
    ticker: chunk.ticker ?? undefined,
    filingType: chunk.filing_type ?? undefined,
    filingDate: chunk.filing_date ?? undefined,
  }));
}
