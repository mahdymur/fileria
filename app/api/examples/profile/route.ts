import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET - Read profile
export async function GET() {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get profile from database
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();
    
    if (error && error.code !== "PGRST116") { // PGRST116 = no rows returned
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(data || null);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create or update profile
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Read request body
    const body = await request.json();
    const { name, bio } = body;
    
    // Validate input
    if (!name || !bio) {
      return NextResponse.json(
        { error: "Name and bio are required" },
        { status: 400 }
      );
    }
    
    // Check if profile exists
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", user.id)
      .single();
    
    let data, error;
    
    if (existing) {
      // Update existing profile
      ({ data, error } = await supabase
        .from("profiles")
        .update({ name, bio, updated_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .select()
        .single());
    } else {
      // Create new profile
      ({ data, error } = await supabase
        .from("profiles")
        .insert({ user_id: user.id, name, bio })
        .select()
        .single());
    }
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(data, { status: existing ? 200 : 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

