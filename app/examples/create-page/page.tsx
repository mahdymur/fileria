import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function CreatePageExample() {
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
            <h1 className="text-4xl font-bold mb-2">Example: Create a Page</h1>
            <p className="text-muted-foreground">
              This is an example page created following Tutorial 1
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 border rounded-lg bg-accent/50">
            <h2 className="text-2xl font-semibold mb-4">About This Example</h2>
            <p className="text-muted-foreground mb-4">
              This page was created by:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Creating a folder called <code className="bg-muted px-1 py-0.5 rounded">create-page</code> in the <code className="bg-muted px-1 py-0.5 rounded">app/examples</code> directory</li>
              <li>Creating a file called <code className="bg-muted px-1 py-0.5 rounded">page.tsx</code> inside that folder</li>
              <li>Writing a React component that returns JSX</li>
              <li>Exporting it as the default export</li>
            </ol>
          </div>

          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">The Route</h2>
            <p className="text-muted-foreground mb-2">
              This page is accessible at:
            </p>
            <code className="block p-3 bg-muted rounded text-sm">
              /examples/create-page
            </code>
            <p className="text-sm text-muted-foreground mt-4">
              The URL path matches the folder structure in the <code className="bg-muted px-1 py-0.5 rounded">app</code> directory!
            </p>
          </div>

          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Try It Yourself</h2>
            <p className="text-muted-foreground mb-4">
              Follow the tutorial to create your own page:
            </p>
            <Button asChild>
              <a href="https://github.com/kyritzb/lp-template/blob/main/tutorials/1)%20Create%20a%20page/README.md" target="_blank" rel="noopener noreferrer">
                Read Tutorial 1
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

