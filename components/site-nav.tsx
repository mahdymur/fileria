"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigationLinks = [
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/login", label: "Log In" },
];

const getIsActive = (pathname: string, href: string) => {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
};

export function SiteNav() {
  const pathname = usePathname();
  const isAppRoute = pathname.startsWith("/app");
  const linksToHide = isAppRoute ? new Set(["/about", "/pricing"]) : null;
  const visibleLinks = linksToHide
    ? navigationLinks.filter((link) => !linksToHide.has(link.href))
    : navigationLinks;

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-[#0b0b0d]/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="flex w-full items-center justify-between gap-4 sm:w-auto">
          <Link href="/" className="text-base font-semibold text-emerald-400">
            Fileria
          </Link>
          <Button asChild size="sm" className="sm:hidden">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
        <nav className="flex w-full flex-wrap items-center gap-x-6 gap-y-2 text-sm sm:flex-1 sm:flex-nowrap">
          {visibleLinks.map((item) => {
            const active = getIsActive(pathname, item.href);
            const isLoginLink = item.href === "/login";
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-gray-400 transition-all duration-200 ease-in-out hover:text-gray-200",
                  isLoginLink ? "sm:ml-auto" : "",
                  active
                    ? "font-semibold text-emerald-400"
                    : ""
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden sm:block">
          <Button asChild size="sm">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
