# Tutorial 6: Creating A Saveable Profile for Each User

In this tutorial, you'll learn how to build a complete CRUD (Create, Read, Update, Delete) system for user profiles using Next.js, Supabase, and API routes.

## What You'll Learn

- How to create a database table in Supabase
- How to build a profile form component
- How to create an API route to save profile data
- How to read and display profile data
- How to update existing profiles
- Complete CRUD operations

## What is CRUD?

**CRUD** stands for:
- **Create**: Add new data
- **Read**: Retrieve/display data
- **Update**: Modify existing data
- **Delete**: Remove data

This tutorial will show you how to implement all four operations for user profiles.

## Prerequisites

- You should have completed Tutorials 1-5
- You should have a Supabase project set up
- You should be logged in to your app

## Step-by-Step Instructions

### Step 1: Create the Profiles Table in Supabase

1. Go to your Supabase project dashboard
2. Navigate to the **Table Editor**
3. Click **"New Table"**
4. Name it `profiles`
5. Add the following columns:
   - `id` - Type: `uuid`, Default: `gen_random_uuid()`, Primary Key
   - `user_id` - Type: `uuid`, References: `auth.users(id)`, Unique
   - `name` - Type: `text`
   - `bio` - Type: `text`
   - `created_at` - Type: `timestamptz`, Default: `now()`
   - `updated_at` - Type: `timestamptz`, Default: `now()`

**Or use the SQL Editor to create it:**

```sql
create table profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) unique not null,
  name text,
  bio text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### Step 2: Enable Row Level Security (RLS)

1. In the Table Editor, click on your `profiles` table
2. Go to the **RLS** tab
3. Enable Row Level Security
4. Create policies:

**Policy 1: Users can read their own profile**
```sql
create policy "Users can view own profile"
on profiles
for select
using (auth.uid() = user_id);
```

**Policy 2: Users can insert their own profile**
```sql
create policy "Users can insert own profile"
on profiles
for insert
with check (auth.uid() = user_id);
```

**Policy 3: Users can update their own profile**
```sql
create policy "Users can update own profile"
on profiles
for update
using (auth.uid() = user_id);
```

### Step 3: Create the Profile API Route

Create `app/api/profile/route.ts`:

```typescript
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
```

### Step 4: Create the Profile Form Component

Create `components/profile-form.tsx`:

```typescript
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ProfileForm() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Load existing profile on mount
  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch("/api/profile");
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setName(data.name || "");
            setBio(data.bio || "");
          }
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setIsLoadingProfile(false);
      }
    }
    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, bio }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Profile saved successfully!" });
      } else {
        setMessage({ type: "error", text: data.error || "Failed to save profile" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingProfile) {
    return <div>Loading profile...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
        <CardDescription>Update your profile information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself"
              className="w-full min-h-[100px] px-3 py-2 border rounded-md"
              required
            />
          </div>
          {message && (
            <div className={`p-3 rounded ${
              message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}>
              {message.text}
            </div>
          )}
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

### Step 5: Create the Profile Page

Create `app/profile/page.tsx`:

```typescript
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/profile-form";

export default async function ProfilePage() {
  const supabase = await createClient();
  
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) {
    redirect("/auth/login");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <ProfileForm />
      </div>
    </div>
  );
}
```

### Step 6: Display Profile on Another Page

Create `app/profile/view/page.tsx` to read and display the profile:

```typescript
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ViewProfilePage() {
  const supabase = await createClient();
  
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) {
    redirect("/auth/login");
  }

  // Fetch profile from API
  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/profile`, {
    cache: "no-store",
  });
  
  const profile = response.ok ? await response.json() : null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>View your saved profile information</CardDescription>
          </CardHeader>
          <CardContent>
            {profile ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="text-lg font-semibold">{profile.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Bio</p>
                  <p className="text-base">{profile.bio}</p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No profile found. Create one first!</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

## How It Works

1. **Create**: User fills out the form and submits → API route receives POST request → Data is inserted into Supabase
2. **Read**: Page loads → API route receives GET request → Data is retrieved from Supabase → Displayed on page
3. **Update**: User modifies form and submits → API route checks if profile exists → Updates existing row in Supabase
4. **Delete**: (Optional) Can be added with a DELETE method

## Key Concepts

- **API Routes**: Handle backend logic (database operations)
- **Client Components**: Handle user interactions (forms, buttons)
- **Server Components**: Can fetch data directly from Supabase
- **Row Level Security**: Ensures users can only access their own data

## Next Steps

Try extending this example:
- Add more fields to the profile (avatar, location, etc.)
- Add a DELETE endpoint
- Add validation for form fields
- Add image upload functionality

## See It Working

Check out the example page at `/examples/profile` to see a complete working profile system!

