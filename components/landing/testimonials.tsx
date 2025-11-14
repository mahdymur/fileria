import { cn } from "@/lib/utils";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

interface TestimonialsProps {
  title?: string;
  testimonials: Testimonial[];
  className?: string;
}

export function Testimonials({ title, testimonials, className }: TestimonialsProps) {
  return (
    <section className={cn("relative space-y-12", className)}>
      {title && (
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-emerald-50 sm:text-4xl">
            {title}
          </h2>
        </div>
      )}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-[#060708]/80 p-8 backdrop-blur-sm transition-all duration-500 hover:border-emerald-500/40 hover:shadow-[0_0_60px_rgba(16,185,129,0.15)] animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="space-y-4">
              <div className="text-2xl text-emerald-400">"</div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {testimonial.quote}
              </p>
              <div className="space-y-1 border-t border-emerald-500/10 pt-4">
                <p className="text-sm font-semibold text-emerald-50">{testimonial.author}</p>
                <p className="text-xs text-muted-foreground">
                  {testimonial.role} at {testimonial.company}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


