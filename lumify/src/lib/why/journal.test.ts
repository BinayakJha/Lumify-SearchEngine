import { describe, expect, it } from "vitest";
import { JournalEntry, summarize } from "./journal";

const NOW = 1_700_000_000_000;
const entry = (reasonId: string, label: string, agoDays = 0): JournalEntry => ({
  q: `q-${reasonId}`,
  ts: NOW - agoDays * 24 * 60 * 60 * 1000,
  reasonId,
  reasonLabel: label,
  emoji: "🔎",
  type: "why",
  emotions: [],
});

describe("summarize", () => {
  it("handles an empty journal", () => {
    const ins = summarize([], NOW);
    expect(ins.total).toBe(0);
    expect(ins.headline).toBe("");
    expect(ins.topReasons).toEqual([]);
  });

  it("counts reasons and ranks the top ones", () => {
    const ins = summarize(
      [
        entry("reassurance", "Looking for reassurance"),
        entry("reassurance", "Looking for reassurance"),
        entry("curiosity", "Plain curiosity"),
      ],
      NOW,
    );
    expect(ins.total).toBe(3);
    expect(ins.topReasons[0].id).toBe("reassurance");
    expect(ins.topReasons[0].count).toBe(2);
    expect(ins.headline).toContain("looking for reassurance");
  });

  it("counts only the last 7 days as 'this week'", () => {
    const ins = summarize([entry("curiosity", "Plain curiosity", 1), entry("curiosity", "Plain curiosity", 10)], NOW);
    expect(ins.total).toBe(2);
    expect(ins.thisWeek).toBe(1);
  });

  it("nudges when several decisions pile up unacted", () => {
    const ins = summarize([entry("decision", "Making a decision"), entry("decision", "Making a decision")], NOW);
    expect(ins.unactedDecisions).toBe(2);
    expect(ins.headline).toContain("time to make one");
  });
});
