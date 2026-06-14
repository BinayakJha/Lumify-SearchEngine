import { Analysis, Reason } from "./types";
import { analyzeSignals, contentTokensOf } from "./signals";
import { MOTIVATIONS, Motivation } from "./motivations";

export { analyzeSignals } from "./signals";

// Overlap coefficient between two token bags: |A ∩ B| / min(|A|, |B|).
// A cheap, local stand-in for semantic similarity that's plenty for short
// queries vs. short example questions.
function overlap(a: string[], b: string[]): number {
  const setA = new Set(a);
  const setB = new Set(b);
  if (setA.size === 0 || setB.size === 0) return 0;
  let hits = 0;
  for (const t of setA) if (setB.has(t)) hits++;
  return hits / Math.min(setA.size, setB.size);
}

// Precompute example tokens once at module load.
const EXAMPLE_TOKENS: Record<string, string[][]> = Object.fromEntries(
  MOTIVATIONS.map((m) => [m.id, m.examples.map(contentTokensOf)]),
);

interface Scored {
  m: Motivation;
  score: number;
  evidence: string[];
}

const THRESHOLD = 0.12;
const MIN_REASONS = 3;
const MAX_REASONS = 4;

/**
 * The Why Engine. Given a question, infer the likely reasons it was asked.
 * Pure and deterministic — no clock, no randomness, no network.
 */
export function analyze(query: string): Analysis {
  const signals = analyzeSignals(query);
  if (signals.normalized.length === 0) {
    return { query, signals, reasons: [] };
  }

  const q = signals.contentTokens;
  const scored: Scored[] = MOTIVATIONS.map((m) => {
    const base = m.score(signals);
    let bestSim = 0;
    let bestExample = "";
    EXAMPLE_TOKENS[m.id].forEach((exTokens, i) => {
      const sim = overlap(q, exTokens);
      if (sim > bestSim) {
        bestSim = sim;
        bestExample = m.examples[i];
      }
    });
    const evidence = [...base.evidence];
    if (bestSim >= 0.5) evidence.push(`sounds like "${bestExample}"`);
    return { m, score: Math.min(1, base.score + bestSim * 0.3), evidence };
  });

  const ranked = [...scored].sort((a, b) => b.score - a.score);
  // Show everything above the bar (capped). If that's too few, top up from the
  // next-best — but never include a zero-score motivation as filler.
  let chosen = ranked.filter((x) => x.score > THRESHOLD);
  if (chosen.length < MIN_REASONS) {
    chosen = ranked.filter((x) => x.score > 0).slice(0, MIN_REASONS);
  }
  chosen = chosen.slice(0, MAX_REASONS);

  const reasons: Reason[] = chosen.map((x) => ({
    id: x.m.id,
    label: x.m.label,
    emoji: x.m.emoji,
    headline: x.m.phrase(signals),
    deeperNeed: x.m.deeperNeed(signals),
    reframe: x.m.reframe(signals),
    confidence: x.score,
    evidence: x.evidence,
  }));

  return { query, signals, reasons };
}
