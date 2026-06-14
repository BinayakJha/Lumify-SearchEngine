"use client";

import { useRef, useState } from "react";
import { analyze } from "@/lib/why/engine";
import { recordAnalysis } from "@/lib/why/journal";
import { Analysis } from "@/lib/why/types";
import { WhyResults } from "./WhyResults";
import { SkeletonResults } from "./SkeletonResults";
import { JournalPanel } from "./JournalPanel";

type Phase = "idle" | "searching" | "results";

const SUGGESTIONS = [
  "why is the sky blue",
  "should I text him back",
  "is 30 too old to learn to code",
  "how to fix wifi not working",
  "what should I cook tonight",
];

// The brand "?" mark — the Why Engine in a badge.
function Mark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`grid select-none place-items-center rounded-2xl bg-gradient-to-br from-brand to-fuchsia-500 font-bold leading-none text-white shadow-lg shadow-brand/20 ${className}`}
      aria-hidden
    >
      ?
    </span>
  );
}

export function WhySearch() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [q, setQ] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const compact = phase !== "idle";

  function run(raw: string) {
    const query = raw.trim();
    if (!query) return;
    setQ(query);
    setSubmitted(query);
    setAnalysis(null);
    setPhase("searching");
    if (timer.current) clearTimeout(timer.current);
    // Analysis is instant & local — the brief delay is a deliberate "thinking"
    // beat so the bar-glides-up + skeleton transition reads.
    timer.current = setTimeout(() => {
      const a = analyze(query);
      setAnalysis(a);
      recordAnalysis(a);
      setPhase("results");
      window.history.replaceState(null, "", `/why?q=${encodeURIComponent(query)}`);
    }, 800);
  }

  function reset() {
    if (timer.current) clearTimeout(timer.current);
    setPhase("idle");
    setQ("");
    setSubmitted("");
    setAnalysis(null);
    window.history.replaceState(null, "", "/");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col px-4 pb-24 md:pb-10">
      <div className={`transition-all duration-500 ease-out ${compact ? "pt-4" : "pt-[17vh]"}`}>
        {/* Big logo — idle only */}
        <div
          className={`overflow-hidden text-center transition-all duration-500 ${
            compact ? "max-h-0 opacity-0" : "max-h-52 opacity-100"
          }`}
        >
          <div className="flex items-center justify-center gap-3">
            <Mark className="h-12 w-12 text-2xl" />
            <span className="text-5xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-brand to-fuchsia-500 bg-clip-text text-transparent">
                Lumify
              </span>
            </span>
          </div>
          <p className="mt-3 text-lg font-medium text-zinc-700">
            The search engine that asks why you asked.
          </p>
        </div>

        {/* Search pill — the same element across every phase, so it visually
            glides upward as the logo above it collapses. */}
        <div
          className={`mx-auto flex items-center gap-2.5 transition-all duration-500 ease-out ${
            compact ? "mt-0 max-w-3xl" : "mt-8 max-w-2xl"
          }`}
        >
          {compact && (
            <button onClick={reset} aria-label="Back to home" className="shrink-0">
              <Mark className="h-11 w-11 text-lg transition hover:scale-105" />
            </button>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              run(q);
            }}
            className="flex flex-1 items-center gap-3 rounded-full border border-zinc-300 bg-white px-5 py-3.5 shadow-card transition focus-within:border-brand focus-within:shadow-pop focus-within:ring-2 focus-within:ring-brand-ring/50"
          >
            <svg className="h-5 w-5 shrink-0 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" strokeLinecap="round" />
            </svg>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              autoFocus
              placeholder="Ask me a question…"
              aria-label="Your question"
              className="min-w-0 flex-1 bg-transparent text-[17px] outline-none placeholder:text-zinc-400"
            />
          </form>
        </div>

        {/* Suggestions — idle only */}
        <div
          className={`overflow-hidden text-center transition-all duration-500 ${
            compact ? "max-h-0 opacity-0" : "mt-5 max-h-24 opacity-100"
          }`}
        >
          <p className="text-sm text-zinc-500">
            <span className="font-semibold text-zinc-700">Suggestion:</span>{" "}
            {SUGGESTIONS.map((sug, i) => (
              <span key={sug}>
                <button onClick={() => run(sug)} className="text-zinc-500 transition hover:text-brand">
                  {sug}
                </button>
                {i < SUGGESTIONS.length - 1 && <span className="px-1.5 text-zinc-300">·</span>}
              </span>
            ))}
          </p>
        </div>
      </div>

      {/* Results zone */}
      <div className="mt-8">
        {phase === "searching" && <SkeletonResults />}
        {phase === "results" && analysis && (
          <div className="animate-fade-in">
            <div className="mb-5">
              <p className="text-xs uppercase tracking-wide text-zinc-400">You asked</p>
              <h1 className="text-2xl font-semibold text-zinc-900">{submitted}</h1>
            </div>
            <WhyResults analysis={analysis} />
          </div>
        )}
        {phase === "idle" && <JournalPanel />}
      </div>

      {phase === "idle" && (
        <footer className="mt-auto py-8 text-center text-xs text-zinc-400">
          Runs entirely in your browser · classic NLP + a hand-built intent model · no API, no tracking, works offline
        </footer>
      )}
    </main>
  );
}
