import { SignUpForm } from "@/components/sign-up-form";
import { CheckCircle2 } from "lucide-react";

export default function Page() {
  return (
    <div className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-[#040506] px-6 py-16 text-foreground sm:py-20 lg:py-24">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.36),transparent_78%)]" />
      <div className="pointer-events-none absolute inset-0 -z-30 bg-[linear-gradient(120deg,rgba(16,185,129,0.08)_0%,transparent_45%,transparent_55%,rgba(16,185,129,0.08)_100%)]" />
      <div className="pointer-events-none absolute inset-y-0 right-[5%] -z-10 hidden h-[540px] w-[540px] bg-[radial-gradient(circle_at_center,rgba(14,116,144,0.15),transparent_68%)] blur-3xl lg:block" />

      <div className="relative z-10 grid w-full max-w-6xl items-center gap-16 lg:grid-cols-2">
        <div className="order-2 space-y-8 text-center lg:order-1 lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-emerald-200">
            Start faster
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold text-emerald-50 sm:text-5xl lg:text-6xl">
              Create your Fileria account in minutes.
            </h1>
            <p className="max-w-xl text-base text-muted-foreground lg:text-lg">
              Upload filings, ask follow-up questions, and share insight-packed summaries without wrestling PDFs. Your team won’t go back to Ctrl+F again.
            </p>
          </div>
          <div className="grid gap-4 text-left sm:grid-cols-2">
            {[
              "Unlimited questions on the Pro plan",
              "Paragraph-level citations for every answer",
              "Shared spaces for collaborative research",
              "SOC2-ready infrastructure at launch",
            ].map((benefit) => (
              <div
                key={benefit}
                className="flex items-start gap-3 rounded-2xl border border-emerald-500/15 bg-[#080a0b]/80 p-4 shadow-[0_0_45px_rgba(16,185,129,0.14)]"
              >
                <CheckCircle2 className="mt-1 h-5 w-5 text-emerald-300" />
                <span className="text-sm text-muted-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="order-1 mx-auto w-full max-w-md lg:order-2 lg:justify-self-end">
          <SignUpForm />
          <p className="mt-6 text-center text-xs uppercase tracking-[0.28em] text-muted-foreground">
            Prefer a guided tour? <a href="mailto:hello@fileria.ai" className="text-emerald-300 hover:text-emerald-200">Book a demo</a>
          </p>
        </div>
      </div>
    </div>
  );
}
