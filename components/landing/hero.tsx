import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CtaConfig {
  label: string;
  href: string;
  variant?: "default" | "outline";
}

interface LandingHeroProps {
  title: string;
  description: string;
  eyebrow?: string;
  primaryCta: CtaConfig;
  secondaryCta: CtaConfig;
  className?: string;
}

export function LandingHero({
  title,
  description,
  eyebrow,
  primaryCta,
  secondaryCta,
  className,
}: LandingHeroProps) {
  return (
    <section
      className={cn(
  "relative overflow-hidden rounded-[36px] border border-primary/25 bg-[hsl(var(--background)/0.78)] px-8 py-20 shadow-neon transition-all duration-700",
        "animate-in fade-in slide-in-from-bottom-2 duration-700 backdrop-blur",
        "before:pointer-events-none before:absolute before:inset-[-40%] before:-z-10 before:animate-aurora before:bg-[conic-gradient(from_90deg,rgba(0,255,133,0.35)_0%,rgba(0,0,0,0)_55%,rgba(0,255,133,0.35)_100%)] before:opacity-60 before:mix-blend-screen before:content-['']",
        "after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:bg-[linear-gradient(130deg,rgba(0,255,133,0.18)_0%,transparent_42%,transparent_58%,rgba(0,255,133,0.2)_100%)] after:content-['']",
        className,
      )}
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center">
        {eyebrow ? (
          <span className="rounded-full border border-primary/40 bg-primary/10 px-4 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-primary">
            {eyebrow}
          </span>
        ) : null}
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {title}
          </h1>
          <p className="text-lg text-muted-foreground sm:text-xl">
            {description}
          </p>
        </div>
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="min-w-[160px]">
            <Link href={primaryCta.href}>{primaryCta.label}</Link>
          </Button>
          <Button asChild size="lg" variant={secondaryCta.variant ?? "outline"} className="min-w-[160px]">
            <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
          </Button>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 -translate-y-1/2 bg-[radial-gradient(circle,var(--tw-gradient-stops))] from-primary/25 via-transparent to-transparent blur-3xl" />
      <div className="pointer-events-none absolute inset-0 -z-20 bg-aurora-grid opacity-40" />
    </section>
  );
}
