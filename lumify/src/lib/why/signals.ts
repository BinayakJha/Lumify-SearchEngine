import { Emotion, QuestionType, Signals, TopicGuess, Urgency } from "./types";

// ── Lexicons ─────────────────────────────────────────────────────────────────
// Small, curated word lists. This is classic, transparent NLP — no model, no
// network. Every list is hand-tunable, which is the whole point.

const STOPWORDS = new Set(
  ("a an the and or but if of to in on at for with from by about into over after " +
    "is are am was were be been being do does did doing have has had having i you he " +
    "she it we they me my your his her our their this that these those there here as " +
    "so than too very just only really can could would should will shall may might " +
    "what why how when where who which whom whose not no yes get got").split(" "),
);

const EDGE_TRIM = new Set(
  ("the a an my your his her our their this that to of in on for is are be do i we you it " +
    "so really actually even still always").split(" "),
);

// Leading question-scaffolding stripped off the front to find the real subject:
// "what should i cook tonight" → "cook tonight". Only removed from the start,
// so mid-phrase words ("learn TO code") survive.
const LEAD_STRIP = new Set(
  ("why how what whats when where who which whose whom " +
    "is are am was were be been do does did done " +
    "can could would should shall will may might must " +
    "have has had to of come really actually even just so many much best top " +
    "i we you it he she they the a an").split(" "),
);

const PERSONAL = new Set([
  "i", "i'm", "im", "i've", "ive", "i'd", "id", "i'll", "my", "me", "mine", "myself", "we", "our", "ours",
]);

const OTHER_PEOPLE = new Set([
  "he", "she", "him", "her", "his", "hers", "they", "them", "their",
  "boyfriend", "girlfriend", "husband", "wife", "partner", "ex", "crush",
  "boss", "coworker", "friend", "mom", "dad", "parents", "kid", "child", "son", "daughter",
]);

const EMOTION_LEXICON: Record<Emotion, string[]> = {
  anxiety: ["worried", "worry", "nervous", "anxious", "scared", "afraid", "panic", "stress", "stressed", "overthinking", "what if", "freaking out"],
  frustration: ["stuck", "broken", "won't", "wont", "can't", "cant", "not working", "doesn't work", "error", "hate", "annoying", "ugh", "again", "still not"],
  sadness: ["sad", "miss", "lost", "hurt", "cry", "crying", "depressed", "empty", "heartbroken"],
  fear: ["dangerous", "die", "dying", "death", "risk", "risky", "unsafe", "harmful", "afraid", "terrified"],
  excitement: ["excited", "can't wait", "cant wait", "finally", "amazing", "awesome", "love", "thrilled"],
  guilt: ["my fault", "was i wrong", "should i have", "regret", "guilty", "sorry", "bad person"],
  loneliness: ["alone", "lonely", "nobody", "no one", "by myself", "isolated"],
  anger: ["angry", "mad", "furious", "unfair", "pissed", "rage"],
  curiosity: ["wonder", "curious", "fascinating", "interesting", "til", "huh"],
};

const URGENCY_NOW = ["right now", "asap", "immediately", "tonight", "today", "urgent", "emergency", "this second", "now"];
const URGENCY_SOON = ["tomorrow", "this week", "this weekend", "deadline", "due", "soon", "by friday", "by monday", "in an hour"];

// ── Helpers ──────────────────────────────────────────────────────────────────

export function normalize(raw: string): string {
  return raw.toLowerCase().replace(/[^a-z0-9'\s]/g, " ").replace(/\s+/g, " ").trim();
}

export function tokenize(normalized: string): string[] {
  return normalized.split(" ").filter(Boolean);
}

/** Stopword-filtered tokens for a raw string — used to fuzzy-match examples. */
export function contentTokensOf(text: string): string[] {
  return tokenize(normalize(text)).filter((t) => !STOPWORDS.has(t));
}

export function textIncludesAny(normalized: string, needles: string[]): string | undefined {
  // Match whole words/phrases so "die" doesn't fire inside "diet".
  for (const n of needles) {
    const re = new RegExp(`(^|\\s)${n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\s|$)`);
    if (re.test(normalized)) return n;
  }
  return undefined;
}

// ── Individual extractors ────────────────────────────────────────────────────

export function classifyQuestion(normalized: string): QuestionType {
  const t = normalized;
  if (textIncludesAny(t, ["fix", "broken", "won't", "wont", "not working", "doesn't work", "error", "stopped working", "crash", "stuck", "isn't working"]))
    return "troubleshoot";
  if (/^(should|shall|ought)\b/.test(t) || /\b(worth it|should i|is it worth|do i need to)\b/.test(t))
    return "decision";
  if (/\b(vs|versus)\b/.test(t) || /\b(better|best)\b.*\b(or|than)\b/.test(t) || /\bdifference between\b/.test(t))
    return "comparison";
  if (/^(what is|what are|what's|whats|define|meaning of)\b/.test(t)) return "whatis";
  if (/^why\b/.test(t)) return "why";
  if (/^(how)\b/.test(t)) return "how";
  if (/^(what|when|where|who|which)\b/.test(t)) return "what";
  if (/^(is|are|am|do|does|did|can|could|will|would|has|have|may|might)\b/.test(t)) return "yesno";
  return "other";
}

export function detectEmotions(normalized: string): Emotion[] {
  const found: Emotion[] = [];
  for (const emotion of Object.keys(EMOTION_LEXICON) as Emotion[]) {
    if (textIncludesAny(normalized, EMOTION_LEXICON[emotion])) found.push(emotion);
  }
  return found;
}

export function detectUrgency(normalized: string): { urgency: Urgency; marker?: string } {
  const now = textIncludesAny(normalized, URGENCY_NOW);
  if (now) return { urgency: "now", marker: now };
  const soon = textIncludesAny(normalized, URGENCY_SOON);
  if (soon) return { urgency: "soon", marker: soon };
  return { urgency: "none" };
}

export function extractTopic(normalized: string): TopicGuess {
  const words = normalized.split(" ").filter(Boolean);
  while (words.length && LEAD_STRIP.has(words[0])) words.shift();
  while (words.length && EDGE_TRIM.has(words[words.length - 1])) words.pop();
  const text = words.join(" ");
  const confidence = text.length === 0 ? 0 : words.length <= 5 ? 0.7 : 0.4;
  return { text, confidence };
}

export function extractAssumptions(normalized: string): string[] {
  const out: string[] = [];
  let m: RegExpMatchArray | null;
  if ((m = normalized.match(/^why (?:is|are|do|does) (.+?) so (.+)$/)))
    out.push(`that ${m[1]} really is ${m[2]}`);
  else if ((m = normalized.match(/^why (is|are) (the |a |an )?([a-z]+) ([a-z]+)$/)))
    out.push(`that ${m[2] ?? ""}${m[3]} ${m[1]} ${m[4]}`.replace(/\s+/g, " ").trim());
  if ((m = normalized.match(/^why (?:do|does) (.+?) always (.+)$/)))
    out.push(`that ${m[1]} always ${m[2]}`);
  if ((m = normalized.match(/\bhow (?:do i |to )(?:stop|fix|get rid of|avoid|prevent) (.+)$/)))
    out.push(`that ${m[1]} is a problem worth removing`);
  if ((m = normalized.match(/\bwhy can'?t i (.+)$/)))
    out.push(`that you can't ${m[1]} — yet`);
  if (/\b(too late|too old|too young)\b/.test(normalized))
    out.push("that there's a deadline you might have missed");
  if ((m = normalized.match(/\bwhy (?:is|does) everyone (.+)$/)))
    out.push(`that everyone really is ${m[1]}`);
  return out;
}

// ── Top-level ────────────────────────────────────────────────────────────────

export function analyzeSignals(raw: string): Signals {
  const normalized = normalize(raw);
  const tokens = tokenize(normalized);
  const contentTokens = tokens.filter((t) => !STOPWORDS.has(t));
  const { urgency, marker } = detectUrgency(normalized);

  return {
    raw,
    normalized,
    tokens,
    contentTokens,
    questionType: classifyQuestion(normalized),
    isPersonal: tokens.some((t) => PERSONAL.has(t)),
    aboutOther: tokens.some((t) => OTHER_PEOPLE.has(t)),
    urgency,
    urgencyMarker: marker,
    emotions: detectEmotions(normalized),
    topic: extractTopic(normalized),
    assumptions: extractAssumptions(normalized),
  };
}
