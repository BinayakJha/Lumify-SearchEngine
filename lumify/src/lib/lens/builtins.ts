import { ACADEMIC, BIG_WEB, DOCS, SLOP, TUTORIAL_SPAM } from "./domains";
import { Lens } from "./types";

// The lenses Lumify ships with. Each is a worked example of the rule system —
// users fork these into their own lenses. The first one (Default) is the
// untouched provider ranking.
export const BUILTIN_LENSES: Lens[] = [
  {
    id: "default",
    name: "Default",
    description: "The raw ranking, untouched. Your baseline.",
    emoji: "🔎",
    builtin: true,
    rules: [],
  },
  {
    id: "academic",
    name: "Academic",
    description: "Pull universities, journals, and primary research to the top; sink content farms.",
    emoji: "🎓",
    builtin: true,
    rules: [
      { type: "boostDomain", domains: ACADEMIC, weight: 6 },
      { type: "buryDomain", domains: SLOP, weight: 5 },
    ],
  },
  {
    id: "no-slop",
    name: "No Slop",
    description: "Bury SEO bait and content farms, and lean older — away from AI-generated filler.",
    emoji: "🧹",
    builtin: true,
    rules: [
      { type: "buryDomain", domains: SLOP, weight: 6 },
      { type: "preferOlder", weight: 3 },
      { type: "smallWeb", weight: 2 },
    ],
  },
  {
    id: "small-web",
    name: "Small Web",
    description: "Favor indie blogs and personal sites; push the big platforms down.",
    emoji: "🌱",
    builtin: true,
    rules: [
      { type: "smallWeb", weight: 6 },
      { type: "buryDomain", domains: BIG_WEB, weight: 4 },
    ],
  },
  {
    id: "docs-only",
    name: "Docs Only",
    description: "Surface official documentation; sink tutorial-spam sites.",
    emoji: "📚",
    builtin: true,
    rules: [
      { type: "boostDomain", domains: DOCS, weight: 6 },
      { type: "buryDomain", domains: TUTORIAL_SPAM, weight: 5 },
    ],
  },
  {
    id: "pre-ai",
    name: "Pre-AI Web",
    description: "Only pages from 2022 or earlier — the web before the slop flood.",
    emoji: "⏳",
    builtin: true,
    rules: [
      { type: "maxYear", year: 2022 },
      { type: "preferOlder", weight: 4 },
    ],
  },
];

export const DEFAULT_LENS = BUILTIN_LENSES[0];

export function builtinById(id: string | undefined | null): Lens | undefined {
  if (!id) return undefined;
  return BUILTIN_LENSES.find((l) => l.id === id);
}
