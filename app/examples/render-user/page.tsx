import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function RenderUserExample() {
  const supabase = await createClient();
  
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-8">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link href="/examples">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-4xl font-bold mb-2">Example: Render Logged In User</h1>
            <p className="text-muted-foreground">
              This example shows how to get and display user information
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 border rounded-lg bg-accent/50">
            <h2 className="text-2xl font-semibold mb-4">About This Example</h2>
            <p className="text-muted-foreground mb-4">
              This page demonstrates how to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Get the current user from Supabase</li>
              <li>Display user information</li>
              <li>Handle cases where no user is logged in</li>
            </ul>
          </div>

          {user ? (
            <Card>
              <CardHeader>
                <CardTitle>Your User Information</CardTitle>
                <CardDescription>
                  This data comes from Supabase authentication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <p className="text-lg font-semibold">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">User ID</p>
                  <p className="text-sm font-mono break-all">{user.sub}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Full User Data</p>
                  <pre className="text-xs font-mono p-3 bg-muted rounded border max-h-48 overflow-auto">
                    {JSON.stringify(user, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Not Logged In</CardTitle>
                <CardDescription>
                  You need to be logged in to see user information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  This example shows what happens when no user is logged in. 
                  In a real application, you might want to redirect to the login page.
                </p>
                <div className="flex gap-2">
                  <Button asChild>
                    <Link href="/auth/login">Go to Login</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/auth/sign-up">Sign Up</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">How It Works</h2>
            <p className="text-muted-foreground mb-4">
              The code uses:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li><code className="bg-muted px-1 py-0.5 rounded">createClient()</code> from <code className="bg-muted px-1 py-0.5 rounded">@/lib/supabase/server</code></li>
              <li><code className="bg-muted px-1 py-0.5 rounded">supabase.auth.getClaims()</code> to get user data</li>
              <li>Conditional rendering to show different content based on login status</li>
            </ul>
          </div>

          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Try It Yourself</h2>
            <p className="text-muted-foreground mb-4">
              Follow the tutorial to display user information in your own pages:
            </p>
            <Button asChild>
              <a href="https://github.com/kyritzb/lp-template/blob/main/tutorials/3)%20Render%20our%20logged%20in%20user/README.md" target="_blank" rel="noopener noreferrer">
                Read Tutorial 3
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

