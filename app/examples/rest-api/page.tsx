import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function RestApiExample() {
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
            <h1 className="text-4xl font-bold mb-2">Example: What is a REST API</h1>
            <p className="text-muted-foreground">
              Understanding REST APIs through visual examples
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>REST API Analogy</CardTitle>
              <CardDescription>Think of an API like a restaurant</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">You (Frontend)</h3>
                  <p className="text-sm text-muted-foreground">
                    You want to order food (request data)
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Waiter (API)</h3>
                  <p className="text-sm text-muted-foreground">
                    Takes your order to the kitchen (processes request)
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Kitchen (Backend)</h3>
                  <p className="text-sm text-muted-foreground">
                    Prepares your food (processes data)
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Waiter Returns (Response)</h3>
                  <p className="text-sm text-muted-foreground">
                    Brings your food back (returns data)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>HTTP Methods Explained</CardTitle>
              <CardDescription>Different actions you can perform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono font-bold text-green-700 dark:text-green-300">GET</span>
                    <span className="font-semibold">Read Data</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Like asking "Can I see that user's profile?"
                  </p>
                  <code className="block mt-2 text-xs bg-muted p-2 rounded">
                    GET /api/users/123
                  </code>
                </div>

                <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono font-bold text-blue-700 dark:text-blue-300">POST</span>
                    <span className="font-semibold">Create Data</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Like saying "Please create a new user"
                  </p>
                  <code className="block mt-2 text-xs bg-muted p-2 rounded">
                    POST /api/users
                  </code>
                </div>

                <div className="p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-950">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono font-bold text-yellow-700 dark:text-yellow-300">PUT/PATCH</span>
                    <span className="font-semibold">Update Data</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Like saying "Please update this user's email"
                  </p>
                  <code className="block mt-2 text-xs bg-muted p-2 rounded">
                    PUT /api/users/123
                  </code>
                </div>

                <div className="p-4 border rounded-lg bg-red-50 dark:bg-red-950">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono font-bold text-red-700 dark:text-red-300">DELETE</span>
                    <span className="font-semibold">Delete Data</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Like saying "Please delete this user"
                  </p>
                  <code className="block mt-2 text-xs bg-muted p-2 rounded">
                    DELETE /api/users/123
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Example API Request & Response</CardTitle>
              <CardDescription>See how a real API call works</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Request:</h3>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm space-y-2">
                  <div>
                    <span className="text-blue-600 dark:text-blue-400">GET</span> /api/users/123
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Headers: Authorization: Bearer token123
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Response:</h3>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                  <div className="text-green-600 dark:text-green-400 mb-2">Status: 200 OK</div>
                  <pre className="text-xs overflow-x-auto">
{`{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com"
}`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Why Use REST APIs?</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                <li>Separation of concerns - Frontend and backend can be developed separately</li>
                <li>Reusability - One API can serve multiple clients (web, mobile, etc.)</li>
                <li>Scalability - Easy to scale and maintain</li>
                <li>Standardization - Uses well-known HTTP methods and status codes</li>
                <li>Flexibility - Can change backend without affecting frontend</li>
              </ul>
            </CardContent>
          </Card>

          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Try It Yourself</h2>
            <p className="text-muted-foreground mb-4">
              Learn more about REST APIs:
            </p>
            <Button asChild>
              <a href="https://github.com/kyritzb/lp-template/blob/main/tutorials/4)%20What%20is%20a%20REST%20API/README.md" target="_blank" rel="noopener noreferrer">
                Read Tutorial 4
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

