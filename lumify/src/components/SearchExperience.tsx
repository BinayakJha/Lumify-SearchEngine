"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SearchResult } from "@/lib/providers/types";
import { Lens } from "@/lib/lens/types";
import { applyLens } from "@/lib/lens/engine";
import { BUILTIN_LENSES, DEFAULT_LENS } from "@/lib/lens/builtins";
import { searchHref } from "@/lib/lens/encode";
import { deleteCustomLens, loadCustomLenses, makeLensId, saveCustomLens } from "@/lib/lens/store";
import { SearchBar } from "./SearchBar";
import { LensPicker } from "./LensPicker";
import { ResultList } from "./ResultList";
import { LensEditor } from "./LensEditor";

export function SearchExperience({
  query,
  providerName,
  degraded,
  rawResults,
  initialLens,
}: {
  query: string;
  providerName: string;
  degraded: boolean;
  rawResults: SearchResult[];
  initialLens: Lens;
}) {
  const router = useRouter();
  const [custom, setCustom] = useState<Lens[]>([]);
  const [selected, setSelected] = useState<Lens>(initialLens);
  const [editing, setEditing] = useState<Lens | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => setCustom(loadCustomLenses()), []);
  // A new search re-renders the server component with a fresh initialLens.
  useEffect(() => setSelected(initialLens), [initialLens]);

  const allLenses = useMemo(() => {
    const byId = new Map<string, Lens>();
    for (const l of [...BUILTIN_LENSES, ...custom]) byId.set(l.id, l);
    if (!byId.has(selected.id)) byId.set(selected.id, selected); // lens from a share link
    return [...byId.values()];
  }, [custom, selected]);

  const existingIds = useMemo(() => allLenses.map((l) => l.id), [allLenses]);
  const outcome = useMemo(() => applyLens(rawResults, selected), [rawResults, selected]);
  const isDefault = selected.rules.length === 0;
  const isSavedCustom = !selected.builtin && custom.some((l) => l.id === selected.id);

  // Switching a lens re-ranks client-side and updates the URL — no refetch.
  const selectLens = useCallback(
    (lens: Lens) => {
      setSelected(lens);
      window.history.replaceState(null, "", searchHref(query, lens));
    },
    [query],
  );

  const onSearch = useCallback((q: string) => router.push(searchHref(q, selected)), [router, selected]);

  const onShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin + searchHref(query, selected));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked — no-op */
    }
  }, [query, selected]);

  const onSaveLens = (lens: Lens) => {
    setCustom(saveCustomLens(lens));
    setEditing(null);
    selectLens(lens);
  };

  const startNew = () =>
    setEditing({
      id: makeLensId("My lens", existingIds),
      name: "My lens",
      description: "",
      emoji: "🔧",
      builtin: false,
      rules: [{ type: "boostDomain", domains: [], weight: 4 }],
    });
  const startFork = () =>
    setEditing({
      ...selected,
      id: makeLensId(`${selected.name} copy`, existingIds),
      name: `${selected.name} (copy)`,
      builtin: false,
    });

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-zinc-50/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <Link href="/" className="shrink-0 text-lg font-bold tracking-tight">
            <span className="bg-gradient-to-r from-brand to-fuchsia-500 bg-clip-text text-transparent">
              Lumify
            </span>
          </Link>
          <div className="flex-1">
            <SearchBar initialQuery={query} onSubmit={onSearch} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-5">
        <div className="mb-3">
          <LensPicker
            lenses={allLenses}
            selectedId={selected.id}
            onSelect={selectLens}
            onNew={startNew}
          />
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm text-zinc-500">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{outcome.results.length} results</span>
            <span>·</span>
            <span>
              lens:{" "}
              <strong className="text-zinc-700">
                {selected.emoji} {selected.name}
              </strong>
            </span>
            <span className="rounded bg-zinc-200/70 px-1.5 py-0.5 text-xs">via {providerName}</span>
          </div>
          <div className="flex items-center gap-1">
            {selected.builtin ? (
              <button className="btn-ghost" onClick={startFork}>Fork</button>
            ) : (
              <>
                <button className="btn-ghost" onClick={() => setEditing(selected)}>Edit</button>
                {isSavedCustom ? (
                  <button
                    className="btn-ghost text-rose-600 hover:bg-rose-50"
                    onClick={() => {
                      setCustom(deleteCustomLens(selected.id));
                      selectLens(DEFAULT_LENS);
                    }}
                  >
                    Delete
                  </button>
                ) : (
                  <button className="btn-ghost" onClick={() => setCustom(saveCustomLens(selected))}>
                    Save
                  </button>
                )}
              </>
            )}
            <button className="btn-primary" onClick={onShare}>
              {copied ? "Copied!" : "Share"}
            </button>
          </div>
        </div>

        {degraded && (
          <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Live provider unavailable — showing sample results so the page still works.
          </div>
        )}

        {selected.description && !isDefault && (
          <p className="mb-3 text-sm text-zinc-500">{selected.description}</p>
        )}

        <ResultList outcome={outcome} lensName={selected.name} showScores={!isDefault} />
      </main>

      {editing && (
        <LensEditor initial={editing} onSave={onSaveLens} onCancel={() => setEditing(null)} />
      )}
    </div>
  );
}
