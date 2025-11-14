import { NextRequest, NextResponse } from "next/server";
import { ingestFiling } from "@/lib/ingestion/pipeline";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null) as { filingId?: string } | null;

  if (!body?.filingId) {
    return NextResponse.json({ error: "filingId is required" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: filing, error: ownershipError } = await supabase
    .from("filings")
    .select("id, ingestion_status")
    .eq("id", body.filingId)
    .eq("user_id", session.user.id)
    .single();

  if (ownershipError || !filing) {
    return NextResponse.json({ error: "Filing not found" }, { status: 404 });
  }

  const currentStatus = filing.ingestion_status ?? "uploaded";

  if (currentStatus === "extracting" || currentStatus === "chunked" || currentStatus === "embedding") {
    return NextResponse.json(
      { status: "processing", ingestion_status: currentStatus },
      { status: 202 },
    );
  }

  if (currentStatus === "ready") {
    return NextResponse.json(
      { status: "already-ready", ingestion_status: currentStatus },
      { status: 200 },
    );
  }

  try {
    const result = await ingestFiling(body.filingId);
    return NextResponse.json({ status: "started", result }, { status: 202 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ingestion failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
