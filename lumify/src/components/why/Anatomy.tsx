import { QuestionType, Signals } from "@/lib/why/types";

// The "show your work" panel: exactly what the local algorithms extracted from
// the question. This is the transparency that makes the reasons feel earned
// instead of magic — and the showcase for the "different algorithms" idea.

const TYPE_LABEL: Record<QuestionType, string> = {
  why: "why",
  how: "how-to",
  whatis: "definition",
  what: "what / when / who",
  decision: "decision (should I…)",
  yesno: "yes / no",
  comparison: "comparison",
  troubleshoot: "troubleshooting",
  other: "other",
};

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <dt className="shrink-0 text-zinc-500">{label}</dt>
      <dd className="flex flex-wrap items-center justify-end gap-1">{children}</dd>
    </div>
  );
}

export function Anatomy({ signals }: { signals: Signals }) {
  const { questionType, topic, emotions, urgency, urgencyMarker, isPersonal, aboutOther, assumptions } = signals;
  const perspective = aboutOther ? "about someone else" : isPersonal ? "personal (about you)" : "general";

  return (
    <aside className="rounded-xl border border-zinc-200 bg-white p-4">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
        How the engine read your question
      </h2>
      <dl className="mt-2 divide-y divide-zinc-100 text-sm">
        <Row label="Type">
          <span className="chip py-0.5">{TYPE_LABEL[questionType]}</span>
        </Row>
        <Row label="Topic">
          {topic.text ? (
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-700">{topic.text}</code>
          ) : (
            <span className="text-zinc-400">unclear</span>
          )}
        </Row>
        <Row label="Tone">
          {emotions.length ? (
            emotions.map((e) => <span key={e} className="badge badge-neutral">{e}</span>)
          ) : (
            <span className="text-zinc-400">neutral</span>
          )}
        </Row>
        <Row label="Urgency">
          {urgency === "none" ? (
            <span className="text-zinc-400">none</span>
          ) : (
            <span className="badge badge-bury">{urgencyMarker} · {urgency}</span>
          )}
        </Row>
        <Row label="Perspective">
          <span className="text-zinc-600">{perspective}</span>
        </Row>
      </dl>

      {assumptions.length > 0 && (
        <div className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
          <span className="font-medium">Your question quietly assumes </span>
          {assumptions.join("; ")}.
        </div>
      )}
    </aside>
  );
}
