import { pipeline } from "@huggingface/transformers";

// We only want this to run server-side.
if (typeof window !== "undefined") {
  throw new Error("local-bge embeddings should only be used server-side");
}

export const MODEL_ID = process.env.RAG_EMBEDDING_MODEL || "Xenova/bge-m3";

type TensorLike = {
  tolist(): number[] | number[][];
};

type FeatureExtractionPipeline = (
  inputs: string | string[],
  options?: Record<string, unknown>,
) => Promise<TensorLike | TensorLike[]>;

let embedderPromise: Promise<FeatureExtractionPipeline> | null = null;

/**
 * Lazily load the bge-m3 feature-extraction pipeline.
 */
export async function getEmbedder(): Promise<FeatureExtractionPipeline> {
  if (!embedderPromise) {
    embedderPromise = pipeline("feature-extraction", MODEL_ID).then(
      (extractor) => extractor as FeatureExtractionPipeline,
    );
  }
  return embedderPromise;
}

/**
 * Embed an array of texts into 1024-dim vectors using bge-m3.
 * Returns an array of number[] (one per text).
 */
export async function embedTexts(texts: string[]): Promise<number[][]> {
  const extractor = await getEmbedder();

  // Transformers.js accepts string or string[]
  const result = await extractor(texts, {
    pooling: "mean",
    normalize: true,
  });

  const tensorOutputs = Array.isArray(result) ? result : [result];
  const vectors = tensorOutputs.map((tensor) => tensor.tolist());

  if (vectors.length === 1 && !Array.isArray(vectors[0][0])) {
    return [vectors[0] as number[]];
  }

  return vectors as number[][];
}
