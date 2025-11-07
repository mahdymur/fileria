import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ExamplesPage() {
  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <div className="w-full max-w-5xl flex flex-col gap-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Tutorial Examples</h1>
          <p className="text-muted-foreground text-lg">
            See working examples of each tutorial. Click on any example to see it in action!
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Tutorial 1: Create a Page</CardTitle>
              <CardDescription>
                Learn how to create a new page route in Next.js
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This example shows a simple page created using the App Router.
              </p>
              <Button asChild className="w-full">
                <Link href="/examples/create-page">View Example</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <a href="https://github.com/kyritzb/lp-template/blob/main/tutorials/1)%20Create%20a%20page/README.md" target="_blank" rel="noopener noreferrer">
                  Read Tutorial
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tutorial 2: Create a Component</CardTitle>
              <CardDescription>
                Learn how to create reusable React components
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This example demonstrates creating and using a custom component.
              </p>
              <Button asChild className="w-full">
                <Link href="/examples/create-component">View Example</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <a href="https://github.com/kyritzb/lp-template/blob/main/tutorials/2)%20Create%20a%20component/README.md" target="_blank" rel="noopener noreferrer">
                  Read Tutorial
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tutorial 3: Render Logged In User</CardTitle>
              <CardDescription>
                Learn how to display the current user's information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This example shows how to get and display user data from Supabase.
              </p>
              <Button asChild className="w-full">
                <Link href="/examples/render-user">View Example</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <a href="https://github.com/kyritzb/lp-template/blob/main/tutorials/3)%20Render%20our%20logged%20in%20user/README.md" target="_blank" rel="noopener noreferrer">
                  Read Tutorial
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tutorial 4: What is a REST API</CardTitle>
              <CardDescription>
                Learn what REST APIs are and how they work
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This example explains REST APIs with visual examples and explanations.
              </p>
              <Button asChild className="w-full">
                <Link href="/examples/rest-api">View Example</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <a href="https://github.com/kyritzb/lp-template/blob/main/tutorials/4)%20What%20is%20a%20REST%20API/README.md" target="_blank" rel="noopener noreferrer">
                  Read Tutorial
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tutorial 5: Create a Backend Route</CardTitle>
              <CardDescription>
                Learn how to create API routes in Next.js
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This example demonstrates creating and calling a Next.js API route.
              </p>
              <Button asChild className="w-full">
                <Link href="/examples/backend-route">View Example</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <a href="https://github.com/kyritzb/lp-template/blob/main/tutorials/5)%20How%20to%20create%20a%20backend%20route%20in%20Next.js/README.md" target="_blank" rel="noopener noreferrer">
                  Read Tutorial
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tutorial 6: Saveable Profile (CRUD)</CardTitle>
              <CardDescription>
                Build a complete CRUD system for user profiles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This example shows a complete profile system with create, read, and update operations.
              </p>
              <Button asChild className="w-full">
                <Link href="/examples/profile">View Example</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <a href="https://github.com/kyritzb/lp-template/blob/main/tutorials/6)%20Creating%20A%20Saveable%20Profile%20for%20each%20user/README.md" target="_blank" rel="noopener noreferrer">
                  Read Tutorial
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tutorial 7: Deploy to Vercel</CardTitle>
              <CardDescription>
                Push to GitHub and deploy your app to the internet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Step-by-step guide to push your code to GitHub and deploy to Vercel.
              </p>
              <Button asChild className="w-full">
                <Link href="/examples/deploy">View Example</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <a href="https://github.com/kyritzb/lp-template/blob/main/tutorials/7)%20Push%20to%20GitHub%20and%20Deploy%20to%20Vercel/README.md" target="_blank" rel="noopener noreferrer">
                  Read Tutorial
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Button asChild variant="outline">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

