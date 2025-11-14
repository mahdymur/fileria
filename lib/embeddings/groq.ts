import { getGroqClient } from "@/lib/llm/groq";

const DEFAULT_EMBEDDING_MODEL = process.env.GROQ_EMBEDDING_MODEL || "nomic-embed-text";

export function getGroqEmbeddingModel() {
  return DEFAULT_EMBEDDING_MODEL;
}

export async function embedTexts(texts: string[]) {
  if (texts.length === 0) {
    return [] as number[][];
  }

  const client = getGroqClient();
  const response = await client.embeddings.create({
    model: DEFAULT_EMBEDDING_MODEL,
    input: texts,
  });

  return response.data.map((row) => row.embedding);
}
