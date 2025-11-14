"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";
import { createClient } from "@/lib/supabase/client";
import { cn, hasEnvVars } from "@/lib/utils";
const navigationLinks = [
  { href: "/#how-it-works", label: "Process", hideOnApp: true },
  { href: "/#features", label: "Features", hideOnApp: true },
  { href: "/#pricing", label: "Pricing", hideOnApp: true },
];

const getIsActive = (pathname: string, href: string) => {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
};

export function SiteNav() {
  const pathname = usePathname();
  const [session, setSession] = useState<Session | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const supabaseReady = Boolean(hasEnvVars);
  const isAuthenticated = supabaseReady && !!session;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!supabaseReady) {
      setSession(null);
      return;
    }

    const supabase = createClient();

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabaseReady]);

  const visibleLinks = useMemo(() => {
    const isAppRoute = pathname.startsWith("/app");
    return navigationLinks.filter((link) => {
      if (!supabaseReady && link.href.startsWith("/auth")) {
        return false;
      }

      if (link.hideOnApp && isAppRoute) {
        return false;
      }

      if (link.hideWhenAuthenticated && isAuthenticated) {
        return false;
      }

      return true;
    });
  }, [isAuthenticated, pathname, supabaseReady]);

  // Filter nav links for desktop (About, Process, Pricing)
  const desktopNavLinks = visibleLinks.filter(
    (link) =>
      link.href === "/#how-it-works" || link.href === "/#features" || link.href === "/#pricing",
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-[120] flex justify-center pt-4 px-4 pointer-events-none">
      {/* Pill-shaped Navbar Container */}
      <div
        className={cn(
          "w-full rounded-full border border-white/30 bg-white/[0.03] backdrop-blur-2xl",
          "transition-all duration-300 ease-in-out pointer-events-auto",
          isScrolled ? "max-w-lg" : "max-w-3xl",
        )}
        style={{
          padding: "0.75rem 1.5rem",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.04) 100%)",
          borderColor: "rgba(255,255,255,0.25)",
          boxShadow:
            "0 4px 24px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(255,255,255,0.1), inset 0 1px 1px rgba(255,255,255,0.15), inset 0 -1px 1px rgba(0,0,0,0.05)",
        }}
      >
        <div className={cn(
          "flex items-center justify-between",
          isScrolled ? "gap-3" : "gap-6"
        )}>
          {/* Logo - Left */}
          <Link
            href="/"
            className="text-sm font-semibold text-emerald-400 transition-all duration-200 hover:text-emerald-300"
          >
            Fileria
          </Link>

          {/* Navigation - Center with Dot Separators */}
          <nav className="hidden md:flex items-center gap-2 flex-1 justify-center">
            {desktopNavLinks.map((item, index) => {
              const active = getIsActive(pathname, item.href);
              return (
                <div key={item.href} className="flex items-center gap-2">
                  <Link
                    href={item.href}
                    className={cn(
                      "text-sm text-gray-300 transition-all duration-200 ease-in-out hover:text-emerald-400 px-2",
                      active ? "font-semibold text-emerald-400" : ""
                    )}
                  >
                    {item.label}
                  </Link>
                  {index < desktopNavLinks.length - 1 && (
                    <span className="text-xs text-gray-500">·</span>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Mobile: Navigation */}
          <nav className="flex md:hidden items-center gap-2 flex-1 justify-center">
            {desktopNavLinks.slice(0, 2).map((item, index) => {
              const active = getIsActive(pathname, item.href);
              return (
                <div key={item.href} className="flex items-center gap-2">
                  <Link
                    href={item.href}
                    className={cn(
                      "text-xs text-gray-300 transition-all duration-200 ease-in-out hover:text-emerald-400 px-1",
                      active ? "font-semibold text-emerald-400" : ""
                    )}
                  >
                    {item.label}
                  </Link>
                  {index < Math.min(desktopNavLinks.length - 1, 1) && (
                    <span className="text-gray-500 text-[10px]">·</span>
                  )}
                </div>
              );
            })}
          </nav>

          {/* CTA Button - Right */}
          {isAuthenticated ? (
            <div className="flex items-center">
              <LogoutButton size={isScrolled ? "sm" : "sm"} />
            </div>
          ) : (
            <div className="flex items-center">
              <Button 
                asChild 
                size={isScrolled ? "sm" : "sm"} 
                className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold transition-all duration-200"
              >
                <Link href="/app">Try Now</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
