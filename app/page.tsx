import type { Metadata } from "next";
import { LandingHero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";

const steps = [
  {
    title: "Upload filings",
    description: "Bring in SEC documents in seconds or pick from our ready-to-query library.",
  },
  {
    title: "Ask better questions",
    description: "Use natural language to interrogate financials without scrolling or Ctrl+F.",
  },
  {
    title: "See cited answers",
    description: "Get instant insights with paragraph-level citations you can trust.",
  },
];

export const metadata: Metadata = {
  title: "Fileria | Search, don’t suffer.",
  description:
    "Fileria makes financial research painless with instant answers from SEC filings and reports.",
};

export default function HomePage() {
  return (
    <div className="space-y-24 px-4 pb-24 pt-16 sm:pt-24">
      <div className="mx-auto w-full max-w-6xl space-y-24">
        <LandingHero
          eyebrow="Financial research, simplified"
          title="Search, don’t suffer."
          description="Fileria makes financial research painless — query SEC filings and reports instantly."
          primaryCta={{ label: "Try the App", href: "/app" }}
          secondaryCta={{ label: "View Pricing", href: "/pricing", variant: "outline" }}
        />

        <HowItWorks
          title="How It Works"
          subtitle="From first question to final answer in under a minute."
          steps={steps}
        />

        <section className="mx-auto max-w-3xl rounded-[28px] border border-emerald-500/20 bg-[#060708]/80 px-12 py-16 text-center shadow-[0_0_140px_rgba(16,185,129,0.16)] backdrop-blur animate-in fade-in slide-in-from-bottom-6 duration-700">
          <p className="text-lg font-medium text-emerald-50 sm:text-xl">
            “Loved by analysts who hate Ctrl+F.”
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Fileria surfaces the passages that matter, backed by citations, so you spend minutes—not afternoons—finding
            answers.
          </p>
        </section>

        <section className="grid gap-10 rounded-[32px] border border-emerald-500/20 bg-[#050607] px-10 py-14 shadow-[0_0_200px_rgba(16,185,129,0.18)] transition-all duration-700 hover:shadow-[0_0_240px_rgba(16,185,129,0.24)] animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold tracking-tight text-emerald-50 sm:text-4xl">Built for speed</h2>
            <p className="max-w-2xl text-base text-muted-foreground">
              No multi-step setup. Drag in filings, ask a question, and pivot through answers with tab-switch fast
              performance. Fileria keeps every interaction snappy so you can focus on the numbers.
            </p>
          </div>
          <dl className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-emerald-500/15 bg-[#07090a]/90 p-6 shadow-[0_0_45px_rgba(16,185,129,0.08)]">
              <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-emerald-400/80">Query latency</dt>
              <dd className="mt-4 text-3xl font-semibold text-emerald-50">&lt; 2s</dd>
              <p className="mt-2 text-xs text-muted-foreground">Average response time across filings.</p>
            </div>
            <div className="rounded-2xl border border-emerald-500/15 bg-[#07090a]/90 p-6 shadow-[0_0_45px_rgba(16,185,129,0.08)]">
              <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-emerald-400/80">Setup time</dt>
              <dd className="mt-4 text-3xl font-semibold text-emerald-50">5 min</dd>
              <p className="mt-2 text-xs text-muted-foreground">Connect data and invite teammates fast.</p>
            </div>
            <div className="rounded-2xl border border-emerald-500/15 bg-[#07090a]/90 p-6 shadow-[0_0_45px_rgba(16,185,129,0.08)]">
              <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-emerald-400/80">Accuracy</dt>
              <dd className="mt-4 text-3xl font-semibold text-emerald-50">99%</dd>
              <p className="mt-2 text-xs text-muted-foreground">Citation-backed answers you can verify.</p>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}
