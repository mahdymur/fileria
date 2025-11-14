import type { Metadata } from "next";
import { HeroFullscreen } from "@/components/landing/hero-fullscreen";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";
import { Testimonials } from "@/components/landing/testimonials";
import { CtaSection } from "@/components/landing/cta-section";
import { Stats } from "@/components/landing/stats";
import { ScrollReveal } from "@/components/scroll-reveal";
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
import { LightningIcon, TargetIcon, BrainIcon } from "@/components/landing/feature-icons";

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

const features = [
  {
    icon: <LightningIcon />,
    title: "Lightning Fast",
    description:
      "Query filings and surface answers in under two seconds with enterprise-grade retrieval.",
  },
  {
    icon: <TargetIcon />,
    title: "Precise Citations",
    description:
      "Every response comes with paragraph-level references so you can validate insights instantly.",
  },
  {
    icon: <BrainIcon />,
    title: "AI-Powered Analysis",
    description:
      "Natural language understanding and financial tuning keep questions contextual and accurate.",
  },
];

const testimonials = [
  {
    quote:
      "Fileria cut our research time by 80%. What used to take hours now takes minutes. Game changer.",
    author: "Sarah Chen",
    role: "Senior Financial Analyst",
    company: "TechVentures",
  },
  {
    quote:
      "The citation feature is incredible. I can finally trust the answers and verify sources instantly.",
    author: "Michael Rodriguez",
    role: "Investment Director",
    company: "Capital Partners",
  },
  {
    quote:
      "Best tool we've adopted this year. The team loves it, and our clients are impressed with our speed.",
    author: "Emily Watson",
    role: "VP of Research",
    company: "Strategic Advisors",
  },
];

const stats = [
  {
    value: "< 2s",
    label: "Query Latency",
    description: "Average response time",
  },
  {
    value: "99%",
    label: "Accuracy Rate",
    description: "Citation-backed answers",
  },
  {
    value: "10K+",
    label: "Filings Indexed",
    description: "Ready to query instantly",
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: "Free",
    subtext: "Basic search access",
    description: "Limited filings per month and single-company queries.",
    bullets: ["Access recent SEC filings", "Text search across one ticker", "Email support"],
  },
  {
    name: "Pro",
    price: "$49/mo",
    subtext: "Unlimited queries",
    description: "Compare companies, save workspaces, and move faster with priority retrieval.",
    bullets: ["Unlimited filings & questions", "Multi-company comparisons", "Priority retrieval speeds"],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Contact us",
    subtext: "Custom data sources",
    description: "Tailored ingestion, team controls, and direct API hooks into your stack.",
    bullets: [
      "Dedicated onboarding & support",
      "Bring-your-own data lake",
      "Granular permissions & SSO",
    ],
  },
];

export const metadata: Metadata = {
  title: "Fileria | Search, don't suffer.",
  description:
    "Fileria makes financial research painless with instant answers from SEC filings and reports.",
};

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-black">
      <ScrollReveal />
      {/* Full Screen Hero */}
      <HeroFullscreen
        title="search, don't suffer."
        description="We make financial research painless. Query SEC filings and reports instantly with AI-powered precision."
        primaryCta={{ label: "Start Free Trial", href: "/app" }}
        secondaryCta={{ label: "View Pricing", href: "#pricing", variant: "outline" }}
      />

      {/* Gradient Transition into Content */}
      <div className="relative z-10 -mt-32">
        <div className="h-32 bg-gradient-to-b from-transparent via-black/60 to-black" />

        {/* Solid Black Content Area */}
        <div className="bg-black pb-24">
          <div className="flex flex-col space-y-32">
            {/* Stats Section */}
            <section id="stats" data-scroll-reveal className="relative px-4">
              <div className="mx-auto w-full max-w-6xl">
                <Stats stats={stats} />
              </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" data-scroll-reveal className="relative px-4">
              <HowItWorks
                title="Your path to faster, painless financial research"
                subtitle="An automated, AI-powered workflow that takes you from raw SEC filings to trusted answers in seconds."
                steps={steps}
              />
            </section>

            {/* Features Section */}
            <section id="features" data-scroll-reveal className="relative px-4">
              <div className="mx-auto w-full max-w-6xl">
                <Features
                  title="Everything you need to research faster"
                  subtitle="Powerful features designed for financial professionals who value speed and accuracy."
                  features={features}
                />
              </div>
            </section>

            {/* Pricing */}
            <section id="pricing" data-scroll-reveal className="relative px-4">
              <div className="mx-auto w-full max-w-6xl space-y-12">
                <div className="space-y-4 text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-300/80">
                    Pricing
                  </p>
                  <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                    Plans built for every research workflow
                  </h2>
                  <p className="text-base leading-relaxed text-white/70">
                    No surprise fees—just the speed, collaboration, and security your team needs.
                  </p>
                </div>
                <div className="grid gap-6 md:grid-cols-3">
                  {pricingPlans.map((plan) => (
                    <Card
                      key={plan.name}
                      className={cn(
                        "relative flex h-full flex-col overflow-hidden border-white/10 bg-white/[0.02] text-left transition-transform duration-500 hover:-translate-y-1.5",
                        plan.highlighted
                          ? "border-emerald-500/40 shadow-[0_35px_120px_rgba(16,185,129,0.3)]"
                          : "shadow-[0_30px_90px_rgba(0,0,0,0.65)]",
                      )}
                    >
                      {plan.highlighted ? (
                        <span className="absolute right-4 top-4 rounded-full border border-emerald-500/60 bg-emerald-500/15 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-emerald-200">
                          Popular
                        </span>
                      ) : null}
                      <CardHeader className="space-y-2">
                        <CardTitle className="text-2xl font-semibold text-white">{plan.name}</CardTitle>
                        <CardDescription className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-emerald-300/80">
                          {plan.subtext}
                        </CardDescription>
                        <div className="text-3xl font-semibold text-white">{plan.price}</div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-white/70">{plan.description}</p>
                        <ul className="space-y-2 text-sm text-white/70">
                          {plan.bullets.map((item) => (
                            <li key={item} className="flex items-center gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter className="mt-auto">
                        <Button asChild className="w-full" size="lg" variant={plan.highlighted ? "default" : "outline"}>
                          <a href="/app">{plan.highlighted ? "Start Pro" : "Get Started"}</a>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            </section>

            {/* Testimonials */}
            <section data-scroll-reveal className="relative px-4">
              <div className="mx-auto w-full max-w-6xl">
                <Testimonials
                  title="Trusted by financial teams"
                  testimonials={testimonials}
                />
              </div>
            </section>

            {/* CTA Section */}
            <section data-scroll-reveal className="relative px-4">
              <div className="mx-auto w-full max-w-6xl">
                <CtaSection
                  title="Ready to transform your research workflow?"
                  description="Join hundreds of financial teams using Fileria to work faster and smarter."
                  primaryCta={{ label: "Start Free Trial", href: "/app" }}
                  secondaryCta={{ label: "Schedule Demo", href: "#pricing" }}
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
