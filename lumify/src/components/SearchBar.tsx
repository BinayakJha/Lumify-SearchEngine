"use client";

import { useState } from "react";

export function SearchBar({
  initialQuery,
  onSubmit,
  autoFocus,
}: {
  initialQuery: string;
  onSubmit: (q: string) => void;
  autoFocus?: boolean;
}) {
  const [q, setQ] = useState(initialQuery);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const v = q.trim();
        if (v) onSubmit(v);
      }}
      className="flex w-full items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-2 shadow-card transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand-ring/60"
    >
      <svg className="h-4 w-4 shrink-0 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" strokeLinecap="round" />
      </svg>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        autoFocus={autoFocus}
        placeholder="Search the web…"
        className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-zinc-400"
        aria-label="Search query"
      />
      <button type="submit" className="btn-primary shrink-0 rounded-full px-4 py-1.5">
        Search
      </button>
    </form>
  );
}
