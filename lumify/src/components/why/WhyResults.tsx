import { Analysis } from "@/lib/why/types";
import { buildLaunchpad } from "@/lib/why/launchpad";
import { ReasonCard } from "./ReasonCard";
import { Anatomy } from "./Anatomy";
import { Launchpad } from "./Launchpad";
import { LaunchpadBar } from "./LaunchpadBar";
import { DecisionKit } from "./DecisionKit";

// The reasons grid + sidebar + mobile launchpad bar. Shared by the SSR `/why`
// permalink and the animated in-page search on the home page, so both render
// identically.
export function WhyResults({ analysis }: { analysis: Analysis }) {
  const launchpad = buildLaunchpad(analysis);
  const showDecision =
    analysis.signals.questionType === "decision" || analysis.reasons.some((r) => r.id === "decision");
  const decisionAction = analysis.signals.topic.text || "this";

  return (
    <>
      <div className="grid gap-6 md:grid-cols-[1fr_18rem]">
        <div className="space-y-3">
          <p className="text-sm text-zinc-500">You might be asking because…</p>
          {analysis.reasons.map((r) => (
            <ReasonCard key={r.id} reason={r} />
          ))}
          {showDecision && <DecisionKit action={decisionAction} />}
        </div>
        <div className="space-y-3 md:sticky md:top-20 md:self-start">
          <div className="hidden md:block">
            <Launchpad links={launchpad} />
          </div>
          <Anatomy signals={analysis.signals} />
          <p className="px-1 text-xs leading-relaxed text-zinc-400">
            No answers, on purpose. Lumify reflects your question back so you can ask a sharper one.
            All analysis runs on your device.
          </p>
        </div>
      </div>

      <LaunchpadBar links={launchpad} />
    </>
  );
}
