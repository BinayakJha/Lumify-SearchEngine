// A Lens is a small, shareable ruleset that reshapes search ranking.
// Rules come in two flavors:
//   - hard filters  (allowOnly / block / maxYear / minYear) remove results
//   - soft scorers   (boost*/bury*/prefer*/smallWeb) nudge results up or down
export type Rule =
  | { type: "allowOnly"; domains: string[] }
  | { type: "block"; domains: string[] }
  | { type: "boostDomain"; domains: string[]; weight: number }
  | { type: "buryDomain"; domains: string[]; weight: number }
  | { type: "boostKeyword"; keywords: string[]; weight: number }
  | { type: "buryKeyword"; keywords: string[]; weight: number }
  | { type: "preferRecent"; weight: number }
  | { type: "preferOlder"; weight: number }
  | { type: "smallWeb"; weight: number }
  | { type: "maxYear"; year: number }
  | { type: "minYear"; year: number };

export type RuleType = Rule["type"];

export interface Lens {
  id: string;
  name: string;
  description: string;
  emoji?: string;
  author?: string;
  builtin?: boolean;
  rules: Rule[];
}

/** Which input fields each rule type needs — drives the lens editor UI. */
export interface RuleKind {
  type: RuleType;
  label: string;
  help: string;
  fields: ("domains" | "keywords" | "weight" | "year")[];
}

export const RULE_KINDS: RuleKind[] = [
  { type: "boostDomain", label: "Boost domains", help: "Push results from these domains up", fields: ["domains", "weight"] },
  { type: "buryDomain", label: "Bury domains", help: "Push results from these domains down", fields: ["domains", "weight"] },
  { type: "allowOnly", label: "Only these domains", help: "Hide everything not from these domains", fields: ["domains"] },
  { type: "block", label: "Block domains", help: "Hide results from these domains entirely", fields: ["domains"] },
  { type: "boostKeyword", label: "Boost keywords", help: "Boost results whose title/snippet contains these", fields: ["keywords", "weight"] },
  { type: "buryKeyword", label: "Bury keywords", help: "Bury results whose title/snippet contains these", fields: ["keywords", "weight"] },
  { type: "preferRecent", label: "Prefer recent", help: "Boost newer pages", fields: ["weight"] },
  { type: "preferOlder", label: "Prefer older", help: "Boost older pages (great against AI slop)", fields: ["weight"] },
  { type: "smallWeb", label: "Prefer small web", help: "Boost indie sites, bury big platforms", fields: ["weight"] },
  { type: "maxYear", label: "On or before year", help: "Hide pages newer than this year", fields: ["year"] },
  { type: "minYear", label: "On or after year", help: "Hide pages older than this year", fields: ["year"] },
];
