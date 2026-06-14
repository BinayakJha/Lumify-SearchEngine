import { Lens, Rule, RuleType } from "./types";

// URL-safe base64 that works the same on the server (Node Buffer) and in the
// browser (btoa/atob). Custom lenses are encoded into share links with this so
// Lumify needs no database to share a lens — the lens *is* the URL.
function toBase64Url(input: string): string {
  const b64 =
    typeof window === "undefined"
      ? Buffer.from(input, "utf-8").toString("base64")
      : btoa(unescape(encodeURIComponent(input)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(input: string): string {
  const b64 = input.replace(/-/g, "+").replace(/_/g, "/");
  return typeof window === "undefined"
    ? Buffer.from(b64, "base64").toString("utf-8")
    : decodeURIComponent(escape(atob(b64)));
}

const VALID_RULE_TYPES: RuleType[] = [
  "allowOnly", "block", "boostDomain", "buryDomain", "boostKeyword",
  "buryKeyword", "preferRecent", "preferOlder", "smallWeb", "maxYear", "minYear",
];

function isRule(value: unknown): value is Rule {
  if (!value || typeof value !== "object") return false;
  const t = (value as { type?: unknown }).type;
  return typeof t === "string" && VALID_RULE_TYPES.includes(t as RuleType);
}

/** Runtime guard for lenses arriving from a URL or localStorage. */
export function isValidLens(value: unknown): value is Lens {
  if (!value || typeof value !== "object") return false;
  const l = value as Partial<Lens>;
  return (
    typeof l.id === "string" &&
    typeof l.name === "string" &&
    typeof l.description === "string" &&
    Array.isArray(l.rules) &&
    l.rules.every(isRule)
  );
}

export function encodeLens(lens: Lens): string {
  return toBase64Url(JSON.stringify(lens));
}

export function decodeLens(encoded: string): Lens | null {
  try {
    const parsed = JSON.parse(fromBase64Url(encoded));
    return isValidLens(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/** Build the query string for a search, embedding the lens. */
export function searchHref(query: string, lens: Lens): string {
  const params = new URLSearchParams({ q: query });
  if (lens.builtin) params.set("lens", lens.id);
  else params.set("lensdata", encodeLens(lens));
  return `/search?${params.toString()}`;
}
