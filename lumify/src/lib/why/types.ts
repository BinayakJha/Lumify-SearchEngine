// The Why Engine analyzes a *question* (not the web) and infers the likely
// reasons someone asked it. Everything here is plain data so the engine stays
// pure, deterministic, and unit-testable.

export type QuestionType =
  | "why"
  | "how"
  | "whatis"
  | "what"
  | "decision" // should I…, is it worth…
  | "yesno" // is/are/do/can…
  | "comparison" // X vs Y, which is better
  | "troubleshoot" // fix, broken, won't work
  | "other";

export type Emotion =
  | "anxiety"
  | "frustration"
  | "sadness"
  | "fear"
  | "excitement"
  | "guilt"
  | "loneliness"
  | "anger"
  | "curiosity";

export type Urgency = "none" | "soon" | "now";

export interface TopicGuess {
  /** Best-effort subject/action phrase pulled from the question. */
  text: string;
  confidence: number; // 0..1
}

export interface Signals {
  raw: string;
  normalized: string; // lowercased, de-punctuated, single-spaced
  tokens: string[];
  contentTokens: string[]; // stopwords removed
  questionType: QuestionType;
  isPersonal: boolean; // mentions I / my / me / we
  aboutOther: boolean; // mentions another person / relationship
  urgency: Urgency;
  urgencyMarker?: string;
  emotions: Emotion[];
  topic: TopicGuess;
  assumptions: string[]; // things the question takes for granted
}

export interface Reason {
  id: string;
  label: string;
  emoji: string;
  /** The "you might be asking because…" sentence, tailored to the query. */
  headline: string;
  deeperNeed: string;
  /** A sharper question tailored to this reason — the useful part. */
  reframe: string;
  confidence: number; // 0..1
  /** Which signals/algorithms produced this reason (the "show your work"). */
  evidence: string[];
}

export interface Analysis {
  query: string;
  signals: Signals;
  reasons: Reason[];
}
