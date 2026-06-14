"use client";

import { useState } from "react";
import { LaunchLink } from "@/lib/why/launchpad";
import { LaunchLinkRow } from "./LaunchLinkRow";

// Mobile-only sticky bottom sheet, so the launchpad is always one thumb-tap away
// no matter how far you've scrolled. Hidden on md+ where the sticky sidebar
// card (Launchpad) takes over.
export function LaunchpadBar({ links }: { links: LaunchLink[] }) {
  const [open, setOpen] = useState(false);
  if (links.length === 0) return null;

  return (
    <div className="md:hidden">
      {open && (
        <button
          aria-label="Close"
          className="fixed inset-0 z-30 cursor-default bg-black/20"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white shadow-pop">
        {open && (
          <ul className="max-h-[55vh] space-y-2 overflow-y-auto border-b border-zinc-100 p-3">
            {links.map((l, i) => (
              <li key={i}>
                <LaunchLinkRow link={l} />
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-zinc-900"
          aria-expanded={open}
        >
          <span className="flex items-center gap-2">
            <span aria-hidden>🔎</span>
            Where to actually look
            <span className="rounded-full bg-brand-soft px-1.5 py-0.5 text-xs text-brand">{links.length}</span>
          </span>
          <span className={`text-zinc-400 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden>
            ▾
          </span>
        </button>
      </div>
    </div>
  );
}
