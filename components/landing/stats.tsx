"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
 
interface Stat {
  value: string;
  label: string;
  description?: string;
}

interface StatsProps {
  stats: Stat[];
  className?: string;
}

// Parse stat value to extract number and formatting
function parseStatValue(value: string): { number: number; prefix: string; suffix: string } {
  // Handle "< 2s" -> prefix: "< ", number: 2, suffix: "s"
  if (value.includes("<")) {
    const match = value.match(/<[\s]*(\d+)/);
    if (match) {
      const suffix = value.replace(/<[\s]*\d+/, "").trim();
      return { prefix: "< ", number: parseInt(match[1]), suffix };
    }
  }
  
  // Handle "99%" -> prefix: "", number: 99, suffix: "%"
  if (value.includes("%")) {
    const match = value.match(/(\d+)/);
    if (match) {
      return { prefix: "", number: parseInt(match[1]), suffix: "%" };
    }
  }
  
  // Handle "10K+" -> prefix: "", number: 10000, suffix: "K+"
  if (value.toUpperCase().includes("K")) {
    const match = value.match(/(\d+)\s*K/i);
    if (match) {
      return { prefix: "", number: parseInt(match[1]), suffix: "K" };
    }
  }
  
  // Default: try to extract any number
  const match = value.match(/(\d+)/);
  if (match) {
    return { prefix: "", number: parseInt(match[1]), suffix: "" };
  }
  
  return { prefix: "", number: 0, suffix: "" };
}

// Format number for display (returns numeric portion only)
function formatNumber(num: number, originalValue: string): string {
  const safeNumber = Math.max(num, 0);
  if (originalValue.toUpperCase().includes("K")) {
    return `${Math.floor(safeNumber)}`;
  }
  if (originalValue.includes("<")) {
    return `${Math.floor(safeNumber)}`;
  }
  return Math.floor(safeNumber).toString();
}

export function Stats({ stats, className }: StatsProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState<number[]>(stats.map(() => 0));

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);

          stats.forEach((stat, index) => {
            const { number: target } = parseStatValue(stat.value);
            const duration = 1200; // faster animation
            const startTime = performance.now();

            const animate = (currentTime: number) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const easeOutQuart = 1 - Math.pow(1 - progress, 4);
              const current = target * easeOutQuart;

              setCounts((prev) => {
                const next = [...prev];
                next[index] = current;
                return next;
              });

              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                setCounts((prev) => {
                  const next = [...prev];
                  next[index] = target;
                  return next;
                });
              }
            };

            requestAnimationFrame(animate);
          });

          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [stats]);
 
  return (
    <section ref={sectionRef} className={cn("relative", className)}>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={cn(
              "text-center transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
            )}
            style={{
              animationDelay: `${index * 120}ms`,
              transitionDelay: isVisible ? `${index * 100}ms` : "0ms",
            }}
          >
            <div className="space-y-3">
              <div
                className="font-light text-emerald-50 leading-[0.9]"
                style={{
                  fontSize: "clamp(4rem, 9vw, 7rem)",
                  fontFamily: "var(--font-sans), Space Grotesk, system-ui, sans-serif",
                  letterSpacing: "-0.03em",
                  fontWeight: 300,
                }}
              >
                {(() => {
                  const { prefix, suffix } = parseStatValue(stat.value);
                  const normalizedSuffix = suffix === "K" ? "k" : suffix;

                  if (!isVisible) {
                    return `${prefix}0${normalizedSuffix}`;
                  }

                  const displayNumber = formatNumber(counts[index], stat.value);
                  return `${prefix}${displayNumber}${normalizedSuffix}`;
                })()}
              </div>
              <div className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-200/90 pt-2">
                {stat.label}
              </div>
              {stat.description && (
                <p className="text-base text-slate-300/90 pt-1">{stat.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
 }
