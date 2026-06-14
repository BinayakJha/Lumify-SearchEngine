import { SearchResult } from "@/lib/providers/types";
import { BIG_WEB } from "./domains";
import { Lens, Rule } from "./types";

// ── Helpers ────────────────────────────────────────────────────────────────

/** Hostname without a leading "www.", lowercased. */
export function domainOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

/** Suffix match: pattern "edu" matches "cs.stanford.edu"; exact also matches. */
export function matchDomain(domain: string, pattern: string): boolean {
  const p = pattern.trim().toLowerCase().replace(/^\.+/, "");
  if (!p || !domain) return false;
  return domain === p || domain.endsWith("." + p);
}

/** First pattern in the list that matches the domain, if any. */
function matchedPattern(domain: string, patterns: string[]): string | undefined {
  return patterns.find((p) => matchDomain(domain, p));
}

const REFERENCE_YEAR = 2005;

/** 0 for old/unknown, 1 for current-year. Used by prefer-recent/older. */
function recency(year: number | undefined, currentYear: number): number {
  if (!year) return 0;
  const span = currentYear - REFERENCE_YEAR;
  if (span <= 0) return 1;
  return clamp((year - REFERENCE_YEAR) / span, 0, 1);
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

/** Best-effort publication year from the provider's metadata. */
export function yearOf(r: SearchResult): number | undefined {
  // Parse the year from the date *string* directly. new Date(s).getFullYear()
  // is timezone-dependent — "2021-01-01" parses as UTC midnight and localizes
  // to 2020 anywhere west of UTC, shifting every year filter and recency score
  // by a full year.
  const fromString = (s: string | undefined): number | undefined => {
    const m = (s ?? "").match(/(19|20)\d{2}/);
    return m ? Number(m[0]) : undefined;
  };
  return fromString(r.publishedDate) ?? fromString(r.age);
}

// ── Engine ──────────────────────────────────────────────────────────────────

export interface Contribution {
  label: string;
  delta: number;
}

export interface RankedResult {
  result: SearchResult;
  domain: string;
  year?: number;
  /** Final score after the lens is applied (higher = ranked higher). */
  score: number;
  /** Per-rule reasons the result moved — drives the transparency badges. */
  contributions: Contribution[];
  hidden: boolean;
  hiddenReason?: string;
}

export interface LensOutcome {
  results: RankedResult[]; // visible, sorted best-first
  hidden: RankedResult[]; // removed by a hard filter
  total: number;
}

/**
 * Apply a lens to a provider's raw results. Pure and deterministic (pass a
 * fixed `currentYear` for reproducible tests). Never mutates its inputs.
 */
export function applyLens(
  raw: SearchResult[],
  lens: Lens,
  opts?: { currentYear?: number },
): LensOutcome {
  const currentYear = opts?.currentYear ?? new Date().getFullYear();
  const rules = lens.rules ?? [];

  // Union of every allow-list across all allowOnly rules (if any exist).
  const allowLists = rules.filter((r): r is Extract<Rule, { type: "allowOnly" }> => r.type === "allowOnly");
  const allowUnion = allowLists.flatMap((r) => r.domains);

  const ranked: RankedResult[] = raw.map((result, index) => {
    const domain = domainOf(result.url);
    const year = yearOf(result);
    // Base score preserves the provider's order on a fixed 0–10 scale, so a
    // single-digit boost weight can meaningfully — but not absurdly — reorder.
    const base = raw.length > 0 ? (10 * (raw.length - index)) / raw.length : 0;

    let hiddenReason: string | undefined;
    const haystack = `${result.title} ${result.snippet}`.toLowerCase();

    // ── Hard filters ──────────────────────────────────────────────────────
    if (allowUnion.length > 0 && !matchedPattern(domain, allowUnion)) {
      hiddenReason = "not in allow-list";
    }
    for (const rule of rules) {
      if (hiddenReason) break;
      if (rule.type === "block" && matchedPattern(domain, rule.domains)) {
        hiddenReason = "blocked domain";
      } else if (rule.type === "maxYear" && year !== undefined && year > rule.year) {
        hiddenReason = `newer than ${rule.year}`;
      } else if (rule.type === "minYear" && year !== undefined && year < rule.year) {
        hiddenReason = `older than ${rule.year}`;
      }
    }

    if (hiddenReason) {
      return { result, domain, year, score: base, contributions: [], hidden: true, hiddenReason };
    }

    // ── Soft scorers ──────────────────────────────────────────────────────
    const contributions: Contribution[] = [];
    const add = (label: string, delta: number) => {
      if (delta !== 0) contributions.push({ label, delta: round1(delta) });
    };

    for (const rule of rules) {
      switch (rule.type) {
        case "boostDomain": {
          const hit = matchedPattern(domain, rule.domains);
          if (hit) add(hit, rule.weight);
          break;
        }
        case "buryDomain": {
          const hit = matchedPattern(domain, rule.domains);
          if (hit) add(hit, -rule.weight);
          break;
        }
        case "boostKeyword": {
          const hit = rule.keywords.find((k) => k && haystack.includes(k.toLowerCase()));
          if (hit) add(`"${hit}"`, rule.weight);
          break;
        }
        case "buryKeyword": {
          const hit = rule.keywords.find((k) => k && haystack.includes(k.toLowerCase()));
          if (hit) add(`"${hit}"`, -rule.weight);
          break;
        }
        case "preferRecent": {
          if (year !== undefined) add(`recent (${year})`, rule.weight * recency(year, currentYear));
          break;
        }
        case "preferOlder": {
          if (year !== undefined) add(`older (${year})`, rule.weight * (1 - recency(year, currentYear)));
          break;
        }
        case "smallWeb": {
          if (matchedPattern(domain, BIG_WEB)) add("big platform", -rule.weight * 0.6);
          else add("small web", rule.weight);
          break;
        }
        // hard filters handled above
        case "allowOnly":
        case "block":
        case "maxYear":
        case "minYear":
          break;
      }
    }

    const delta = contributions.reduce((sum, c) => sum + c.delta, 0);
    return {
      result,
      domain,
      year,
      score: round1(base + delta),
      contributions,
      hidden: false,
    };
  });

  const visible = ranked
    .filter((r) => !r.hidden)
    .map((r, i) => ({ r, i }))
    // Sort by score desc, breaking ties by original provider order (stable).
    .sort((a, b) => b.r.score - a.r.score || a.i - b.i)
    .map(({ r }) => r);

  const hidden = ranked.filter((r) => r.hidden);

  return { results: visible, hidden, total: raw.length };
}
