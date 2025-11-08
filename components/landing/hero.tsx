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
        "relative overflow-hidden rounded-[32px] border border-emerald-500/20 bg-[#07090a]/90 px-8 py-20 shadow-[0_0_220px_rgba(16,185,129,0.22)] transition-all duration-700 hover:shadow-[0_0_260px_rgba(16,185,129,0.3)]",
        "animate-in fade-in slide-in-from-bottom-2 duration-700 backdrop-blur",
        className,
      )}
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center">
        {eyebrow ? (
          <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-emerald-300">
            {eyebrow}
          </span>
        ) : null}
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight text-emerald-50 sm:text-5xl">
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
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_-10%,rgba(16,185,129,0.3),transparent_65%),radial-gradient(circle_at_80%_0,rgba(14,116,144,0.18),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(120deg,rgba(16,185,129,0.08)_0%,transparent_35%,transparent_65%,rgba(16,185,129,0.08)_100%)]" />
    </section>
  );
}
