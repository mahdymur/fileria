import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About Fileria",
  description:
    "Discover why Fileria is building a calmer, faster way to query complex financial filings.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-16 px-4 py-16 sm:py-20">
      <header className="space-y-4 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-emerald-50 sm:text-5xl">
          Why Fileria Exists
        </h1>
        <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
          Financial research shouldn’t feel like wading through molasses. Fileria replaces the friction of
          legacy search with a calmer, more confident way to interrogate SEC filings.
        </p>
      </header>
      <section className="grid gap-6 sm:grid-cols-2 sm:gap-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
        <Card>
          <CardContent className="space-y-5 p-8 text-muted-foreground">
            <h2 className="text-2xl font-semibold text-emerald-50">
              The friction we felt firsthand
            </h2>
            <p>
              Traditional SEC research still hinges on manual search. Analysts bounce between PDFs, inline HTML,
              and spreadsheets, hoping Ctrl+F catches the right clause in a 200-page filing.
            </p>
            <p>
              Even when you find a reference, context is inconsistent. You copy-and-paste passages into decks,
              annotate them manually, and pray it’s still the latest amendment. Hours pass. Deadlines don’t.
            </p>
            <p>
              For teams tasked with reacting to markets in real time, that time drain is unacceptable. We wanted a
              calmer path—one that surfaced answers without the scramble.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-5 p-8 text-muted-foreground">
            <h2 className="text-2xl font-semibold text-emerald-50">
              How Fileria changes the workflow
            </h2>
            <p>
              Fileria combines retrieval-augmented generation with thoughtfully curated filing ingestion. You can
              ask natural questions—“How is guidance changing quarter over quarter?”—and get grounded answers
              with citation links back to the original text.
            </p>
            <p>
              No regex. No hunting through footnotes. Just instant context, summarized and auditable. The result is
              research that moves as fast as your next idea.
            </p>
            <p>
              Every interaction is tuned for minimal friction: clean typography, subtle motion, and shortcuts that
              keep analysts in flow instead of fighting docs.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-6 text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-emerald-50">
          Our Mission
        </h2>
        <p className="mx-auto max-w-2xl text-base text-muted-foreground">
          To make complex financial data as searchable as the web.
        </p>
      </section>

      <hr className="border-emerald-500/10" />

      <p className="text-center text-[0.65rem] uppercase tracking-[0.35em] text-muted-foreground">
        Built at Stevens Institute of Technology
      </p>
    </div>
  );
}
