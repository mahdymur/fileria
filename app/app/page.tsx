"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AppDashboardPage() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    const supabase = createClient();
    try {
      await supabase.auth.signOut();
    } finally {
      router.push("/");
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col gap-8 px-4 py-20">
      <header className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl dark:text-slate-100">
          Welcome to Fileria.
        </h1>
        <p className="text-lg text-muted-foreground">
          This is where your research workspace will live.
        </p>
      </header>

      <div className="rounded-3xl border border-dashed border-slate-300 bg-white/40 p-8 backdrop-blur dark:border-slate-700 dark:bg-slate-900/50">
        <label htmlFor="workspace-search" className="block text-sm font-medium text-slate-600 dark:text-slate-300">
          Quick search
        </label>
        <Input
          id="workspace-search"
          type="search"
          disabled
          placeholder="Search SEC filings…"
          className="mt-3 h-12 cursor-not-allowed bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Soon, you&apos;ll be able to ask natural questions across your filings with citation-backed answers.
        </p>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" onClick={handleSignOut} disabled={isSigningOut}>
          {isSigningOut ? "Signing out…" : "Log out"}
        </Button>
      </div>
    </div>
  );
}
