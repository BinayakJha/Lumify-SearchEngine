import { LensOutcome } from "@/lib/lens/engine";
import { ResultCard } from "./ResultCard";

export function ResultList({
  outcome,
  lensName,
  showScores,
}: {
  outcome: LensOutcome;
  lensName: string;
  showScores: boolean;
}) {
  return (
    <div>
      <ol className="space-y-1">
        {outcome.results.map((r, i) => (
          <ResultCard key={`${r.result.url}-${i}`} ranked={r} showScore={showScores} />
        ))}
      </ol>

      {outcome.results.length === 0 && (
        <p className="rounded-xl border border-zinc-200 bg-white p-6 text-center text-sm text-zinc-500">
          The <strong>{lensName}</strong> lens filtered out every result. Try a
          different lens or loosen its rules.
        </p>
      )}

      {outcome.hidden.length > 0 && (
        <details className="mt-4 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm">
          <summary className="cursor-pointer select-none font-medium text-zinc-600">
            {outcome.hidden.length} result{outcome.hidden.length > 1 ? "s" : ""} hidden by the{" "}
            {lensName} lens
          </summary>
          <ul className="mt-2 space-y-1 text-zinc-500">
            {outcome.hidden.map((h, i) => (
              <li key={i} className="flex items-center justify-between gap-3">
                <span className="truncate">{h.domain}</span>
                <span className="shrink-0 text-xs text-zinc-400">{h.hiddenReason}</span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
