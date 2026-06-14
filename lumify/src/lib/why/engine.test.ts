import { describe, expect, it } from "vitest";
import { analyze } from "./engine";
import {
  analyzeSignals,
  classifyQuestion,
  detectEmotions,
  detectUrgency,
  extractTopic,
} from "./signals";

const ids = (q: string) => analyze(q).reasons.map((r) => r.id);

describe("signal extractors", () => {
  it("classifies question types", () => {
    expect(classifyQuestion("why is the sky blue")).toBe("why");
    expect(classifyQuestion("should i quit my job")).toBe("decision");
    expect(classifyQuestion("how to fix wifi not working")).toBe("troubleshoot");
    expect(classifyQuestion("what is osmosis")).toBe("whatis");
    expect(classifyQuestion("iphone vs android")).toBe("comparison");
    expect(classifyQuestion("is a tomato a fruit")).toBe("yesno");
  });

  it("detects emotion, urgency, personal, and other-person signals", () => {
    expect(detectEmotions("i'm so stressed and worried")).toContain("anxiety");
    expect(detectUrgency("what should i cook tonight")).toEqual({ urgency: "now", marker: "tonight" });
    expect(detectUrgency("plan a trip for tomorrow")).toEqual({ urgency: "soon", marker: "tomorrow" });
    const s = analyzeSignals("why does he ignore me");
    expect(s.isPersonal).toBe(true);
    expect(s.aboutOther).toBe(true);
  });

  it("does not fire lexicon matches inside larger words", () => {
    // "die" must not match inside "diet"
    expect(detectEmotions("best foods for a healthy diet")).not.toContain("fear");
  });

  it("extracts a topic phrase", () => {
    expect(extractTopic("why is the sky blue").text).toBe("sky blue");
    expect(extractTopic("should i text him back").text).toBe("text him back");
  });

  it("surfaces presuppositions", () => {
    expect(analyzeSignals("why is everyone leaving twitter").assumptions.length).toBeGreaterThan(0);
    expect(analyzeSignals("how do i stop procrastinating").assumptions[0]).toContain("problem");
  });
});

describe("analyze — reason inference", () => {
  it("returns no reasons for an empty query", () => {
    expect(analyze("").reasons).toHaveLength(0);
    expect(analyze("   ").reasons).toHaveLength(0);
  });

  it("reads a factual 'why' as curiosity first, with teaching nearby", () => {
    const r = ids("why is the sky blue");
    expect(r[0]).toBe("curiosity");
    expect(r).toContain("teach");
  });

  it("reads 'should I…' as a decision", () => {
    expect(ids("should i quit my job")[0]).toBe("decision");
  });

  it("reads a relational 'should I' as decision + emotional", () => {
    const r = ids("should i text him back");
    expect(r).toContain("decision");
    expect(r).toContain("emotional");
  });

  it("reads broken-thing language as troubleshooting", () => {
    expect(ids("how to fix wifi not working")[0]).toBe("troubleshoot");
  });

  it("reads 'is it normal…' as reassurance", () => {
    expect(ids("is it normal to feel tired all the time")).toContain("reassurance");
  });

  it("reads shopping language as comparing options", () => {
    expect(ids("best laptop for students")).toContain("compare-buy");
  });

  it("reads 'how to delete…' as looking for a way out", () => {
    expect(ids("how to delete my instagram")).toContain("escape");
  });

  it("respects urgency", () => {
    expect(ids("what should i cook tonight")).toContain("urgent-plan");
  });

  it("always returns 1–4 reasons, each fully populated, for a real query", () => {
    for (const q of ["why do cats purr", "should i go to grad school", "how to fix a flat tire", "is 30 too old to learn to code"]) {
      const { reasons } = analyze(q);
      expect(reasons.length).toBeGreaterThanOrEqual(1);
      expect(reasons.length).toBeLessThanOrEqual(4);
      for (const r of reasons) {
        expect(r.headline.length).toBeGreaterThan(0);
        expect(r.deeperNeed.length).toBeGreaterThan(0);
        expect(r.reframe.length).toBeGreaterThan(0);
        expect(r.confidence).toBeGreaterThan(0);
        expect(r.confidence).toBeLessThanOrEqual(1);
      }
    }
  });

  it("is deterministic", () => {
    expect(analyze("why is the sky blue")).toEqual(analyze("why is the sky blue"));
  });
});
