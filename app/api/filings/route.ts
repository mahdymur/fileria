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
    .select("id, title, content, created_at")
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
