import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";
import { Buffer } from "buffer";
import { extname } from "path";

export const runtime = "nodejs";

const ACCEPTED_TYPES = new Set(["application/pdf", "text/plain"]);

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

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "A file field is required" },
      { status: 400 },
    );
  }

  const contentType = file.type || "application/octet-stream";

  if (!ACCEPTED_TYPES.has(contentType)) {
    return NextResponse.json(
      { error: "Only PDF or plain text files are supported right now" },
      { status: 415 },
    );
  }

  const title = (formData.get("title")?.toString() || file.name || "Untitled filing").trim();

  if (!title) {
    return NextResponse.json(
      { error: "Title is required" },
      { status: 400 },
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const extension = extname(file.name) || (contentType === "application/pdf" ? ".pdf" : ".txt");
  const filePath = `${session.user.id}/${randomUUID()}${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("filings")
    .upload(filePath, buffer, {
      contentType,
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json(
      { error: uploadError.message },
      { status: 500 },
    );
  }

  const { data, error } = await supabase
    .from("filings")
    .insert({
      user_id: session.user.id,
      title,
      content: null,
      storage_path: filePath,
      original_filename: file.name,
      content_type: contentType,
      file_size: buffer.length,
      ingestion_status: "uploaded",
    })
    .select(
      "id, title, content, storage_path, original_filename, content_type, ingestion_status, file_size, extracted_at, created_at",
    )
    .single();

  if (error) {
    await supabase.storage.from("filings").remove([filePath]).catch(() => undefined);
    return NextResponse.json(
      { error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ filing: data }, { status: 201 });
}
