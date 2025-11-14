import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 },
    );
  }

  const { data, error } = await supabase
    .from("filings")
    .select(
      "id, title, content, storage_path, original_filename, content_type, ingestion_status, ingestion_error, chunk_count, file_size, extracted_at, created_at, updated_at",
    )
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ filings: data ?? [] });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 },
    );
  }

  const body = await request.json().catch(() => null);

  if (!body || typeof body.title !== "string" || typeof body.content !== "string") {
    return NextResponse.json(
      { error: "Both title and content are required" },
      { status: 400 },
    );
  }

  const trimmedTitle = body.title.trim();
  const trimmedContent = body.content.trim();

  if (!trimmedTitle || !trimmedContent) {
    return NextResponse.json(
      { error: "Both title and content must be non-empty" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("filings")
    .insert({
      user_id: session.user.id,
      title: trimmedTitle,
      content: trimmedContent,
    })
    .select("id, title, content, created_at")
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ filing: data }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 },
    );
  }

  const targetId = new URL(request.url).searchParams.get("id");

  if (!targetId) {
    return NextResponse.json(
      { error: "Missing filing id" },
      { status: 400 },
    );
  }

  const { data: existing, error: fetchError } = await supabase
    .from("filings")
    .select("id, storage_path")
    .eq("id", targetId)
    .eq("user_id", session.user.id)
    .single();

  if (fetchError) {
    const status = fetchError.code === "PGRST116" ? 404 : 500;
    return NextResponse.json(
      { error: status === 404 ? "Filing not found" : fetchError.message },
      { status },
    );
  }

  if (existing?.storage_path) {
    await supabase.storage
      .from("filings")
      .remove([existing.storage_path])
      .catch(() => {
        // Non-fatal: leave orphan cleanup to scheduled job/logging
      });
  }

  const { error } = await supabase
    .from("filings")
    .delete()
    .eq("id", targetId)
    .eq("user_id", session.user.id);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 },
    );
  }

  return new NextResponse(null, { status: 204 });
}
