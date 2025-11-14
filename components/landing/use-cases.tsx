import { cn } from "@/lib/utils";

interface UseCase {
  title: string;
  description: string;
  icon: string;
}

interface UseCasesProps {
  title: string;
  subtitle?: string;
  useCases: UseCase[];
  className?: string;
}

export function UseCases({ title, subtitle, useCases, className }: UseCasesProps) {
  return (
    <section className={cn("relative space-y-12", className)}>
      <div className="space-y-3 text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-emerald-50 sm:text-4xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">{subtitle}</p>
        )}
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        {useCases.map((useCase, index) => (
          <div
            key={useCase.title}
            className="group relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-[#060708]/80 p-10 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-[0_0_80px_rgba(16,185,129,0.2)] animate-in fade-in slide-in-from-left-4"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className="space-y-4">
              <div className="text-4xl">{useCase.icon}</div>
              <h3 className="text-xl font-semibold text-emerald-50">{useCase.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {useCase.description}
              </p>
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </div>
        ))}
      </div>
    </section>
  );
}


