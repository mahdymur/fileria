import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message } = body;

    return NextResponse.json({
      echo: message || "No message provided",
      timestamp: new Date().toISOString(),
      received: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Hello from the API!",
    timestamp: new Date().toISOString(),
  });
}

