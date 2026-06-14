import { RankedResult } from "@/lib/lens/engine";
import { LensBadge } from "./LensBadge";

export function ResultCard({
  ranked,
  showScore,
}: {
  ranked: RankedResult;
  showScore: boolean;
}) {
  const { result, domain, year, contributions, score } = ranked;
  return (
    <li className="rounded-xl border border-transparent p-3 transition-colors hover:border-zinc-200 hover:bg-white hover:shadow-card">
      <div className="flex items-start gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={result.favicon}
          alt=""
          width={20}
          height={20}
          className="mt-1 h-5 w-5 shrink-0 rounded"
          loading="lazy"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <span className="truncate">{domain}</span>
            {year && <span className="shrink-0">· {year}</span>}
          </div>
          <a
            href={result.url}
            target="_blank"
            rel="noreferrer"
            className="block truncate text-lg font-medium text-brand hover:underline"
          >
            {result.title}
          </a>
          <p className="mt-0.5 line-clamp-2 text-sm text-zinc-600">{result.snippet}</p>
          {contributions.length > 0 && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {contributions.map((c, i) => (
                <LensBadge key={i} {...c} />
              ))}
            </div>
          )}
        </div>
        {showScore && (
          <div
            className="shrink-0 rounded-md bg-zinc-100 px-1.5 py-0.5 text-xs font-medium tabular-nums text-zinc-500"
            title="Score after the lens (higher ranks first)"
          >
            {score.toFixed(1)}
          </div>
        )}
      </div>
    </li>
  );
}
