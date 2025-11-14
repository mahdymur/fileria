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
        "relative overflow-hidden rounded-[36px] border border-emerald-500/20 bg-[#060708]/80 px-8 py-20 shadow-[0_0_120px_rgba(16,185,129,0.15)] transition-all duration-700",
        "animate-in fade-in slide-in-from-bottom-2 duration-700 backdrop-blur-md",
        className,
      )}
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center">
        {eyebrow ? (
          <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-emerald-400 animate-in fade-in duration-1000">
            {eyebrow}
          </span>
        ) : null}
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          <h1 className="text-4xl font-semibold tracking-tight text-emerald-50 sm:text-5xl lg:text-6xl xl:text-7xl">
            {title}
          </h1>
          <p className="text-lg text-muted-foreground sm:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>
        <div className="flex flex-col items-center gap-4 sm:flex-row animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <Button asChild size="lg" className="min-w-[180px] h-12 text-base shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all">
            <Link href={primaryCta.href}>{primaryCta.label}</Link>
          </Button>
          <Button asChild size="lg" variant={secondaryCta.variant ?? "outline"} className="min-w-[180px] h-12 text-base">
            <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
