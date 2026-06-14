import { describe, expect, it } from "vitest";
import { SearchResult } from "@/lib/providers/types";
import { applyLens, domainOf, matchDomain, yearOf } from "./engine";
import { builtinById, DEFAULT_LENS } from "./builtins";
import { Lens } from "./types";

const r = (url: string, year: number, title = "title", snippet = "snippet"): SearchResult => ({
  url,
  title,
  snippet,
  publishedDate: `${year}-01-01`,
  age: String(year),
});

const RESULTS: SearchResult[] = [
  r("https://www.pinterest.com/pin/1", 2024),
  r("https://arxiv.org/abs/1", 2019),
  r("https://cs.stanford.edu/x", 2018),
  r("https://www.reddit.com/r/x", 2024),
  r("https://simonwillison.net/x", 2016),
  r("https://w3schools.com/x", 2021),
];

const OPTS = { currentYear: 2026 };
const domains = (l: ReturnType<typeof applyLens>) => l.results.map((x) => x.domain);

describe("helpers", () => {
  it("domainOf strips www and lowercases", () => {
    expect(domainOf("https://WWW.Example.com/a")).toBe("example.com");
    expect(domainOf("not a url")).toBe("");
  });

  it("matchDomain matches by suffix, not substring", () => {
    expect(matchDomain("cs.stanford.edu", "edu")).toBe(true);
    expect(matchDomain("arxiv.org", "arxiv.org")).toBe(true);
    expect(matchDomain("notedu.com", "edu")).toBe(false);
    expect(matchDomain("myarxiv.org", "arxiv.org")).toBe(false);
  });

  it("yearOf reads publishedDate then falls back to age text", () => {
    expect(yearOf(r("https://a.com", 2017))).toBe(2017);
    expect(yearOf({ url: "https://a.com", title: "", snippet: "", age: "circa 2011" })).toBe(2011);
    expect(yearOf({ url: "https://a.com", title: "", snippet: "" })).toBeUndefined();
  });
});

describe("applyLens", () => {
  it("Default lens preserves provider order and adds no badges", () => {
    const out = applyLens(RESULTS, DEFAULT_LENS, OPTS);
    expect(domains(out)).toEqual([
      "pinterest.com", "arxiv.org", "cs.stanford.edu", "reddit.com",
      "simonwillison.net", "w3schools.com",
    ]);
    expect(out.results.every((x) => x.contributions.length === 0)).toBe(true);
    expect(out.hidden).toHaveLength(0);
  });

  it("Academic lens lifts scholarly domains above content farms", () => {
    const out = applyLens(RESULTS, builtinById("academic")!, OPTS);
    const top = domains(out).slice(0, 2);
    expect(top).toContain("arxiv.org");
    expect(top).toContain("cs.stanford.edu");
    // Pinterest started at the top; the lens should sink it below the academics.
    expect(domains(out).indexOf("pinterest.com")).toBeGreaterThan(
      domains(out).indexOf("arxiv.org"),
    );
  });

  it("block hard-filters a domain out of the visible results", () => {
    const lens: Lens = { id: "t", name: "t", description: "", rules: [{ type: "block", domains: ["pinterest.com"] }] };
    const out = applyLens(RESULTS, lens, OPTS);
    expect(domains(out)).not.toContain("pinterest.com");
    expect(out.hidden.map((x) => x.domain)).toEqual(["pinterest.com"]);
    expect(out.hidden[0].hiddenReason).toBe("blocked domain");
  });

  it("allowOnly hides everything outside the allow-list", () => {
    const lens: Lens = { id: "t", name: "t", description: "", rules: [{ type: "allowOnly", domains: ["edu"] }] };
    const out = applyLens(RESULTS, lens, OPTS);
    expect(domains(out)).toEqual(["cs.stanford.edu"]);
    expect(out.hidden).toHaveLength(5);
  });

  it("maxYear hides pages newer than the cutoff", () => {
    const lens: Lens = { id: "t", name: "t", description: "", rules: [{ type: "maxYear", year: 2020 }] };
    const out = applyLens(RESULTS, lens, OPTS);
    expect(out.results.every((x) => (x.year ?? 0) <= 2020)).toBe(true);
    expect(domains(out).sort()).toEqual(["arxiv.org", "cs.stanford.edu", "simonwillison.net"]);
  });

  it("Small Web lens lifts an indie blog above a big platform", () => {
    const out = applyLens(RESULTS, builtinById("small-web")!, OPTS);
    expect(domains(out).indexOf("simonwillison.net")).toBeLessThan(
      domains(out).indexOf("reddit.com"),
    );
  });

  it("records signed contributions for boosted and buried results", () => {
    const out = applyLens(RESULTS, builtinById("academic")!, OPTS);
    const stanford = out.results.find((x) => x.domain === "cs.stanford.edu")!;
    const pinterest = out.results.find((x) => x.domain === "pinterest.com")!;
    expect(stanford.contributions.some((c) => c.delta > 0)).toBe(true);
    expect(pinterest.contributions.some((c) => c.delta < 0)).toBe(true);
  });
});
