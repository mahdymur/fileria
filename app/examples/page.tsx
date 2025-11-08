import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const tutorials = [
  {
    title: "Tutorial 1: Create a Page",
    subtitle: "New routes in the App Router",
    summary: "This example shows a simple page created using the App Router.",
    exampleHref: "/examples/create-page",
    tutorialHref:
      "https://github.com/kyritzb/lp-template/blob/main/tutorials/1)%20Create%20a%20page/README.md",
  },
  {
    title: "Tutorial 2: Create a Component",
    subtitle: "Reusable building blocks",
    summary: "This example demonstrates creating and using a custom component.",
    exampleHref: "/examples/create-component",
    tutorialHref:
      "https://github.com/kyritzb/lp-template/blob/main/tutorials/2)%20Create%20a%20component/README.md",
  },
  {
    title: "Tutorial 3: Render Logged In User",
    subtitle: "Surface Supabase auth",
    summary: "This example shows how to get and display user data from Supabase.",
    exampleHref: "/examples/render-user",
    tutorialHref:
      "https://github.com/kyritzb/lp-template/blob/main/tutorials/3)%20Render%20our%20logged%20in%20user/README.md",
  },
  {
    title: "Tutorial 4: What is a REST API",
    subtitle: "Understand the fundamentals",
    summary: "This example explains REST APIs with visual examples and explanations.",
    exampleHref: "/examples/rest-api",
    tutorialHref:
      "https://github.com/kyritzb/lp-template/blob/main/tutorials/4)%20What%20is%20a%20REST%20API/README.md",
  },
  {
    title: "Tutorial 5: Create a Backend Route",
    subtitle: "Wire up API endpoints",
    summary: "This example demonstrates creating and calling a Next.js API route.",
    exampleHref: "/examples/backend-route",
    tutorialHref:
      "https://github.com/kyritzb/lp-template/blob/main/tutorials/5)%20How%20to%20create%20a%20backend%20route%20in%20Next.js/README.md",
  },
  {
    title: "Tutorial 6: Saveable Profile (CRUD)",
    subtitle: "Create, read, update",
    summary: "This example shows a complete profile system with create, read, and update operations.",
    exampleHref: "/examples/profile",
    tutorialHref:
      "https://github.com/kyritzb/lp-template/blob/main/tutorials/6)%20Creating%20A%20Saveable%20Profile%20for%20each%20user/README.md",
  },
  {
    title: "Tutorial 7: Deploy to Vercel",
    subtitle: "Ship it live",
    summary: "Step-by-step guide to push your code to GitHub and deploy to Vercel.",
    exampleHref: "/examples/deploy",
    tutorialHref:
      "https://github.com/kyritzb/lp-template/blob/main/tutorials/7)%20Push%20to%20GitHub%20and%20Deploy%20to%20Vercel/README.md",
  },
];

export default function ExamplesPage() {
  return (
    <div className="relative flex min-h-svh flex-col items-center overflow-hidden px-6 py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.2),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(120deg,rgba(16,185,129,0.08)_0%,transparent_40%,transparent_60%,rgba(16,185,129,0.08)_100%)]" />

      <div className="flex w-full max-w-5xl flex-col gap-10">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-semibold text-emerald-50 sm:text-5xl">Tutorial Examples</h1>
          <p className="text-lg text-muted-foreground">
            See working examples of each tutorial. Click on any card to explore it in action.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tutorials.map((tutorial) => (
            <Card
              key={tutorial.title}
              className="relative overflow-hidden border-emerald-500/15 shadow-[0_0_70px_rgba(16,185,129,0.14)] transition-transform duration-500 hover:-translate-y-1"
            >
              <CardHeader className="space-y-3">
                <CardTitle className="text-xl text-emerald-50">{tutorial.title}</CardTitle>
                <CardDescription className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-400/80">
                  {tutorial.subtitle}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{tutorial.summary}</p>
                <Button asChild size="lg" className="w-full">
                  <Link href={tutorial.exampleHref}>View Example</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full">
                  <a href={tutorial.tutorialHref} target="_blank" rel="noopener noreferrer">
                    Read Tutorial
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button asChild size="lg">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

