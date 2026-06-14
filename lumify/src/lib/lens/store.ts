import { Lens } from "./types";
import { isValidLens } from "./encode";

// User-created lenses live in localStorage — no account, no backend. This keeps
// v1 deployable as a static-ish Next app while still letting people build and
// keep their own lenses (and share them via encoded links).
const KEY = "lumify:lenses";

export function loadCustomLenses(): Lens[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isValidLens) : [];
  } catch {
    return [];
  }
}

export function saveCustomLens(lens: Lens): Lens[] {
  const lenses = loadCustomLenses();
  const next = [...lenses.filter((l) => l.id !== lens.id), { ...lens, builtin: false }];
  persist(next);
  return next;
}

export function deleteCustomLens(id: string): Lens[] {
  const next = loadCustomLenses().filter((l) => l.id !== id);
  persist(next);
  return next;
}

function persist(lenses: Lens[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(lenses));
  } catch {
    // Storage full or blocked — non-fatal; the lens still works this session.
  }
}

/** Slug + de-collide an id from a lens name. */
export function makeLensId(name: string, existing: string[]): string {
  const base =
    name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "lens";
  let id = base;
  let n = 2;
  while (existing.includes(id)) id = `${base}-${n++}`;
  return id;
}
