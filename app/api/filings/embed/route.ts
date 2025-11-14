import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { embedFilingChunks } from "@/lib/ingestion/pipeline";

export const runtime = "nodejs";

function extractFilingId(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  return searchParams.get("filingId");
}

async function handleEmbedRequest(request: NextRequest, body: { filingId?: string } | null) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const filingId = body?.filingId ?? extractFilingId(request);

  if (!filingId) {
    return NextResponse.json({ error: "filingId is required" }, { status: 400 });
  }

  const { data: filing, error } = await supabase
    .from("filings")
    .select("id, user_id, ingestion_status")
    .eq("id", filingId)
    .eq("user_id", session.user.id)
    .single();

  if (error || !filing) {
    return NextResponse.json({ error: "Filing not found" }, { status: 404 });
  }

  if (filing.ingestion_status === "ready") {
    return NextResponse.json({ status: "ready" }, { status: 200 });
  }

  try {
    const result = await embedFilingChunks(filingId);
    return NextResponse.json({ status: "embedding", result }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Embedding failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as { filingId?: string } | null;
  return handleEmbedRequest(request, body);
}

export async function GET(request: NextRequest) {
  return handleEmbedRequest(request, null);
}
