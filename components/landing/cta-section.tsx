import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CtaSectionProps {
  title: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  className?: string;
}

export function CtaSection({
  title,
  description,
  primaryCta,
  secondaryCta,
  className,
}: CtaSectionProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[36px] border border-emerald-500/30 bg-gradient-to-br from-[#060708]/95 to-[#050607]/95 px-8 py-16 text-center shadow-[0_0_200px_rgba(16,185,129,0.25)] backdrop-blur-md",
        className,
      )}
    >
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold tracking-tight text-emerald-50 sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">{description}</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="min-w-[180px] shadow-lg shadow-emerald-500/20">
            <Link href={primaryCta.href}>{primaryCta.label}</Link>
          </Button>
          {secondaryCta && (
            <Button asChild size="lg" variant="outline" className="min-w-[180px]">
              <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
            </Button>
          )}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1),transparent_70%)]" />
    </section>
  );
}


