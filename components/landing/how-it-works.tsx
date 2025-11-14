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
  const miniMocks = [
    () => (
      <div className="relative flex h-48 w-full flex-col rounded-[22px] border border-white/8 bg-gradient-to-b from-slate-900/80 via-slate-950 to-black p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
        <div className="mb-4 flex items-center gap-2">
          {["#1f2937", "#4ade80", "#1f2937"].map((color, idx) => (
            <span
              key={idx}
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <div className="flex-1 grid grid-cols-3 gap-3">
          {[...Array(6)].map((_item, idx) => (
            <div
              key={idx}
              className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-3"
            >
              <div className="h-7 rounded-lg bg-gradient-to-br from-emerald-300/50 to-transparent" />
              <div className="h-2 w-3/4 rounded-full bg-white/10" />
              <div className="h-2 w-1/2 rounded-full bg-white/5" />
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-end gap-2 text-[0.65rem] text-white/70">
          <span className="rounded-full border border-white/10 px-3 py-0.5">10-K</span>
          <span className="rounded-full border border-white/10 px-3 py-0.5">10-Q</span>
        </div>
      </div>
    ),
    () => (
      <div className="relative flex h-48 w-full flex-col gap-4 rounded-[22px] border border-white/8 bg-gradient-to-b from-slate-900/80 via-slate-950 to-black p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/60">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Ask better questions
          </div>
          <div className="mt-3 h-9 rounded-xl bg-black/40 p-1">
            <div className="h-full w-1/2 rounded-xl bg-gradient-to-r from-emerald-300/70 to-transparent" />
          </div>
        </div>
        <div className="space-y-2">
          {[60, 85, 70].map((width, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs text-white/70">
                Q
              </div>
              <div className="h-3 rounded-full bg-white/8" style={{ width: `${width}%` }} />
            </div>
          ))}
        </div>
      </div>
    ),
    () => (
      <div className="relative flex h-48 w-full flex-col gap-4 rounded-[22px] border border-white/8 bg-gradient-to-b from-slate-900/80 via-slate-950 to-black p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
        <div className="grid flex-1 grid-cols-2 gap-4">
          <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.05] p-4">
            <div className="flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.35em] text-emerald-200/90">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Answer
            </div>
            <div className="space-y-1.5 text-xs text-white/70">
              {[60, 80, 65].map((width, idx) => (
                <div key={idx} className="h-2 rounded-full bg-emerald-300/30" style={{ width: `${width}%` }} />
              ))}
            </div>
          </div>
          <div className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            {[55, 80, 45].map((width, idx) => (
              <div key={idx} className="rounded-xl border border-white/5 bg-black/60 p-3">
                <div className="flex items-center justify-between text-[0.6rem] uppercase tracking-[0.35em] text-white/50">
                  <span>Excerpt</span>
                  <span className="text-emerald-300/80">§</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-white/10" style={{ width: `${width}%` }} />
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-end text-[0.65rem] font-semibold text-emerald-200/90">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 px-3 py-1">
            <span className="text-emerald-400">✓</span>
            Cited
          </div>
        </div>
      </div>
    ),
  ];

  return (
    <section className={cn("relative mx-auto w-full max-w-6xl space-y-10", className)}>
      <div className="space-y-3 text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-[2.7rem]">
          {title}
        </h2>
        {subtitle ? (
          <p className="mx-auto max-w-3xl text-base leading-relaxed text-white/70">{subtitle}</p>
        ) : null}
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {steps.map((step, index) => {
          const Visual = miniMocks[index];
          const stepNumber = `0${index + 1}`.slice(-2);

          return (
            <div
              key={step.title}
              className={cn(
                "group flex h-full flex-col gap-8 rounded-[28px] border border-white/10 bg-gradient-to-b from-white/[0.04] via-black/80 to-black p-8",
                "shadow-[0_40px_90px_rgba(0,0,0,0.55)] transition-all duration-500",
                "hover:-translate-y-3 hover:border-emerald-400/40 hover:shadow-[0_50px_120px_rgba(0,0,0,0.7)]",
              )}
            >
              <div className="relative">
                <div className="rounded-[20px] border border-white/8 bg-gradient-to-b from-slate-900/80 via-slate-950 to-black p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] overflow-hidden pb-6">
                  {Visual ? <Visual /> : null}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 rounded-b-[20px] bg-gradient-to-b from-transparent via-black/60 to-black" />
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300/80">
                  {stepNumber} · Step {index + 1}
                </p>
                <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                <p className="text-sm leading-relaxed text-white/80">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
