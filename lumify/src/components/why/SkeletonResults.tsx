// The "thinking…" state shown for a beat after you search, before the real
// reasons fade in. Mirrors the results layout so nothing jumps.
export function SkeletonResults() {
  return (
    <div className="grid animate-pulse gap-6 md:grid-cols-[1fr_18rem]">
      <div className="space-y-3">
        <div className="h-4 w-44 rounded bg-zinc-200" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-xl border border-zinc-200 bg-white p-4">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-full bg-zinc-200" />
              <div className="h-4 w-40 rounded bg-zinc-200" />
            </div>
            <div className="mt-3 h-3 w-full rounded bg-zinc-100" />
            <div className="mt-2 h-3 w-5/6 rounded bg-zinc-100" />
            <div className="mt-3 h-9 w-full rounded-lg bg-zinc-100" />
          </div>
        ))}
      </div>
      <div className="space-y-3">
        <div className="h-44 rounded-xl border border-zinc-200 bg-white" />
        <div className="h-28 rounded-xl border border-zinc-200 bg-white" />
      </div>
    </div>
  );
}
