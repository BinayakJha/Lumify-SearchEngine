import { Analysis, Signals } from "./types";

// Lumify doesn't fetch answers — so the most *useful* thing it can do is aim you:
// for each reason, the exact query and the right venue to satisfy that intent,
// as a one-click deep link. No API — just well-formed search URLs.

export type Venue = "Google" | "YouTube" | "Reddit" | "Wikipedia" | "Scholar" | "Resource";

export interface LaunchLink {
  reasonId: string;
  intent: string;
  venue: Venue;
  query: string;
  url: string;
  emoji: string;
  note?: string;
}

const enc = encodeURIComponent;

const URL_FOR: Record<Exclude<Venue, "Resource">, (q: string) => string> = {
  Google: (q) => `https://www.google.com/search?q=${enc(q)}`,
  YouTube: (q) => `https://www.youtube.com/results?search_query=${enc(q)}`,
  // Reddit's own search is weak; a Google site: query finds better threads.
  Reddit: (q) => `https://www.google.com/search?q=${enc(`site:reddit.com ${q}`)}`,
  Wikipedia: (q) => `https://en.wikipedia.org/w/index.php?search=${enc(q)}`,
  Scholar: (q) => `https://scholar.google.com/scholar?q=${enc(q)}`,
};

const VENUE_EMOJI: Record<Venue, string> = {
  Google: "🔎", YouTube: "🎥", Reddit: "💬", Wikipedia: "📖", Scholar: "🎓", Resource: "🆘",
};

// Use a confidently-extracted short subject when we have one; otherwise fall back
// to the whole question so we never build a garbled query.
function subjectOf(s: Signals): string | null {
  const t = s.topic;
  if (t.confidence >= 0.5 && t.text && t.text.split(" ").length <= 4) return t.text;
  return null;
}

// Care mode: a tiny, responsible exception. If the question signals crisis, the
// first "link" is a real lifeline, not a web search.
const CRISIS = ["kill myself", "suicide", "suicidal", "end my life", "want to die", "self harm", "hurt myself", "harm myself"];

function crisisLink(s: Signals): LaunchLink | null {
  if (!CRISIS.some((w) => s.normalized.includes(w))) return null;
  return {
    reasonId: "care",
    intent: "talk to someone right now",
    venue: "Resource",
    query: "988 Suicide & Crisis Lifeline",
    url: "https://988lifeline.org/",
    emoji: VENUE_EMOJI.Resource,
    note: "You deserve real support — 988 is a free, confidential lifeline (call or text 988 in the US).",
  };
}

interface Spec {
  intent: string;
  venue: Exclude<Venue, "Resource">;
  q: (subject: string | null, s: Signals) => string;
  note?: string;
}

const SPECS: Record<string, Spec> = {
  curiosity: { intent: "understand it", venue: "Wikipedia", q: (subj, s) => subj ?? s.normalized },
  teach: { intent: "explain it simply", venue: "YouTube", q: (subj, s) => `${subj ?? s.normalized} explained` },
  "settle-argument": { intent: "settle the fact", venue: "Google", q: (subj, s) => `${subj ?? s.normalized} fact check` },
  homework: { intent: "get a citable answer", venue: "Scholar", q: (subj, s) => subj ?? s.normalized },
  decision: { intent: "weigh it", venue: "Google", q: (subj, s) => `${subj ?? s.normalized} pros and cons` },
  reassurance: { intent: "hear from people like you", venue: "Reddit", q: (_s, s) => s.normalized },
  troubleshoot: { intent: "fix it", venue: "YouTube", q: (subj, s) => subj ?? s.normalized },
  "compare-buy": { intent: "compare the options", venue: "Google", q: (subj, s) => `best ${subj ?? s.normalized} review` },
  "urgent-plan": { intent: "get quick ideas", venue: "Google", q: (subj, s) => `${subj ?? s.normalized} ideas` },
  "health-safety": { intent: "check it safely", venue: "Google", q: (subj, s) => `${subj ?? s.normalized} when to see a doctor`, note: "Lumify isn't a doctor — if it's urgent, contact a professional." },
  emotional: { intent: "hear from people who get it", venue: "Reddit", q: (_s, s) => s.normalized },
  skill: { intent: "start learning", venue: "YouTube", q: (subj, s) => (subj ? `learn ${subj} for beginners` : s.normalized) },
  escape: { intent: "find alternatives", venue: "Google", q: (subj, s) => (subj ? `alternatives to ${subj}` : s.normalized) },
  "practical-howto": { intent: "see the steps", venue: "YouTube", q: (_s, s) => s.normalized },
  "quick-answer": { intent: "just get the answer", venue: "Google", q: (_s, s) => s.normalized },
};

export function buildLaunchpad(a: Analysis): LaunchLink[] {
  const s = a.signals;
  const subject = subjectOf(s);
  const links: LaunchLink[] = [];
  const seen = new Set<string>();

  const crisis = crisisLink(s);
  if (crisis) links.push(crisis);

  for (const reason of a.reasons) {
    const spec = SPECS[reason.id];
    if (!spec) continue;
    const query = spec.q(subject, s).trim();
    const key = `${spec.venue}|${query.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    links.push({
      reasonId: reason.id,
      intent: spec.intent,
      venue: spec.venue,
      query,
      url: URL_FOR[spec.venue](query),
      emoji: VENUE_EMOJI[spec.venue],
      note: spec.note,
    });
  }

  return links.slice(0, 5);
}
