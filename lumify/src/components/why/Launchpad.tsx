import { LaunchLink } from "@/lib/why/launchpad";
import { LaunchLinkRow } from "./LaunchLinkRow";

// Desktop sidebar card. On mobile this is hidden in favor of LaunchpadBar.
export function Launchpad({ links }: { links: LaunchLink[] }) {
  if (links.length === 0) return null;
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-card">
      <h2 className="text-sm font-semibold text-zinc-900">Where to actually look</h2>
      <p className="mt-0.5 text-xs text-zinc-500">
        Lumify doesn&apos;t answer — it aims you. Each link is tuned to a reason.
      </p>
      <ul className="mt-3 space-y-2">
        {links.map((l, i) => (
          <li key={i}>
            <LaunchLinkRow link={l} />
          </li>
        ))}
      </ul>
    </section>
  );
}
