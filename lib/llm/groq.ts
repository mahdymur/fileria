import OpenAI from "openai";

const baseURL = process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1";
const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

let groqClient: OpenAI | null = null;

export function getGroqClient() {
  if (groqClient) {
    return groqClient;
  }

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured.");
  }

  groqClient = new OpenAI({ apiKey, baseURL });
  return groqClient;
}

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function callGroqChat(messages: ChatMessage[]): Promise<string> {
  const client = getGroqClient();
  const completion = await client.chat.completions.create({
    model,
    messages,
  });

  const choice = completion.choices[0];
  const content = choice.message?.content ?? "";

  return typeof content === "string" ? content : String(content);
}
