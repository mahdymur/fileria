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
        <h1 className="text-4xl font-semibold tracking-tight text-transparent sm:text-5xl bg-gradient-to-r from-primary via-[#38ffa5] to-primary/80 bg-clip-text drop-shadow-[0_0_35px_rgba(0,255,133,0.25)]">
          Welcome to Fileria.
        </h1>
        <p className="text-lg text-muted-foreground">
          This is where your research workspace will live.
        </p>
      </header>

      <div className="rounded-3xl border border-primary/25 bg-secondary/80 p-8 shadow-[0_0_80px_rgba(0,255,133,0.12)] backdrop-blur">
        <label htmlFor="workspace-search" className="block text-sm font-medium text-muted-foreground">
          Quick search
        </label>
        <Input
          id="workspace-search"
          type="search"
          disabled
          placeholder="Search SEC filings…"
          className="mt-3 h-12 cursor-not-allowed border-dashed border-primary/40 text-muted-foreground/80"
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
