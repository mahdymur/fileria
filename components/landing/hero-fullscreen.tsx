"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TerminalBackground } from "@/components/landing/terminal-background";

interface CtaConfig {
  label: string;
  href: string;
  variant?: "default" | "outline";
}

interface HeroFullscreenProps {
  title: string;
  description: string;
  eyebrow?: string;
  primaryCta: CtaConfig;
  secondaryCta: CtaConfig;
  className?: string;
}

export function HeroFullscreen({
  title,
  description,
  eyebrow,
  primaryCta,
  secondaryCta,
  className,
}: HeroFullscreenProps) {
  return (
    <>
      {/* Hero Section - Full Screen */}
      <section
        className={cn(
          "relative min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-20",
          className,
        )}
      >
        {/* Terminal Background - Bright and Visible */}
        <div className="absolute inset-0 z-[100] opacity-60">
          <TerminalBackground />
        </div>

        {/* Subtle Gradient Overlays - Clean and Intentional */}
        <div className="absolute inset-0 z-[101] bg-gradient-to-b from-transparent via-transparent to-black/30 pointer-events-none" />
        <div className="absolute inset-0 z-[101] bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_60%)] pointer-events-none" />

        {/* Content */}
        <div className="relative z-[110] mx-auto w-full max-w-6xl px-4">
          <div className="flex flex-col items-center gap-8 text-center">
            {eyebrow && (
              <span 
                className="rounded-full border border-emerald-500/40 bg-emerald-500/10 backdrop-blur-sm px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-emerald-400"
                style={{
                  animation: 'fadeInUp 1s ease-out 0s both',
                  opacity: 0,
                }}
              >
                {eyebrow}
              </span>
            )}
            <div className="space-y-6">
              <h1 
                className="text-5xl font-semibold tracking-tight text-emerald-50 sm:text-6xl lg:text-7xl xl:text-8xl leading-tight"
                style={{
                  textShadow: '0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.3), 0 0 60px rgba(255, 255, 255, 0.2)',
                  animation: 'fadeInUp 1.2s ease-out 0.3s both',
                  opacity: 0,
                }}
              >
                {title}
              </h1>
              <p 
                className="text-lg sm:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed"
                style={{
                  color: '#d1d5db',
                  animation: 'fadeInUp 1.2s ease-out 0.6s both',
                  opacity: 0,
                }}
              >
                {description}
              </p>
            </div>
            <div 
              className="flex flex-col items-center gap-4 sm:flex-row"
              style={{
                animation: 'fadeInUp 1s ease-out 0.9s both',
                opacity: 0,
              }}
            >
              <Button
                asChild
                size="lg"
                className="min-w-[200px] h-14 text-lg shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all backdrop-blur-sm bg-emerald-500/90 hover:bg-emerald-500"
              >
                <Link href={primaryCta.href}>{primaryCta.label}</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant={secondaryCta.variant ?? "outline"}
                className="min-w-[200px] h-14 text-lg backdrop-blur-sm border-emerald-500/40 hover:border-emerald-500/60"
              >
                <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
              </Button>
            </div>
          </div>
        </div>

      </section>

      {/* Smooth Gradient Transition from Hero to Content */}
      <div className="relative h-32 -mt-32 z-[105] bg-gradient-to-b from-transparent via-black/50 to-black pointer-events-none" />
    </>
  );
}

