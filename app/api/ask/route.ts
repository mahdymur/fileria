import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  normalizeFilters,
  vectorSearchChunks,
  embedQuestion,
  answerWithChunks,
  buildCitations,
  countEmbeddedChunksForUser,
  type AskFilters,
} from "@/lib/rag/query";

export const runtime = "nodejs";

const DEFAULT_TOP_K = Number(process.env.RAG_TOP_K ?? 12);

type AskRequestPayload = {
  question?: string;
  filters?: AskFilters;
};

export async function POST(request: NextRequest) {
  const startedAt = Date.now();
  const payload = (await request.json().catch(() => null)) as AskRequestPayload | null;

  const question = payload?.question?.trim();
  if (!question) {
    return NextResponse.json({ error: "question is required" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const supabaseAdmin = createAdminClient();

  try {
    const embeddedChunkCount = await countEmbeddedChunksForUser(supabaseAdmin, session.user.id);

    if (embeddedChunkCount === 0) {
      return NextResponse.json(
        {
          error:
            "No embedded filings found. Upload a filing, run embeddings, and try asking your question again.",
        },
        { status: 400 },
      );
    }

    const questionEmbedding = await embedQuestion(question);
    const normalizedFilters = normalizeFilters(payload?.filters);
    const chunks = await vectorSearchChunks(supabaseAdmin, {
      userId: session.user.id,
      questionEmbedding,
      filters: normalizedFilters,
      matchLimit: DEFAULT_TOP_K,
    });

    const answer = await answerWithChunks(question, chunks);
    const latencyMs = Date.now() - startedAt;

    try {
      await supabaseAdmin.from("rag_queries").insert({
        user_id: session.user.id,
        question,
        answer,
        latency_ms: latencyMs,
      });
    } catch (logError) {
      console.warn("Failed to log rag query", logError);
    }

    return NextResponse.json({
      answer,
      citations: buildCitations(chunks),
      debug: {
        totalChunksScanned: chunks.length,
        model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
        embeddedChunkCount,
        latencyMs,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to process question";
    console.error("/api/ask error", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
