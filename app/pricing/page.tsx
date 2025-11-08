import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    price: "Free",
    subtext: "Basic search access",
    description: "Limited filings per month and single-company queries.",
    bullets: [
      "Access recent SEC filings",
      "Text search across a single ticker",
      "No comparisons",
    ],
  },
  {
    name: "Pro",
    price: "$49/mo",
    subtext: "Unlimited queries",
    description: "Faster retrieval with multi-company comparisons and saved workspaces.",
    bullets: [
      "Unlimited filings and questions",
      "Compare up to five companies",
      "Priority retrieval speeds",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Contact us",
    subtext: "Custom data sources",
    description: "Tailored ingestion, team controls, and direct API hooks into your stack.",
    bullets: [
      "Dedicated support and onboarding",
      "Bring-your-own data lake",
      "Granular permissions & SSO",
    ],
  },
];

const faqs = [
  {
    question: "Is there a free trial?",
    answer: "Yes. The Free plan lets you explore core search features without a credit card.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Absolutely. Downgrade or cancel your plan from settings with a single click.",
  },
];

export const metadata: Metadata = {
  title: "Pricing | Fileria",
  description: "Simple pricing for financial analysts who want fast, citation-backed answers.",
};

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-16 px-4 py-16 sm:py-20">
      <header className="text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-emerald-50 sm:text-5xl">
          Simple pricing for smart research.
        </h1>
        <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
          Pick a plan that keeps pace with your workflow—no surprise fees, just reliable insights.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={cn(
              "relative overflow-hidden transition-transform duration-500 hover:-translate-y-1",
              plan.highlighted
                ? "border-emerald-500/40 shadow-[0_0_140px_rgba(16,185,129,0.3)]"
                : "border-emerald-500/15 shadow-[0_0_70px_rgba(16,185,129,0.16)]",
            )}
          >
            {plan.highlighted ? (
              <span className="absolute right-4 top-4 rounded-full border border-emerald-500/60 bg-emerald-500/20 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-emerald-200">
                Popular
              </span>
            ) : null}
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-semibold text-emerald-50">
                {plan.name}
              </CardTitle>
              <CardDescription className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-400/80">
                {plan.subtext}
              </CardDescription>
              <div className="text-3xl font-semibold text-emerald-50">{plan.price}</div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{plan.description}</p>
              <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                {plan.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full" size="lg" variant={plan.highlighted ? "default" : "outline"}>
                <a href="/signup">Get Started</a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </section>

      <section className="space-y-6 rounded-[28px] border border-emerald-500/15 bg-[#050607] p-10 shadow-[0_0_140px_rgba(16,185,129,0.18)]">
        <h2 className="text-2xl font-semibold tracking-tight text-emerald-50">FAQ</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {faqs.map((faq) => (
            <div key={faq.question} className="space-y-2">
              <h3 className="text-base font-semibold text-emerald-50">{faq.question}</h3>
              <p className="text-sm text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
