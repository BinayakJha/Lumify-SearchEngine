// Shown when the engine detects a "should I…" question. A tiny, local decision
// aid — the kind of structured nudge people actually find useful when stuck.
export function DecisionKit({ action }: { action: string }) {
  return (
    <section className="rounded-xl border border-brand-ring bg-brand-soft/60 p-4">
      <h2 className="flex items-center gap-2 font-semibold text-zinc-900">
        <span aria-hidden>🧭</span> Decision helper
      </h2>
      <ul className="mt-3 space-y-2.5 text-sm text-zinc-700">
        <li>
          <span className="font-medium text-zinc-900">The hidden trade-off.</span> Name what you give
          up either way — usually a sure thing now versus a maybe-better thing later.
        </li>
        <li>
          <span className="font-medium text-zinc-900">10 / 10 / 10.</span> How will you feel about{" "}
          {action} in 10 minutes, 10 months, and 10 years?
        </li>
        <li>
          <span className="font-medium text-zinc-900">The friend test.</span> If your best friend
          asked you this exact question, what would you tell them?
        </li>
        <li>
          <span className="font-medium text-zinc-900">The trap.</span> Don&apos;t lock this in on a bad
          day — make sure you&apos;re deciding from a calm place, not a low one.
        </li>
      </ul>
    </section>
  );
}
