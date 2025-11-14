import { CohereClient } from "cohere-ai";

export const COHERE_EMBED_DIMENSION = 1024;
const DEFAULT_EMBEDDING_MODEL = process.env.COHERE_EMBEDDING_MODEL || "embed-english-v3.0";
const DEFAULT_INPUT_TYPE = "search_document" satisfies CohereEmbedInputType;
const COHERE_TEXT_LIMIT = 96;
const parsedBatchSize = Number(process.env.COHERE_EMBED_BATCH_SIZE);
const COHERE_BATCH_SIZE = Math.min(
  COHERE_TEXT_LIMIT,
  Math.max(1, Number.isFinite(parsedBatchSize) && parsedBatchSize > 0 ? Math.floor(parsedBatchSize) : COHERE_TEXT_LIMIT),
);

let cohereClient: CohereClient | null = null;

type CohereEmbedResult = {
  embeddings?: number[][] | {
    float?: number[][];
    [key: string]: unknown;
  };
};

export type CohereEmbedInputType =
  | "search_document"
  | "search_query"
  | "classification"
  | "clustering";

export function getCohereClient() {
  if (cohereClient) {
    return cohereClient;
  }

  const apiKey = process.env.COHERE_API_KEY;

  if (!apiKey) {
    throw new Error("COHERE_API_KEY is not configured.");
  }

  cohereClient = new CohereClient({ token: apiKey });
  return cohereClient;
}

export function getCohereEmbeddingModel() {
  return DEFAULT_EMBEDDING_MODEL;
}

export async function embedText(texts: string[], options?: { inputType?: CohereEmbedInputType }): Promise<number[][]> {
  if (!Array.isArray(texts) || texts.length === 0) {
    return [];
  }

  const client = getCohereClient();
  const vectors: number[][] = [];
  const inputType = options?.inputType ?? DEFAULT_INPUT_TYPE;

  for (const batch of chunkArray(texts, COHERE_BATCH_SIZE)) {
    const response = (await client.embed({
      model: DEFAULT_EMBEDDING_MODEL,
      texts: batch,
      inputType,
    })) as CohereEmbedResult;

    const batchVectors = extractFloatEmbeddings(response);
    for (const vector of batchVectors) {
      if (vector.length !== COHERE_EMBED_DIMENSION) {
        throw new Error(
          `Cohere returned ${vector.length}-dim vectors; expected ${COHERE_EMBED_DIMENSION} for ${DEFAULT_EMBEDDING_MODEL}.`,
        );
      }
    }

    if (batchVectors.length !== batch.length) {
      throw new Error(
        `Cohere returned ${batchVectors.length} embeddings for a batch of ${batch.length} texts.`,
      );
    }

    vectors.push(...batchVectors);
  }

  return vectors;
}

function extractFloatEmbeddings(response: CohereEmbedResult): number[][] {
  const rawEmbeddings = response.embeddings;

  if (Array.isArray(rawEmbeddings)) {
    return rawEmbeddings as number[][];
  }

  if (
    rawEmbeddings &&
    typeof rawEmbeddings === "object" &&
    Array.isArray((rawEmbeddings as { float?: unknown }).float)
  ) {
    return (rawEmbeddings as { float: number[][] }).float;
  }

  throw new Error("Cohere embed response did not include float embeddings.");
}

function chunkArray<T>(items: T[], size: number): T[][] {
  const chunkSize = Number.isFinite(size) && size > 0 ? Math.floor(size) : 1;
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += chunkSize) {
    chunks.push(items.slice(index, index + chunkSize));
  }

  return chunks;
}
