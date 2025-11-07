import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function ViewProfilePage() {
  const supabase = await createClient();
  
  const { data: authData } = await supabase.auth.getClaims();
  if (!authData?.claims) {
    redirect("/auth/login");
  }

  // Fetch profile directly from Supabase (server-side)
  let profile = null;
  try {
    const { data: profileData, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", authData.claims.sub)
      .single();
    
    if (!error && profileData) {
      profile = profileData;
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl space-y-8">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link href="/examples/profile">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-4xl font-bold mb-2">View Your Profile</h1>
            <p className="text-muted-foreground">
              See your saved profile information
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>Profile information retrieved from the database</CardDescription>
          </CardHeader>
          <CardContent>
            {profile ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Name</p>
                  <p className="text-lg font-semibold">{profile.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Bio</p>
                  <p className="text-base whitespace-pre-wrap">{profile.bio}</p>
                </div>
                {profile.created_at && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Created</p>
                    <p className="text-sm">{new Date(profile.created_at).toLocaleString()}</p>
                  </div>
                )}
                {profile.updated_at && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
                    <p className="text-sm">{new Date(profile.updated_at).toLocaleString()}</p>
                  </div>
                )}
                <div className="mt-6 pt-4 border-t">
                  <Button asChild variant="outline">
                    <Link href="/examples/profile">Edit Profile</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No profile found.</p>
                <Button asChild>
                  <Link href="/examples/profile">Create Your Profile</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">How This Works</h2>
          <p className="text-muted-foreground mb-4">
            This page demonstrates the <strong>Read</strong> part of CRUD:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
            <li>The page loads and checks if you're logged in</li>
            <li>It queries Supabase directly for your profile (server-side)</li>
            <li>Your profile data is displayed on the page</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

