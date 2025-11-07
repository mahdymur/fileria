import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/examples/profile-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function ProfileExamplePage() {
  const supabase = await createClient();
  
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl space-y-8">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link href="/examples">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-4xl font-bold mb-2">Example: Saveable Profile (CRUD)</h1>
            <p className="text-muted-foreground">
              Complete CRUD example with profile form and database
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 border rounded-lg bg-accent/50">
            <h2 className="text-2xl font-semibold mb-4">About This Example</h2>
            <p className="text-muted-foreground mb-4">
              This example demonstrates a complete CRUD (Create, Read, Update, Delete) system:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li><strong>Create</strong>: Fill out the form and save to create a new profile</li>
              <li><strong>Read</strong>: View your saved profile on the view page</li>
              <li><strong>Update</strong>: Modify the form and save again to update your profile</li>
              <li><strong>Delete</strong>: Can be added with a DELETE endpoint (not shown here)</li>
            </ul>
          </div>

          <ProfileForm />

          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/examples/profile/view">View Your Profile</Link>
            </Button>
          </div>

          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">How It Works</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">1. Form Submission (Create/Update)</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  When you submit the form, it sends a POST request to the API:
                </p>
                <code className="block text-xs bg-muted p-3 rounded">
                  POST /api/examples/profile
                  <br />
                  Body: {"{"} name: "...", bio: "..." {"}"}
                </code>
              </div>
              <div>
                <h3 className="font-semibold mb-2">2. API Route Processing</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  The API route checks if a profile exists for the current user:
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>If no profile exists → Creates a new row in Supabase</li>
                  <li>If profile exists → Updates the existing row</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">3. Reading the Profile</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  When the page loads, it fetches your profile:
                </p>
                <code className="block text-xs bg-muted p-3 rounded">
                  GET /api/examples/profile
                </code>
                <p className="text-sm text-muted-foreground mt-2">
                  The form is pre-filled with your existing data if you have a profile.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Database Setup</h2>
            <p className="text-muted-foreground mb-4">
              Before using this example, you need to create a <code className="bg-muted px-1 py-0.5 rounded">profiles</code> table in Supabase:
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <pre className="text-xs overflow-x-auto">
{`create table profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) unique not null,
  name text,
  bio text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);`}
              </pre>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              See the full tutorial for Row Level Security (RLS) policies setup.
            </p>
          </div>

          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Try It Yourself</h2>
            <p className="text-muted-foreground mb-4">
              Learn how to build a complete CRUD system:
            </p>
            <Button asChild>
              <a href="https://github.com/kyritzb/lp-template/blob/main/tutorials/6)%20Creating%20A%20Saveable%20Profile%20for%20each%20user/README.md" target="_blank" rel="noopener noreferrer">
                Read Tutorial 6
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

