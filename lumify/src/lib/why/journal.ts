import { Analysis } from "./types";

// A local-only record of what you ask, so Lumify can show you patterns over time.
// Everyone else monetizes your search history; this never leaves the device — it's
// handed back to you as self-awareness. Storage glue is client-only; `summarize`
// is pure so it can be unit-tested.

export interface JournalEntry {
  q: string;
  ts: number;
  reasonId: string;
  reasonLabel: string;
  emoji: string;
  type: string;
  emotions: string[];
}

export interface JournalInsight {
  total: number;
  thisWeek: number;
  topReasons: { id: string; label: string; emoji: string; count: number }[];
  unactedDecisions: number;
  headline: string;
}

const KEY = "lumify:journal";
const MAX = 100;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export function load(): JournalEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function recordAnalysis(a: Analysis): void {
  if (typeof window === "undefined" || a.reasons.length === 0) return;
  const list = load();
  if (list[0]?.q === a.query) return; // ignore refreshes / StrictMode double-runs
  const top = a.reasons[0];
  const entry: JournalEntry = {
    q: a.query,
    ts: Date.now(),
    reasonId: top.id,
    reasonLabel: top.label,
    emoji: top.emoji,
    type: a.signals.questionType,
    emotions: a.signals.emotions,
  };
  try {
    window.localStorage.setItem(KEY, JSON.stringify([entry, ...list].slice(0, MAX)));
  } catch {
    /* storage full/blocked — non-fatal */
  }
}

export function clearJournal(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* no-op */
  }
}

export function summarize(entries: JournalEntry[], now = Date.now()): JournalInsight {
  const total = entries.length;
  const thisWeek = entries.filter((e) => now - e.ts <= WEEK_MS).length;

  const counts = new Map<string, { id: string; label: string; emoji: string; count: number }>();
  for (const e of entries) {
    const c = counts.get(e.reasonId) ?? { id: e.reasonId, label: e.reasonLabel, emoji: e.emoji, count: 0 };
    c.count += 1;
    counts.set(e.reasonId, c);
  }
  const topReasons = [...counts.values()].sort((a, b) => b.count - a.count).slice(0, 3);
  const unactedDecisions = entries.filter((e) => e.reasonId === "decision").length;

  let headline = "";
  if (total > 0) {
    const top = topReasons[0];
    const pct = Math.round((top.count / total) * 100);
    headline =
      top.count >= 2 && pct >= 40
        ? `A lot of what you ask is about ${top.label.toLowerCase()} — ${top.count} of your ${total} questions.`
        : `You've asked ${total} question${total > 1 ? "s" : ""} so far.`;
    if (unactedDecisions >= 2) {
      headline += ` You've weighed ${unactedDecisions} decisions here — maybe it's time to make one.`;
    }
  }

  return { total, thisWeek, topReasons, unactedDecisions, headline };
}
