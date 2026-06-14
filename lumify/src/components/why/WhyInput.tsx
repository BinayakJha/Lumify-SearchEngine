"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function WhyInput({
  initialQuery = "",
  autoFocus,
  size = "md",
}: {
  initialQuery?: string;
  autoFocus?: boolean;
  size?: "md" | "lg";
}) {
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);
  const lg = size === "lg";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const v = q.trim();
        if (v) router.push(`/why?q=${encodeURIComponent(v)}`);
      }}
      className={`flex w-full items-center gap-2 rounded-full border border-zinc-300 bg-white shadow-card transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand-ring/60 ${
        lg ? "px-5 py-3" : "px-4 py-2"
      }`}
    >
      <span className={`shrink-0 ${lg ? "text-xl" : "text-base"}`} aria-hidden>
        🤔
      </span>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        autoFocus={autoFocus}
        placeholder="Ask a question…"
        aria-label="Your question"
        className={`min-w-0 flex-1 bg-transparent outline-none placeholder:text-zinc-400 ${lg ? "text-lg" : "text-[15px]"}`}
      />
      <button type="submit" className={`btn-primary shrink-0 rounded-full ${lg ? "px-5 py-2" : "px-4 py-1.5"}`}>
        Why?
      </button>
    </form>
  );
}
