"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { JournalEntry, clearJournal, load, summarize } from "@/lib/why/journal";

export function JournalPanel() {
  const [entries, setEntries] = useState<JournalEntry[] | null>(null);
  useEffect(() => setEntries(load()), []);

  // Render nothing until we've checked storage and found history (avoids a
  // hydration flash and keeps the home page clean for first-time visitors).
  if (!entries || entries.length === 0) return null;
  const insight = summarize(entries);

  return (
    <section className="mx-auto mt-10 w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-5 text-left shadow-card">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-900">Your question patterns</h2>
        <button
          className="text-xs text-zinc-400 transition hover:text-rose-600"
          onClick={() => {
            clearJournal();
            setEntries([]);
          }}
        >
          clear
        </button>
      </div>

      {insight.headline && <p className="mt-2 text-sm text-zinc-700">{insight.headline}</p>}

      <div className="mt-3 space-y-1.5">
        {insight.topReasons.map((r) => (
          <div key={r.id} className="flex items-center gap-2 text-sm">
            <span aria-hidden>{r.emoji}</span>
            <span className="w-40 shrink-0 truncate text-zinc-600">{r.label}</span>
            <div className="h-2 flex-1 overflow-hidden rounded bg-zinc-100">
              <div className="h-full rounded bg-brand" style={{ width: `${Math.round((r.count / insight.total) * 100)}%` }} />
            </div>
            <span className="w-6 text-right text-xs tabular-nums text-zinc-400">{r.count}</span>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">Recent</p>
        <ul className="mt-1 space-y-1">
          {entries.slice(0, 5).map((e, i) => (
            <li key={i}>
              <Link
                href={`/why?q=${encodeURIComponent(e.q)}`}
                className="flex items-center gap-2 text-sm text-zinc-600 transition hover:text-brand"
              >
                <span aria-hidden>{e.emoji}</span>
                <span className="truncate">{e.q}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-3 text-xs text-zinc-400">Stored only on this device. Never uploaded.</p>
    </section>
  );
}
