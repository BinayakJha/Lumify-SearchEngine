import Link from "next/link";
import { Reason } from "@/lib/why/types";

function confidenceLabel(c: number): string {
  if (c >= 0.6) return "strong hunch";
  if (c >= 0.35) return "likely";
  return "a maybe";
}

export function ReasonCard({ reason }: { reason: Reason }) {
  const { emoji, label, headline, deeperNeed, reframe, confidence, evidence } = reason;
  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-4 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl" aria-hidden>{emoji}</span>
          <h3 className="font-semibold text-zinc-900">{label}</h3>
        </div>
        <span className="shrink-0 rounded-full bg-brand-soft px-2 py-0.5 text-xs font-medium text-brand">
          {confidenceLabel(confidence)}
        </span>
      </div>

      <div className="mt-2 h-1 w-full overflow-hidden rounded bg-zinc-100">
        <div className="h-full rounded bg-brand" style={{ width: `${Math.round(confidence * 100)}%` }} />
      </div>

      <p className="mt-3 text-zinc-800">{headline}</p>
      <p className="mt-2 text-sm text-zinc-500">
        <span className="font-medium text-zinc-600">What you might really want: </span>
        {deeperNeed}
      </p>

      <Link
        href={`/why?q=${encodeURIComponent(reframe)}&ref=1`}
        className="group mt-3 flex items-start gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 transition hover:border-brand-ring hover:bg-brand-soft"
      >
        <span className="shrink-0 pt-0.5 text-xs font-medium uppercase tracking-wide text-zinc-400 group-hover:text-brand">
          ask instead
        </span>
        <span className="group-hover:text-brand">{reframe}</span>
      </Link>

      {evidence.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {evidence.map((e, i) => (
            <span key={i} className="badge badge-neutral">{e}</span>
          ))}
        </div>
      )}
    </article>
  );
}
