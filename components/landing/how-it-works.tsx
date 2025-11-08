import { cn } from "@/lib/utils";

interface Step {
  title: string;
  description: string;
}

interface HowItWorksProps {
  title: string;
  subtitle?: string;
  steps: Step[];
  className?: string;
}

export function HowItWorks({ title, subtitle, steps, className }: HowItWorksProps) {
  return (
    <section className={cn("space-y-10", "animate-in fade-in slide-in-from-bottom-4 duration-700", className)}>
      <div className="space-y-3 text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-emerald-50">{title}</h2>
        {subtitle ? (
          <p className="mx-auto max-w-2xl text-base text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      <div className="grid gap-6 sm:grid-cols-3">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="group relative overflow-hidden rounded-2xl border border-emerald-500/15 bg-[#080a0b]/95 p-8 text-left shadow-[0_0_45px_rgba(16,185,129,0.08)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_70px_rgba(16,185,129,0.2)]"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.18),transparent_65%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative space-y-3">
              <span className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-400/80">
                Step {index + 1}
              </span>
              <h3 className="text-lg font-semibold text-emerald-50">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
