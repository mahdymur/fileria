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

