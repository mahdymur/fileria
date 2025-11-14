"use client";

import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type Citation = {
  chunkId: string;
  filingId: string;
  similarity: number;
  snippet: string;
  ticker?: string;
  filingType?: string;
  filingDate?: string;
};

type AskResponse = {
  answer?: string | null;
  citations?: Citation[];
  error?: string;
};

const EXAMPLE_QUESTIONS = [
  "Summarize the major liquidity risks in my most recent filings.",
  "What guidance did the company give about gross margins?",
  "Highlight any material weaknesses called out last quarter.",
];

export function AskDemo() {
  const [question, setQuestion] = useState(EXAMPLE_QUESTIONS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [noFilingsWarning, setNoFilingsWarning] = useState<string | null>(null);
  const [noChunksWarning, setNoChunksWarning] = useState(false);

  const hasResults = Boolean(answer) || citations.length > 0;

  const placeholder = useMemo(() => {
    return EXAMPLE_QUESTIONS[Math.floor(Math.random() * EXAMPLE_QUESTIONS.length)];
  }, []);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const trimmed = question.trim();
      if (!trimmed) {
        setError("Ask a question to get started.");
        return;
      }

      setIsLoading(true);
      setError(null);
      setAnswer(null);
      setCitations([]);
      setNoFilingsWarning(null);
      setNoChunksWarning(false);

      try {
        const response = await fetch("/api/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          cache: "no-store",
          body: JSON.stringify({ question: trimmed }),
        });

        const payload = (await response.json().catch(() => ({}))) as AskResponse;

        if (!response.ok) {
          const message = payload?.error || "Something went wrong.";
          if (response.status === 400 && message.toLowerCase().includes("no embedded")) {
            setNoFilingsWarning(message);
          } else if (response.status === 401) {
            setError("Sign in to upload filings and ask questions.");
          } else {
            setError(message);
          }
          return;
        }

        const nextAnswer = payload?.answer ?? "";
        const nextCitations = Array.isArray(payload?.citations) ? payload.citations : [];

        setAnswer(nextAnswer);
        setCitations(nextCitations);
        setNoChunksWarning(nextCitations.length === 0);
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : "Network error");
      } finally {
        setIsLoading(false);
      }
    },
    [question],
  );

  return (
    <Card className="border-emerald-500/20 bg-white/[0.02] text-white">
      <CardHeader className="space-y-3">
        <Badge variant="secondary" className="w-fit">
          Live Q&A
        </Badge>
        <CardTitle className="text-3xl font-semibold text-white">Ask your filings a question</CardTitle>
        <CardDescription className="text-sm text-white/70">
          We send your question to Cohere for embeddings, search your private filing chunks with pgvector,
          and cite the exact paragraphs used to craft the answer.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="question" className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-300/80">
              Query your filings
            </label>
            <Input
              id="question"
              name="question"
              value={question}
              placeholder={placeholder}
              onChange={(event) => setQuestion(event.target.value)}
              disabled={isLoading}
              className="bg-black/60 text-base"
            />
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-white/60">
            {EXAMPLE_QUESTIONS.map((example) => (
              <button
                type="button"
                key={example}
                className={cn(
                  "rounded-full border border-white/10 px-3 py-1 transition hover:border-emerald-400/60 hover:text-emerald-200",
                  question === example && "border-emerald-400/80 text-emerald-200",
                )}
                onClick={() => setQuestion(example)}
                disabled={isLoading}
              >
                {example}
              </button>
            ))}
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
            {isLoading ? "Searching filings..." : "Ask question"}
          </Button>
        </form>

        {noFilingsWarning ? (
          <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-100">
            {noFilingsWarning}
          </div>
        ) : null}

        {error && !noFilingsWarning ? (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-100">
            {error}
          </div>
        ) : null}

        {noChunksWarning && !noFilingsWarning && !error ? (
          <div className="rounded-lg border border-yellow-500/40 bg-yellow-500/5 p-4 text-sm text-yellow-100">
            We ran the query but didn&apos;t find relevant chunks. Try rephrasing or widening your filters.
          </div>
        ) : null}

        {hasResults ? (
          <div className="space-y-4">
            {answer ? (
              <div className="rounded-lg bg-black/50 p-4">
                <p className="text-sm leading-relaxed text-white/90 whitespace-pre-line">{answer}</p>
              </div>
            ) : null}

            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-300/80">
                Citations & Similarity
              </h3>
              {citations.length === 0 ? (
                <p className="text-sm text-white/60">No supporting chunks returned.</p>
              ) : (
                <ul className="space-y-3">
                  {citations.map((citation) => (
                    <li
                      key={citation.chunkId}
                      className="rounded-lg border border-white/10 bg-black/40 p-4 text-sm text-white/80"
                    >
                      <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.35em] text-white/60">
                        <span>Chunk {citation.chunkId}</span>
                        <span>Filing {citation.filingId}</span>
                        <span>Similarity {(citation.similarity ?? 0).toFixed(3)}</span>
                        {citation.ticker ? <span>{citation.ticker}</span> : null}
                        {citation.filingType ? <span>{citation.filingType}</span> : null}
                        {citation.filingDate ? <span>{citation.filingDate}</span> : null}
                      </div>
                      <p className="mt-3 text-white/90">{citation.snippet}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : null}
      </CardContent>
      <CardFooter>
        <p className="text-xs text-white/50">
          This preview hits your real `/api/ask` route, so make sure you have uploaded filings and generated embeddings.
        </p>
      </CardFooter>
    </Card>
  );
}
