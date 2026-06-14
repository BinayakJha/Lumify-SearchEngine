import { Signals } from "./types";
import { textIncludesAny } from "./signals";

// The universal reasons people ask *anything*. Instead of enumerating reasons
// per topic (impossible), we enumerate motivations and score each against the
// signals extracted from the query. This generalizes to any question, fully
// locally. Each motivation also carries `examples` used for fuzzy matching.

export interface Motivation {
  id: string;
  label: string;
  emoji: string;
  examples: string[];
  score(s: Signals): { score: number; evidence: string[] };
  phrase(s: Signals): string;
  deeperNeed(s: Signals): string;
  reframe(s: Signals): string;
}

// Phrasing helpers: fall back to "this" when we can't confidently name the topic
// (the UI always shows the user's real question above the reasons anyway).
const topic = (s: Signals): string => (s.topic.confidence >= 0.5 && s.topic.text ? s.topic.text : "this");
const action = (s: Signals): string => s.topic.text || "this";
const cue = (s: Signals, words: string[]) => textIncludesAny(s.normalized, words);

export const MOTIVATIONS: Motivation[] = [
  {
    id: "teach",
    label: "Explaining it to someone else",
    emoji: "🧒",
    examples: ["how do i explain gravity to my kid", "eli5 how does the internet work", "what is photosynthesis for a school project"],
    score(s) {
      const ev: string[] = [];
      let sc = 0;
      if (["why", "whatis", "what", "how"].includes(s.questionType) && !s.isPersonal && s.emotions.length === 0) {
        sc += 0.3;
        ev.push("a plain factual question");
      }
      const c = cue(s, ["explain", "eli5", "my kid", "my child", "my son", "my daughter", "for a", "to a child", "teach", "student", "class"]);
      if (c) { sc += 0.45; ev.push(`teaching cue: "${c}"`); }
      return { score: sc, evidence: ev };
    },
    phrase: (s) => `Someone may have put you on the spot — you want to explain ${topic(s)} clearly enough to teach it.`,
    deeperNeed: () => "You know it well enough to nod along, but not yet to say it out loud.",
    reframe: (s) => `Explain ${topic(s)} in one sentence a 10-year-old would understand.`,
  },
  {
    id: "curiosity",
    label: "Plain curiosity",
    emoji: "🤓",
    examples: ["why is the sky blue", "how do birds know where to fly", "why do we dream", "what is a black hole"],
    score(s) {
      const ev: string[] = [];
      let sc = 0;
      const otherEmotions = s.emotions.filter((e) => e !== "curiosity");
      if (["why", "whatis", "what", "how"].includes(s.questionType) && !s.isPersonal && s.urgency === "none" && otherEmotions.length === 0) {
        sc += 0.4;
        ev.push("open, low-stakes question");
      }
      if (cue(s, ["wonder", "curious", "fascinating", "til", "huh"])) { sc += 0.18; ev.push("curiosity language"); }
      return { score: sc, evidence: ev };
    },
    phrase: (s) => `You might just want to know — ${topic(s)} caught your attention and now the question won't let go.`,
    deeperNeed: () => "You're chasing the small, satisfying click of “oh, that's why.”",
    reframe: (s) => `What's the most surprising true thing about ${topic(s)}?`,
  },
  {
    id: "settle-argument",
    label: "Settling an argument",
    emoji: "😤",
    examples: ["is it true goldfish have a 3 second memory", "does cracking knuckles cause arthritis", "is a tomato a fruit"],
    score(s) {
      const ev: string[] = [];
      let sc = 0;
      const c = cue(s, ["actually", "really", "is it true", "true that", "prove", "myth", "everyone says", "people say", "right or wrong"]);
      if (c) { sc += 0.5; ev.push(`fact-check cue: "${c}"`); }
      if (["yesno", "whatis", "why", "what"].includes(s.questionType)) { sc += 0.14; ev.push("a checkable claim"); }
      return { score: sc, evidence: ev };
    },
    phrase: (s) => `You could be settling a disagreement about ${topic(s)} — you want to be right, with receipts.`,
    deeperNeed: () => "It's less about the fact than about not losing the argument.",
    reframe: (s) => `What's the single most authoritative source on ${topic(s)}?`,
  },
  {
    id: "homework",
    label: "Homework or a work task",
    emoji: "📝",
    examples: ["what are the causes of world war 1", "define osmosis", "what is the formula for compound interest"],
    score(s) {
      const ev: string[] = [];
      let sc = 0;
      const c = cue(s, ["essay", "assignment", "homework", "exam", "study", "quiz", "report", "define", "definition", "formula", "causes of", "summary of", "citation", "examples of"]);
      if (c) { sc += 0.5; ev.push(`assignment cue: "${c}"`); }
      if (s.questionType === "whatis") { sc += 0.2; ev.push("a definition question"); }
      else if (["why", "what"].includes(s.questionType) && !s.isPersonal) { sc += 0.13; ev.push("could be coursework"); }
      return { score: sc, evidence: ev };
    },
    phrase: (s) => `This reads like it's for school or work — you need ${topic(s)} explained well enough to put in writing.`,
    deeperNeed: () => "You need something correct and citable, not just a vibe.",
    reframe: (s) => `Give a textbook-accurate definition of ${topic(s)} with one clear example.`,
  },
  {
    id: "decision",
    label: "Making a decision",
    emoji: "🧭",
    examples: ["should i quit my job", "is it worth buying a house now", "should i go to grad school"],
    score(s) {
      const ev: string[] = [];
      let sc = 0;
      if (s.questionType === "decision") { sc += 0.55; ev.push("a “should I” decision"); }
      if (s.isPersonal) sc += 0.1;
      return { score: sc, evidence: ev };
    },
    phrase: (s) => `You're weighing a decision — whether to ${action(s)}.`,
    deeperNeed: () => "You may not want the answer so much as permission to trust the choice you're already leaning toward.",
    reframe: () => "A year from now, which would I regret more — going through with it, or not?",
  },
  {
    id: "reassurance",
    label: "Looking for reassurance",
    emoji: "😌",
    examples: ["is it normal to feel tired all the time", "am i too old to learn to code", "is it ok to not have friends"],
    score(s) {
      const ev: string[] = [];
      let sc = 0;
      const c = cue(s, ["is it normal", "am i normal", "is it ok", "is it okay", "am i the only", "too old", "too late", "too young", "is it bad that"]);
      if (c) { sc += 0.5; ev.push(`reassurance cue: "${c}"`); }
      if (s.isPersonal && (s.emotions.includes("anxiety") || s.emotions.includes("fear"))) { sc += 0.25; ev.push("personal + anxious tone"); }
      if (s.questionType === "decision" && s.isPersonal) { sc += 0.2; ev.push("a personal “should I”"); }
      return { score: sc, evidence: ev };
    },
    phrase: (s) => `Part of this might be wanting to hear that you're okay — that ${topic(s)} is normal and you're not behind.`,
    deeperNeed: () => "You're checking whether you're allowed to feel fine about this.",
    reframe: (s) => `What's actually true for most people in my situation with ${topic(s)}?`,
  },
  {
    id: "troubleshoot",
    label: "Fixing something broken",
    emoji: "🔧",
    examples: ["why won't my car start", "how to fix wifi not working", "laptop won't turn on"],
    score(s) {
      const ev: string[] = [];
      let sc = 0;
      if (s.questionType === "troubleshoot") { sc += 0.6; ev.push("something is broken"); }
      if (s.emotions.includes("frustration")) { sc += 0.15; ev.push("frustrated tone"); }
      return { score: sc, evidence: ev };
    },
    phrase: () => "Something isn't working and you want it fixed — now, not the theory of why.",
    deeperNeed: () => "You don't care why it broke; you want it working again.",
    reframe: () => "What's the most likely cause, and the first thing to try?",
  },
  {
    id: "compare-buy",
    label: "Comparing options",
    emoji: "🛒",
    examples: ["iphone vs android", "best laptop for students", "macbook air or pro"],
    score(s) {
      const ev: string[] = [];
      let sc = 0;
      if (s.questionType === "comparison") { sc += 0.5; ev.push("comparing options"); }
      const c = cue(s, ["best", "cheapest", "worth buying", "worth it", "recommend", "should i buy", "alternative to"]);
      if (c) { sc += 0.28; ev.push(`buying cue: "${c}"`); }
      return { score: sc, evidence: ev };
    },
    phrase: (s) => `You're comparing options around ${topic(s)} and want the one that's actually worth it.`,
    deeperNeed: () => "You're trying to avoid buyer's remorse.",
    reframe: () => "Which option wins for someone who cares most about ___ — price? quality? simplicity?",
  },
  {
    id: "urgent-plan",
    label: "Time-sensitive planning",
    emoji: "⏰",
    examples: ["what to cook tonight with no groceries", "things to do in paris tomorrow"],
    score(s) {
      const ev: string[] = [];
      let sc = 0;
      if (s.urgency === "now") { sc += 0.55; ev.push(`time pressure: "${s.urgencyMarker}"`); }
      else if (s.urgency === "soon") { sc += 0.3; ev.push(`a deadline: "${s.urgencyMarker}"`); }
      return { score: sc, evidence: ev };
    },
    phrase: (s) => `There's a clock on this — you're racing a "${s.urgencyMarker ?? "soon"}" deadline.`,
    deeperNeed: () => "You need a good-enough answer fast, not the perfect one.",
    reframe: () => "What's the one thing I must decide in the next hour?",
  },
  {
    id: "health-safety",
    label: "Worry about health or safety",
    emoji: "🩺",
    examples: ["is it safe to take ibuprofen with coffee", "how much caffeine is dangerous", "is this mole normal"],
    score(s) {
      const ev: string[] = [];
      let sc = 0;
      const c = cue(s, ["safe", "dangerous", "side effect", "side effects", "overdose", "symptom", "symptoms", "pain", "harmful", "poison", "allergic", "infection", "fever", "is it bad for"]);
      if (c) { sc += 0.55; ev.push(`health/safety cue: "${c}"`); }
      if (s.emotions.includes("fear")) sc += 0.12;
      return { score: sc, evidence: ev };
    },
    phrase: (s) => `You may be worried whether ${topic(s)} is safe — and underneath, whether you should be concerned.`,
    deeperNeed: () => "You want to know if this is a “wait and see” or a “get help now.”",
    reframe: (s) => `What are the warning signs with ${topic(s)} that mean I should talk to a professional?`,
  },
  {
    id: "emotional",
    label: "Processing a feeling",
    emoji: "💔",
    examples: ["why does he ignore me", "how to get over a breakup", "why do i feel so empty"],
    score(s) {
      const ev: string[] = [];
      let sc = 0;
      const strong = s.emotions.filter((e) => ["sadness", "loneliness", "anxiety", "anger", "guilt"].includes(e));
      if (s.aboutOther && strong.length) { sc += 0.5; ev.push("about someone + strong feeling"); }
      else if (s.isPersonal && strong.length) { sc += 0.4; ev.push(`emotional tone: ${strong[0]}`); }
      else if (s.aboutOther && s.isPersonal) { sc += 0.32; ev.push("a personal, relational question"); }
      else if (strong.length) sc += 0.2;
      return { score: sc, evidence: ev };
    },
    phrase: (s) => `This might not really be a search — you could be working through how you feel about ${topic(s)}.`,
    deeperNeed: () => "You want to be understood more than you want an answer.",
    reframe: (s) => `Setting aside what I “should” do — what do I actually want to happen with ${topic(s)}?`,
  },
  {
    id: "skill",
    label: "Getting good at something",
    emoji: "📚",
    examples: ["how to get better at chess", "how to learn guitar fast", "tips for public speaking"],
    score(s) {
      const ev: string[] = [];
      let sc = 0;
      const c = cue(s, ["get better at", "get good at", "learn", "improve", "practice", "tips for", "master", "beginner", "from scratch"]);
      if (c) { sc += 0.5; ev.push(`learning cue: "${c}"`); }
      if (s.questionType === "how") sc += 0.08;
      return { score: sc, evidence: ev };
    },
    phrase: (s) => `You want to get good at ${topic(s)}, not just understand it once.`,
    deeperNeed: () => "You want a path and a first step — not a fact.",
    reframe: (s) => `What's the 20% of ${topic(s)} that gets me 80% of the way?`,
  },
  {
    id: "escape",
    label: "Looking for a way out",
    emoji: "🚪",
    examples: ["how to delete my instagram", "how to quit caffeine", "alternatives to google"],
    score(s) {
      const ev: string[] = [];
      let sc = 0;
      const c = cue(s, ["delete", "deactivate", "quit", "cancel", "unsubscribe", "get rid of", "leave", "replace", "alternative to", "alternatives to", "stop using", "without"]);
      if (c) { sc += 0.5; ev.push(`exit cue: "${c}"`); }
      return { score: sc, evidence: ev };
    },
    phrase: () => "You're not really asking how — you want a way out, or a better alternative.",
    deeperNeed: () => "Something about the current setup isn't working, and you want options.",
    reframe: () => "What are the alternatives, and what would I give up with each?",
  },
  {
    id: "practical-howto",
    label: "Getting a task done",
    emoji: "🛠️",
    examples: ["how to boil an egg", "how to tie a tie", "how to set up a tent"],
    score(s) {
      const ev: string[] = [];
      let sc = 0;
      if (s.questionType === "how" && !cue(s, ["learn", "get better", "improve", "fix", "won't", "delete", "quit", "explain"])) {
        sc += 0.4;
        ev.push("a practical “how-to” task");
      }
      return { score: sc, evidence: ev };
    },
    phrase: (s) => `You have a task to do and want the steps for ${topic(s)} — not the theory.`,
    deeperNeed: () => "You want to get it right the first time.",
    reframe: (s) => `What are the exact steps to ${action(s)}, start to finish?`,
  },
  {
    id: "quick-answer",
    label: "Just want a straight answer",
    emoji: "⚡",
    examples: ["what time is it in tokyo", "how many ounces in a cup", "capital of australia"],
    score(s) {
      // Stays out of the way of emotional, relational, and decision questions —
      // "just want the answer" would feel tone-deaf there.
      const blocked =
        s.questionType === "decision" ||
        s.aboutOther ||
        s.emotions.some((e) => ["sadness", "loneliness", "anger", "guilt", "fear", "anxiety"].includes(e));
      if (blocked) return { score: 0, evidence: [] };
      return { score: 0.13 + (s.questionType === "yesno" ? 0.05 : 0), evidence: ["a direct question"] };
    },
    phrase: (s) => `Maybe you just want a quick, reliable answer about ${topic(s)} — no rabbit hole.`,
    deeperNeed: () => "You want to resolve it and move on.",
    reframe: (s) => `What's the shortest accurate answer to "${s.normalized}"?`,
  },
  {
    id: "testing",
    label: "Kicking the tires",
    emoji: "🧪",
    examples: ["test", "hello", "what can you do", "are you there"],
    score(s) {
      const ev: string[] = [];
      let sc = 0;
      if (s.contentTokens.length <= 1 || cue(s, ["test", "hello", "hi", "you there", "what can you do"])) {
        sc += 0.25;
        ev.push("looks like a test run");
      }
      return { score: sc, evidence: ev };
    },
    phrase: () => "You might just be kicking the tires — seeing what this thing does.",
    deeperNeed: () => "Fair enough. Try a question you actually wonder about.",
    reframe: () => `Ask something you'd genuinely Google — like "why do cats purr" or "should I quit my job".`,
  },
];
