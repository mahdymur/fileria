import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function CreatePageExample() {
  return (
    <div className="relative flex min-h-svh flex-col items-center overflow-hidden px-6 py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.18),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(135deg,rgba(16,185,129,0.08)_0%,transparent_45%,transparent_55%,rgba(16,185,129,0.08)_100%)]" />
      <div className="w-full max-w-2xl space-y-10">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link href="/examples">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="mb-2 text-4xl font-semibold text-emerald-50">Example: Create a Page</h1>
            <p className="text-muted-foreground">
              This is an example page created following Tutorial 1.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border-emerald-500/15">
            <CardContent className="space-y-4 p-6">
              <h2 className="text-2xl font-semibold text-emerald-50">About This Example</h2>
              <p className="text-muted-foreground">This page was created by:</p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>
                  Creating a folder called <code className="rounded bg-[#0b0c0e] px-1 py-0.5">create-page</code> in the <code className="rounded bg-[#0b0c0e] px-1 py-0.5">app/examples</code> directory.
                </li>
                <li>
                  Creating a file called <code className="rounded bg-[#0b0c0e] px-1 py-0.5">page.tsx</code> inside that folder.
                </li>
                <li>Writing a React component that returns JSX.</li>
                <li>Exporting it as the default export.</li>
              </ol>
            </CardContent>
          </Card>

          <Card className="border-emerald-500/15">
            <CardContent className="space-y-4 p-6">
              <h2 className="text-xl font-semibold text-emerald-50">The Route</h2>
              <p className="text-muted-foreground">This page is accessible at:</p>
              <code className="block rounded-xl border border-emerald-500/20 bg-[#0b0c0e] p-3 text-sm text-emerald-200/90">
                /examples/create-page
              </code>
              <p className="text-sm text-muted-foreground">
                The URL path matches the folder structure in the <code className="rounded bg-[#0b0c0e] px-1 py-0.5">app</code> directory.
              </p>
            </CardContent>
          </Card>

          <Card className="border-emerald-500/15">
            <CardContent className="space-y-4 p-6">
              <h2 className="text-xl font-semibold text-emerald-50">Try It Yourself</h2>
              <p className="text-muted-foreground">
                Follow the tutorial to create your own page:
              </p>
              <Button asChild size="lg">
                <a
                  href="https://github.com/kyritzb/lp-template/blob/main/tutorials/1)%20Create%20a%20page/README.md"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read Tutorial 1
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

