"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Filing = {
  id: string;
  title: string | null;
  original_filename: string | null;
  file_size: number | null;
  ingestion_status: string | null;
  ingestion_error: string | null;
  chunk_count: number | null;
  extracted_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

const STATUS_META: Record<
  string,
  { label: string; helper: string; className: string; emphasis?: "default" | "warning" | "success" | "danger" }
> = {
  uploaded: {
    label: "Uploaded",
    helper: "Stored safely — kick off extraction whenever you’re ready.",
    className: "border-slate-500/60 bg-slate-900/70 text-slate-100",
  },
  extracting: {
    label: "Extracting",
    helper: "Pulling clean text out of the source document.",
    className: "border-amber-300/60 bg-amber-500/10 text-amber-100",
    emphasis: "warning",
  },
  embedding: {
    label: "Embedding",
    helper: "Chunked text is being embedded for retrieval.",
    className: "border-sky-300/70 bg-sky-500/10 text-sky-100",
    emphasis: "warning",
  },
  ready: {
    label: "Ready",
    helper: "Chunk vectors created — fire away with RAG questions.",
    className: "border-emerald-400/70 bg-emerald-500/10 text-emerald-50",
    emphasis: "success",
  },
  failed: {
    label: "Failed",
    helper: "Check the error message, then retry.",
    className: "border-red-500/70 bg-red-500/10 text-red-100",
    emphasis: "danger",
  },
};

const FALLBACK_STATUS = {
  label: "Pending",
  helper: "We’re syncing the latest state…",
  className: "border-emerald-300/40 bg-emerald-500/5 text-emerald-100",
} satisfies (typeof STATUS_META)[string];

function formatBytes(bytes?: number | null) {
  if (!bytes || bytes <= 0) return "—";
  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  const value = bytes / 1024 ** exponent;
  return `${value.toFixed(exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

function formatTimestamp(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AppDashboardPage() {
  const router = useRouter();
  const [filings, setFilings] = useState<Filing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeRuns, setActiveRuns] = useState<Record<string, boolean>>({});
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState("");

  const fetchFilings = useCallback(
    async (options?: { silent?: boolean }) => {
      const silent = options?.silent ?? false;
      if (!silent) {
        setIsLoading(true);
      }
      try {
        const response = await fetch("/api/filings", {
          method: "GET",
          headers: { Accept: "application/json" },
          cache: "no-store",
        });
        const payload = (await response.json().catch(() => ({}))) as { filings?: Filing[]; error?: string };
        if (!response.ok) {
          throw new Error(payload.error ?? "Unable to load filings");
        }
        setFilings(payload.filings ?? []);
        setLastRefreshed(new Date());
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Something went wrong while loading filings");
      } finally {
        if (!silent) {
          setIsLoading(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    fetchFilings().catch(() => undefined);
  }, [fetchFilings]);

  const readyCount = useMemo(
    () => filings.filter((filing) => filing.ingestion_status === "ready").length,
    [filings],
  );

  const handleIngest = useCallback(
    async (filingId: string) => {
      setActiveRuns((prev) => ({ ...prev, [filingId]: true }));
      try {
        const response = await fetch("/api/filings/ingest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filingId }),
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(payload.error ?? "Failed to trigger ingestion");
        }
        await fetchFilings({ silent: true });
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Unable to start ingestion");
      } finally {
        setActiveRuns((prev) => {
          const next = { ...prev };
          delete next[filingId];
          return next;
        });
      }
    },
    [fetchFilings],
  );

  const handleRefresh = useCallback(() => {
    fetchFilings().catch(() => undefined);
  }, [fetchFilings]);

  const handleUpload = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!uploadFile) {
        setError("Please choose a PDF or text file first.");
        return;
      }

      setUploading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append("file", uploadFile);
        if (uploadTitle.trim()) {
          formData.append("title", uploadTitle.trim());
        }

        const response = await fetch("/api/filings/upload", {
          method: "POST",
          body: formData,
        });

        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(payload.error ?? "Upload failed");
        }

        // Ingestion may kick off immediately; refresh the list silently.
        await fetchFilings({ silent: true });
        setUploadFile(null);
        setUploadTitle("");
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Something went wrong while uploading");
      } finally {
        setUploading(false);
      }
    },
    [fetchFilings, uploadFile, uploadTitle],
  );

  const handleSignOut = useCallback(async () => {
    setIsSigningOut(true);
    const supabase = createClient();
    try {
      await supabase.auth.signOut();
    } finally {
      router.push("/");
    }
  }, [router]);

  const totalFilings = filings.length;

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-5xl flex-col gap-10 px-4 py-16">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary/70">Ingestion Control Room</p>
        <h1 className="text-4xl font-semibold tracking-tight text-transparent sm:text-5xl bg-gradient-to-r from-primary via-[#38ffa5] to-primary/80 bg-clip-text drop-shadow-[0_0_35px_rgba(0,255,133,0.25)]">
          Turn uploads into Q&A-ready context.
        </h1>
        <p className="text-lg text-muted-foreground">
          Upload filings, monitor extraction, and trigger chunking + embeddings with a single click.
        </p>
      </header>

  <section className="rounded-3xl border border-primary/25 bg-secondary/80 p-8 shadow-[0_0_80px_rgba(0,255,133,0.12)] backdrop-blur">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/70">Pipeline</p>
            <h2 className="mt-3 text-2xl font-medium text-foreground">Uploaded → Extracted → Embedded → Ready</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Status pills mirror the database flag (<code className="rounded bg-foreground/10 px-1 py-0.5 text-[0.65rem]">filings.ingestion_status</code>). Hit
              “Prepare for Q&A” to start extraction, chunking, and embeddings for a filing. Progress and errors render inline.
            </p>
          </div>
          <div className="grid gap-4 text-sm text-muted-foreground sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground/70">Ready filings</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                {readyCount} / {totalFilings}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground/70">Last refresh</p>
              <p className="mt-2 text-foreground">{lastRefreshed ? lastRefreshed.toLocaleTimeString() : "Just now"}</p>
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-4">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            {isLoading ? "Refreshing…" : "Refresh status"}
          </Button>
          <Button variant="ghost" onClick={handleSignOut} disabled={isSigningOut}>
            {isSigningOut ? "Signing out…" : "Log out"}
          </Button>
        </div>
      </section>

      <section className="rounded-3xl border border-primary/20 bg-background/60 p-8 shadow-[0_0_60px_rgba(0,255,133,0.12)]">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Upload a filing</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose a PDF or plain text file. We&apos;ll store it securely, then you can prepare it for Q&amp;A from the list below.
        </p>

        <form onSubmit={handleUpload} className="mt-5 grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,2fr)_auto] md:items-end">
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">File</label>
            <input
              type="file"
              accept=".pdf,.txt,application/pdf,text/plain"
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                setUploadFile(file);
                if (file && !uploadTitle) {
                  setUploadTitle(file.name.replace(/\.(pdf|txt)$/i, ""));
                }
              }}
              className="block w-full text-sm text-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary/90 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-primary-foreground hover:file:bg-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Title</label>
            <input
              type="text"
              value={uploadTitle}
              onChange={(event) => setUploadTitle(event.target.value)}
              placeholder="Optional, e.g. AAPL 10-K 2024"
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70"
            />
          </div>

          <div className="md:text-right">
            <Button
              type="submit"
              disabled={uploading || !uploadFile}
              className="w-full md:w-auto"
            >
              {uploading ? "Uploading…" : "Upload filing"}
            </Button>
          </div>
        </form>
      </section>

      {error ? (
        <div className="rounded-2xl border border-red-500/50 bg-red-500/10 px-6 py-4 text-sm text-red-100">{error}</div>
      ) : null}

      <section className="space-y-5">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Your filings</h2>
          <p className="text-sm text-muted-foreground">Each card shows ingestion progress, metadata, and the Prepare for Q&A action.</p>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-primary/15 bg-background/30 p-10 text-center text-sm text-muted-foreground animate-pulse">
            Loading filings…
          </div>
        ) : filings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-primary/30 bg-background/40 p-10 text-center">
            <p className="text-base font-medium text-foreground">No filings yet.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Upload a PDF via <code className="rounded bg-foreground/10 px-1.5 py-0.5 text-xs">/api/filings/upload</code> to see it appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filings.map((filing) => {
              const status = filing.ingestion_status ?? "uploaded";
              const statusMeta = STATUS_META[status] ?? FALLBACK_STATUS;
              const isBusy = Boolean(activeRuns[filing.id]) || status === "extracting" || status === "embedding";
              const isReady = status === "ready";
              const disabled = isBusy || isReady;
              const buttonLabel = isReady ? "Ready for Q&A" : isBusy ? "Preparing…" : "Prepare for Q&A";

              return (
                <Card key={filing.id} className="border-primary/15 bg-card/60">
                  <CardHeader className="gap-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <CardTitle className="text-2xl text-foreground">
                          {filing.title ?? filing.original_filename ?? "Untitled filing"}
                        </CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                          Uploaded {formatTimestamp(filing.created_at)} · {formatBytes(filing.file_size)} · ID #{filing.id}
                        </CardDescription>
                      </div>
                      <Badge
                        className={cn(
                          "border px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.3em]",
                          statusMeta.className,
                        )}
                      >
                        {statusMeta.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="grid gap-6 text-sm text-muted-foreground md:grid-cols-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground/70">Chunks created</p>
                      <p className="mt-2 text-xl text-foreground">{filing.chunk_count ?? "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground/70">Extracted at</p>
                      <p className="mt-2 text-base text-foreground">{formatTimestamp(filing.extracted_at)}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground/70">Last updated</p>
                      <p className="mt-2 text-base text-foreground">{formatTimestamp(filing.updated_at)}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4 border-t border-white/5 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>{statusMeta.helper}</p>
                      {filing.ingestion_error ? (
                        <p className="text-xs text-red-300">Error: {filing.ingestion_error}</p>
                      ) : null}
                    </div>
                    <Button onClick={() => handleIngest(filing.id)} disabled={disabled} variant={isReady ? "secondary" : "default"}>
                      {buttonLabel}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
