"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Info, Loader2, Sparkles, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
  storage_path: string | null;
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

const QA_PLACEHOLDER_SUGGESTIONS = [
  "e.g., What changed in revenue year-over-year?",
  "e.g., Where do we mention liquidity pressure?",
  "e.g., Summarize gross margin guidance in 2024 filings.",
];

type QaCitation = {
  chunkId: string;
  filingId: string;
  snippet: string;
  similarity?: number;
  ticker?: string;
  filingType?: string;
  filingDate?: string;
};

type AskResponsePayload = {
  answer?: string | null;
  citations?: QaCitation[];
  error?: string;
};

type AskRequestFilters = {
  filingIds?: string[];
  ticker?: string;
};

type DashboardQaPanelProps = {
  filings: Filing[];
  isLoadingFilings: boolean;
};

const EXAMPLE_CHIPS = [
  "What did management say about liquidity last quarter?",
  "Highlight any new risk factors from my 10-Ks.",
  "Compare revenue guidance between 2023 and 2024 filings.",
];

const formatFilingName = (filing: Filing) =>
  filing.title ?? filing.original_filename ?? `Filing #${filing.id}`;

/**
 * Developer Q&A checklist:
 * 1. Sign up / log in.
 * 2. Upload a filing.
 * 3. Click “Prepare for Q&A”.
 * 4. Wait for status uploaded → extracting → embedding → ready.
 * 5. Type a question.
 * 6. Read the Groq answer + citations.
 * 7. Pop open the cited PDF snippets for a quick audit.
 */
function DashboardQaPanel({ filings, isLoadingFilings }: DashboardQaPanelProps) {
  const readyFilings = useMemo(() => filings.filter((filing) => filing.ingestion_status === "ready"), [filings]);
  const supabaseClient = useMemo(() => createClient(), []);

  // UI state for the neon Q&A widget lives here so beginner devs can tweak it easily.
  const [question, setQuestion] = useState<string>("");
  const [filterMode, setFilterMode] = useState<"all" | "custom">("all");
  const [selectedFilings, setSelectedFilings] = useState<string[]>([]);
  const [tickerFilter, setTickerFilter] = useState<string>("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [citations, setCitations] = useState<QaCitation[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [emptyMessage, setEmptyMessage] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [openingPdf, setOpeningPdf] = useState<string | null>(null);
  const [lastRequest, setLastRequest] = useState<{ question: string; filters: AskRequestFilters } | null>(null);
  const [placeholder, setPlaceholder] = useState(QA_PLACEHOLDER_SUGGESTIONS[0]);

  useEffect(() => {
    setPlaceholder(
      QA_PLACEHOLDER_SUGGESTIONS[Math.floor(Math.random() * QA_PLACEHOLDER_SUGGESTIONS.length)],
    );
  }, []);

  useEffect(() => {
    setSelectedFilings((prev) => prev.filter((id) => readyFilings.some((filing) => String(filing.id) === id)));
  }, [readyFilings]);

  useEffect(() => {
    if (filterMode === "custom" && selectedFilings.length === 0 && readyFilings.length > 0) {
      setSelectedFilings([String(readyFilings[0].id)]);
    }
  }, [filterMode, readyFilings, selectedFilings.length]);

  const currentFilters = useMemo<AskRequestFilters>(() => {
    const trimmedTicker = tickerFilter.trim();
    if (filterMode === "custom" && selectedFilings.length > 0) {
      return {
        filingIds: selectedFilings,
        ticker: trimmedTicker || undefined,
      };
    }
    return {
      ticker: trimmedTicker || undefined,
    };
  }, [filterMode, selectedFilings, tickerFilter]);

  const hasReadyFilings = readyFilings.length > 0;

  const submitQuestion = useCallback(
    async (overrides?: { question?: string; filters?: AskRequestFilters }) => {
      const askQuestion = (overrides?.question ?? question).trim();
      if (!askQuestion) {
        setRequestError("Type a question to start.");
        return;
      }

      if (!hasReadyFilings) {
        setEmptyMessage("Upload a filing and click ‘Prepare for Q&A’ to start asking questions.");
        return;
      }

      const filtersPayload = overrides?.filters ?? currentFilters;

      setIsSubmitting(true);
      setRequestError(null);
      setEmptyMessage(null);
      setPdfError(null);
      setAnswer(null);
      setCitations([]);
      setLastRequest({ question: askQuestion, filters: filtersPayload });

      try {
        // /api/ask triggers Cohere retrieval + embeddings and then calls Groq for the final answer.
        const response = await fetch("/api/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
          credentials: "include",
          body: JSON.stringify({ question: askQuestion, filters: filtersPayload }),
        });

        const payload = (await response.json().catch(() => ({}))) as AskResponsePayload;

        if (!response.ok) {
          const message = payload?.error ?? "Unable to generate an answer right now.";
          setRequestError(message);
          if (message.toLowerCase().includes("no embedded")) {
            setEmptyMessage("Upload a filing and click ‘Prepare for Q&A’ to start asking questions.");
          }
          return;
        }

        setAnswer(payload?.answer ?? "");
        const nextCitations = Array.isArray(payload?.citations) ? payload.citations : [];
        setCitations(nextCitations);
        if (nextCitations.length === 0) {
          setEmptyMessage("We didn’t find relevant chunks. Try another phrasing or widen your filters.");
        }
      } catch (error) {
        setRequestError(error instanceof Error ? error.message : "Network error");
      } finally {
        setIsSubmitting(false);
      }
    },
    [question, hasReadyFilings, currentFilters],
  );

  const handleOpenPdf = useCallback(
    async (filingId: string) => {
      const target = filings.find((filing) => String(filing.id) === String(filingId));
      if (!target?.storage_path) {
        setPdfError("No PDF stored for this filing yet.");
        return;
      }

      setOpeningPdf(filingId);
      setPdfError(null);

      try {
        // Supabase storage call to fetch a signed link for the original PDF.
        const { data, error } = await supabaseClient.storage
          .from("filings")
          .createSignedUrl(target.storage_path, 60);

        if (error || !data?.signedUrl) {
          throw new Error(error?.message ?? "Unable to open PDF");
        }

        window.open(data.signedUrl, "_blank", "noopener,noreferrer");
      } catch (storageError) {
        setPdfError(storageError instanceof Error ? storageError.message : "Unable to open PDF");
      } finally {
        setOpeningPdf(null);
      }
    },
    [filings, supabaseClient],
  );

  const disableInputs = !hasReadyFilings || isSubmitting;

  return (
    <section className="rounded-3xl border border-primary/20 bg-[#030507]/80 p-8 text-foreground shadow-[0_0_80px_rgba(34,197,94,0.18)] backdrop-blur">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary/70">Quick search</p>
          <h2 className="text-3xl font-semibold text-white">
            <span className="bg-gradient-to-r from-primary via-[#38ffa5] to-primary/80 bg-clip-text text-transparent">
              Ask, relax, get neon-fast answers.
            </span>
          </h2>
          <p className="text-sm text-white/70">
            Seamless Cohere retrieval + Groq answers tuned for filings, minus the EDGAR headache.
          </p>
        </div>
        <div className="relative hidden sm:flex">
          <div className="group relative rounded-full border border-primary/30 bg-primary/5 p-3 text-primary" aria-label="Answers grounding tooltip">
            <Info className="h-4 w-4" />
            <span className="pointer-events-none absolute -top-16 right-0 w-60 rounded-2xl border border-primary/40 bg-black/80 px-3 py-2 text-xs text-white/80 opacity-0 shadow-2xl transition-all duration-200 group-hover:-translate-y-1 group-hover:opacity-100">
              Answers are grounded in your uploaded filings using Cohere + Groq.
            </span>
          </div>
        </div>
      </div>

      {!hasReadyFilings && !isLoadingFilings ? (
        <div className="mt-6 rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-4 text-sm text-primary">
          Upload a filing and click “Prepare for Q&A” to start asking questions.
        </div>
      ) : null}

      <form onSubmit={(event) => { event.preventDefault(); submitQuestion(); }} className="mt-6 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="qa-question" className="text-xs font-semibold uppercase tracking-[0.35em] text-primary/70">
            Your question
          </Label>
          <div className="relative">
            <Input
              id="qa-question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder={placeholder}
              disabled={disableInputs}
              className="h-14 border-primary/30 bg-black/60 pr-12 text-base text-white shadow-[0_0_35px_rgba(16,185,129,0.2)] transition focus-visible:ring-emerald-300/70"
            />
            <Sparkles className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" />
          </div>
          <p className="text-xs text-white/60">Short, long, or messy—Groq will stitch together a calm answer.</p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-white/80">
          {EXAMPLE_CHIPS.map((chip) => (
            <button
              type="button"
              key={chip}
              onClick={() => setQuestion(chip)}
              disabled={disableInputs}
              className={cn(
                "rounded-full border border-primary/30 px-4 py-2 transition hover:border-primary hover:bg-primary/10",
                question === chip && "border-primary bg-primary/10 text-primary",
                disableInputs && "opacity-50",
              )}
            >
              {chip}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-primary/15 bg-black/40 p-4">
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-primary/60">
            <span>Filters</span>
            <span className="text-white/40">Optional</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {[{ id: "all", label: "All filings" }, { id: "custom", label: "Pick specific filings" }].map((option) => (
              <Button
                key={option.id}
                type="button"
                size="sm"
                variant={filterMode === option.id ? "default" : "secondary"}
                onClick={() => setFilterMode(option.id as "all" | "custom")}
                className={cn(
                  "rounded-full border border-primary/30 bg-transparent text-xs",
                  filterMode === option.id
                    ? "bg-primary text-primary-foreground"
                    : "text-white/70 hover:bg-primary/10",
                )}
              >
                {option.label}
              </Button>
            ))}
          </div>

          {filterMode === "custom" ? (
            <div className="mt-4 space-y-2">
              <p className="text-sm text-white/70">Select one or more ready filings.</p>
              <div className="max-h-52 space-y-2 overflow-y-auto rounded-2xl border border-primary/20 bg-black/30 p-3">
                {readyFilings.length === 0 ? (
                  <p className="text-xs text-white/50">No filings are ready yet.</p>
                ) : (
                  readyFilings.map((filing) => {
                    const normalizedId = String(filing.id);
                    const checked = selectedFilings.includes(normalizedId);
                    return (
                      <label
                        key={filing.id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-sm text-white/80"
                      >
                        <div className="space-y-1">
                          <p className="font-medium text-white">{formatFilingName(filing)}</p>
                          <p className="text-xs text-white/60">Chunks: {filing.chunk_count ?? "—"}</p>
                        </div>
                        <Checkbox
                          checked={checked}
                          disabled={disableInputs}
                          onCheckedChange={(next) => {
                            const isChecked = Boolean(next);
                            setSelectedFilings((prev) => {
                              if (isChecked) {
                                if (prev.includes(normalizedId)) return prev;
                                return [...prev, normalizedId];
                              }
                              return prev.filter((value) => value !== normalizedId);
                            });
                          }}
                          aria-label={`Toggle ${formatFilingName(filing)}`}
                        />
                      </label>
                    );
                  })
                )}
              </div>
            </div>
          ) : null}

          <div className="mt-4 space-y-2">
            <Label htmlFor="ticker-filter" className="text-xs font-semibold uppercase tracking-[0.35em] text-primary/60">
              Ticker filter
            </Label>
            <Input
              id="ticker-filter"
              value={tickerFilter}
              onChange={(event) => setTickerFilter(event.target.value.toUpperCase())}
              placeholder="Optional, e.g. AAPL"
              disabled={disableInputs}
              className="border-primary/20 bg-black/40 text-white placeholder:text-white/50"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            type="submit"
            disabled={!hasReadyFilings || isSubmitting}
            className="flex-1 rounded-full bg-gradient-to-r from-primary via-[#38ffa5] to-primary text-base font-semibold text-primary-foreground shadow-[0_0_45px_rgba(16,185,129,0.45)]"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Reading your filings…
              </span>
            ) : (
              "Ask away"
            )}
          </Button>
          <p className="text-xs text-white/60">
            Answers arrive in a few seconds. Groq handles the prose while Cohere finds the chunks.
          </p>
        </div>
      </form>

      {requestError ? (
        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
          <p>{requestError}</p>
          {lastRequest ? (
            <Button
              type="button"
              variant="outline"
              className="w-fit border-red-300/50 text-red-100 hover:bg-red-500/10"
              onClick={() => submitQuestion(lastRequest)}
            >
              Retry
            </Button>
          ) : null}
        </div>
      ) : null}

      {emptyMessage ? (
        <div className="mt-4 rounded-2xl border border-amber-400/40 bg-amber-500/10 p-4 text-sm text-amber-50">
          {emptyMessage}
        </div>
      ) : null}

      <div className="mt-6 space-y-5 rounded-3xl border border-white/5 bg-black/40 p-6 text-white transition-all duration-300">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-primary/60">
            <span>Groq answer</span>
          </div>
          {answer ? (
            <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-white/90">{answer}</p>
          ) : (
            <p className="mt-3 text-sm text-white/60">Ask anything about your filings to see a grounded answer here.</p>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.35em] text-primary/60">
              Sources
            </h3>
            <span className="text-xs text-white/60">Exact chunk citations pulled via Cohere retrieval.</span>
          </div>
          {citations.length === 0 ? (
            <p className="text-sm text-white/60">No supporting chunks returned yet.</p>
          ) : (
            <ul className="space-y-4">
              {citations.map((citation) => (
                <li
                  key={`${citation.chunkId}-${citation.filingId}`}
                  className="space-y-3 rounded-2xl border border-primary/15 bg-white/5 p-4"
                >
                  <div className="flex flex-col gap-2 text-xs text-white/70 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap gap-2">
                      {citation.ticker ? <span className="rounded-full bg-white/10 px-2 py-1">{citation.ticker}</span> : null}
                      {citation.filingType ? <span className="rounded-full bg-white/10 px-2 py-1">{citation.filingType}</span> : null}
                      {citation.filingDate ? <span className="rounded-full bg-white/10 px-2 py-1">{citation.filingDate}</span> : null}
                      <span className="rounded-full bg-white/5 px-2 py-1">Chunk {citation.chunkId}</span>
                      <span className="rounded-full bg-white/5 px-2 py-1">Similarity {(citation.similarity ?? 0).toFixed(3)}</span>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      disabled={openingPdf === citation.filingId}
                      onClick={() => handleOpenPdf(citation.filingId)}
                      className="text-xs"
                    >
                      {openingPdf === citation.filingId ? "Opening…" : "Open PDF"}
                    </Button>
                  </div>
                  <p className="text-sm leading-relaxed text-white/90">{citation.snippet}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {pdfError ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-100">{pdfError}</div>
        ) : null}
      </div>
    </section>
  );
}

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
  const [deleting, setDeleting] = useState<Record<string, boolean>>({});
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

  const handleDelete = useCallback(
    async (filingId: string) => {
      if (typeof window !== "undefined") {
        const confirmed = window.confirm("This will permanently delete the filing, its chunks, and storage object. Continue?");
        if (!confirmed) {
          return;
        }
      }

      setDeleting((prev) => ({ ...prev, [filingId]: true }));
      setError(null);

      try {
        const response = await fetch(`/api/filings?id=${encodeURIComponent(filingId)}`, {
          method: "DELETE",
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          const payload = (await response.json().catch(() => ({}))) as { error?: string };
          throw new Error(payload.error ?? "Failed to delete filing");
        }

        await fetchFilings({ silent: true });
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Unable to delete filing");
      } finally {
        setDeleting((prev) => {
          const next = { ...prev };
          delete next[filingId];
          return next;
        });
      }
    },
    [fetchFilings],
  );

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

      <DashboardQaPanel filings={filings} isLoadingFilings={isLoading} />
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
              const isDeleting = Boolean(deleting[filing.id]);
              const isReady = status === "ready";
              const prepareDisabled = isBusy || isReady || isDeleting;
              const deleteDisabled = isBusy || isDeleting;
              const buttonLabel = isReady ? "Ready for Q&A" : isBusy ? "Preparing…" : "Prepare for Q&A";
              const deleteLabel = isDeleting ? "Deleting…" : "Delete filing";

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
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button onClick={() => handleIngest(filing.id)} disabled={prepareDisabled} variant={isReady ? "secondary" : "default"}>
                        {buttonLabel}
                      </Button>
                      <Button
                        onClick={() => handleDelete(filing.id)}
                        disabled={deleteDisabled}
                        variant="ghost"
                        className="justify-center border border-red-500/30 text-red-200 hover:border-red-400 hover:bg-red-500/10 hover:text-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        {deleteLabel}
                      </Button>
                    </div>
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
