"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface Feature {
  icon: ReactNode;
  title: string;
  description: string;
}

interface FeaturesProps {
  title: string;
  subtitle?: string;
  features: Feature[];
  className?: string;
}

export function Features({ title, subtitle, features, className }: FeaturesProps) {
  return (
    <section className={cn("relative space-y-12", className)}>
      <div className="space-y-3 text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-emerald-50 sm:text-4xl lg:text-5xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">{subtitle}</p>
        )}
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className="group relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-[#060708]/80 p-8 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-[0_0_60px_rgba(16,185,129,0.2)] animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-emerald-50 text-center">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground text-center">
                {feature.description}
              </p>
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </div>
        ))}
      </div>
    </section>
  );
}


