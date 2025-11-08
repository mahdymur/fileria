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
    <section
      className={cn(
        "relative overflow-hidden space-y-10 rounded-[32px] border border-primary/15 bg-[hsl(var(--background)/0.8)] p-10 shadow-[0_0_90px_rgba(0,255,133,0.12)]",
        "animate-in fade-in slide-in-from-bottom-4 duration-700",
        "before:pointer-events-none before:absolute before:inset-[-45%] before:-z-10 before:animate-aurora before:bg-[conic-gradient(from_210deg,rgba(0,255,133,0.35)_0%,rgba(0,0,0,0)_55%,rgba(0,255,133,0.35)_100%)] before:opacity-50 before:mix-blend-screen before:content-['']",
        className,
      )}
    >
      <div className="space-y-3 text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">{title}</h2>
        {subtitle ? (
          <p className="mx-auto max-w-2xl text-base text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      <div className="grid gap-6 sm:grid-cols-3">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="group relative overflow-hidden rounded-2xl border border-primary/15 bg-secondary/80 p-8 text-left shadow-[0_0_45px_rgba(0,255,133,0.12)] transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_0_90px_rgba(0,255,133,0.28)]"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,255,133,0.2),transparent_65%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="pointer-events-none absolute -inset-x-1 inset-y-[55%] inline-block h-32 translate-y-6 bg-[radial-gradient(ellipse_at_center,rgba(0,255,133,0.3),transparent_60%)] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative space-y-3">
              <span className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/80">
                Step {index + 1}
              </span>
              <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    </section>
  );
}
