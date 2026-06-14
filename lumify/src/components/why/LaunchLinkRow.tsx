import { LaunchLink } from "@/lib/why/launchpad";

// One launchpad link, shared by the desktop sidebar card and the mobile sheet.
export function LaunchLinkRow({ link }: { link: LaunchLink }) {
  const isResource = link.venue === "Resource";
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noreferrer"
      className={`flex items-center gap-3 rounded-lg border px-3 py-2 transition ${
        isResource
          ? "border-rose-200 bg-rose-50 hover:bg-rose-100"
          : "border-zinc-200 hover:border-brand-ring hover:bg-brand-soft"
      }`}
    >
      <span className="text-lg" aria-hidden>{link.emoji}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-zinc-800">To {link.intent}</span>
        <span className="block truncate text-xs text-zinc-500">
          {link.venue}: {link.query}
        </span>
        {link.note && (
          <span className={`mt-0.5 block text-xs ${isResource ? "text-rose-700" : "text-amber-700"}`}>
            {link.note}
          </span>
        )}
      </span>
      <span className="shrink-0 text-zinc-300" aria-hidden>↗</span>
    </a>
  );
}
