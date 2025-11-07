"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function BackendRouteExample() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTestApi = async () => {
    setIsLoading(true);
    setResponse(null);
    try {
      const res = await fetch("/api/examples/hello", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      setResponse({ status: res.status, data });
    } catch (error) {
      setResponse({ error: "Failed to call API" });
    } finally {
      setIsLoading(false);
    }
  };

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
            <h1 className="text-4xl font-bold mb-2">Example: Backend Route in Next.js</h1>
            <p className="text-muted-foreground">
              See a working API route example
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About This Example</CardTitle>
              <CardDescription>
                This page demonstrates calling a Next.js API route
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                The API route is located at <code className="bg-muted px-1 py-0.5 rounded">app/api/examples/hello/route.ts</code>
              </p>
              <p className="text-muted-foreground">
                Try sending a message to see how the API responds!
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test the API</CardTitle>
              <CardDescription>Send a message to the backend route</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Input
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter a message"
                />
              </div>
              <Button onClick={handleTestApi} disabled={isLoading}>
                {isLoading ? "Sending..." : "Send to API"}
              </Button>

              {response && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">API Response:</h3>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-semibold">Status:</span>{" "}
                      <span className={response.status === 200 ? "text-green-600" : "text-red-600"}>
                        {response.status || "Error"}
                      </span>
                    </div>
                    <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
                      {JSON.stringify(response.data || response, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">1. Frontend (This Page)</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  When you click "Send to API", the frontend makes a POST request:
                </p>
                <code className="block text-xs bg-muted p-3 rounded">
                  fetch("/api/examples/hello", {"{"}
                  <br />
                  &nbsp;&nbsp;method: "POST",
                  <br />
                  &nbsp;&nbsp;body: JSON.stringify({"{"} message: "..." {"}"})
                  <br />
                  {"}"})
                </code>
              </div>
              <div>
                <h3 className="font-semibold mb-2">2. API Route</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  The route receives the request, processes it, and returns a response:
                </p>
                <code className="block text-xs bg-muted p-3 rounded">
                  export async function POST(request: Request) {"{"}
                  <br />
                  &nbsp;&nbsp;const body = await request.json();
                  <br />
                  &nbsp;&nbsp;return NextResponse.json({"{"}
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;echo: body.message,
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;timestamp: new Date().toISOString()
                  <br />
                  &nbsp;&nbsp;{"}"});
                  <br />
                  {"}"}
                </code>
              </div>
              <div>
                <h3 className="font-semibold mb-2">3. Response</h3>
                <p className="text-sm text-muted-foreground">
                  The frontend receives the response and displays it on the page.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Try It Yourself</h2>
            <p className="text-muted-foreground mb-4">
              Learn how to create your own API routes:
            </p>
            <Button asChild>
              <a href="https://github.com/kyritzb/lp-template/blob/main/tutorials/5)%20How%20to%20create%20a%20backend%20route%20in%20Next.js/README.md" target="_blank" rel="noopener noreferrer">
                Read Tutorial 5
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

