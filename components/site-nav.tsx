"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const navigationLinks = [
  { href: "/about", label: "About", hideOnApp: true },
  { href: "/pricing", label: "Pricing", hideOnApp: true },
  { href: "/auth/login", label: "Log In", hideWhenAuthenticated: true },
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
  const isAuthenticated = !!session;

  useEffect(() => {
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
  }, []);

  const visibleLinks = useMemo(() => {
    const isAppRoute = pathname.startsWith("/app");
    return navigationLinks.filter((link) => {
      if (link.hideOnApp && isAppRoute) {
        return false;
      }

      if (link.hideWhenAuthenticated && isAuthenticated) {
        return false;
      }

      return true;
    });
  }, [isAuthenticated, pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-[#0b0b0d]/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="flex w-full items-center justify-between gap-4 sm:w-auto">
          <Link href="/" className="text-base font-semibold text-emerald-400">
            Fileria
          </Link>
          {isAuthenticated ? (
            <LogoutButton className="sm:hidden" size="sm" variant="secondary" />
          ) : (
            <Button asChild size="sm" className="sm:hidden">
              <Link href="/auth/sign-up">Sign Up</Link>
            </Button>
          )}
        </div>
        <nav className="flex w-full flex-wrap items-center gap-x-6 gap-y-2 text-sm sm:flex-1 sm:flex-nowrap">
          {visibleLinks.map((item) => {
            const active = getIsActive(pathname, item.href);
            const alignRight = item.href === "/auth/login";
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-gray-400 transition-all duration-200 ease-in-out hover:text-gray-200",
                  alignRight ? "sm:ml-auto" : "",
                  active ? "font-semibold text-emerald-400" : "",
                )}
              >
                {item.label}
              </Link>
            );
          })}
          {isAuthenticated ? (
            <LogoutButton className="ml-auto hidden sm:inline-flex" size="sm" />
          ) : null}
        </nav>
        {!isAuthenticated ? (
          <div className="hidden sm:block">
            <Button asChild size="sm">
              <Link href="/auth/sign-up">Sign Up</Link>
            </Button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
