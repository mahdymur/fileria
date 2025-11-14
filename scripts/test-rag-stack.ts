import "dotenv/config";
import { embedTexts } from "@/lib/embeddings/local-bge";
import { callGroqChat } from "@/lib/llm/groq";

async function main() {
  console.log("Testing local embeddings with bge-m3...");
  const vectors = await embedTexts(["Hello world from Fileria"]);
  console.log("Embedding count:", vectors.length);
  console.log("Embedding dimension:", vectors[0]?.length);

  console.log("\nTesting Groq chat completion...");
  const answer = await callGroqChat([
    {
      role: "user",
      content: "Say hi from the Fileria MVP. Be concise.",
    },
  ]);

  console.log("Groq answer:", answer);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
