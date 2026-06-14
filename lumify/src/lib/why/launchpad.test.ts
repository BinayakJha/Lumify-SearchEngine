import { describe, expect, it } from "vitest";
import { analyze } from "./engine";
import { buildLaunchpad } from "./launchpad";

describe("buildLaunchpad", () => {
  it("tailors a crisp query when the subject is clear", () => {
    const links = buildLaunchpad(analyze("best laptop for students"));
    const compare = links.find((l) => l.reasonId === "compare-buy");
    expect(compare).toBeDefined();
    expect(compare!.venue).toBe("Google");
    expect(compare!.query).toBe("best laptop for students review");
    expect(compare!.url).toContain("https://www.google.com/search?q=");
  });

  it("routes curiosity to Wikipedia", () => {
    const links = buildLaunchpad(analyze("why is the sky blue"));
    expect(links.some((l) => l.venue === "Wikipedia")).toBe(true);
  });

  it("every link has a well-formed https url", () => {
    for (const l of buildLaunchpad(analyze("how to fix wifi not working"))) {
      expect(l.url).toMatch(/^https:\/\//);
    }
  });

  it("de-duplicates identical venue+query (reassurance vs emotional → one Reddit link)", () => {
    const links = buildLaunchpad(analyze("why does he ignore me"));
    const reddit = links.filter((l) => l.venue === "Reddit");
    expect(reddit.length).toBeLessThanOrEqual(1);
  });

  it("care mode: a crisis query surfaces a lifeline first", () => {
    const links = buildLaunchpad(analyze("i want to kill myself"));
    expect(links[0].venue).toBe("Resource");
    expect(links[0].url).toContain("988");
  });

  it("returns at most 5 links", () => {
    expect(buildLaunchpad(analyze("why is the sky blue")).length).toBeLessThanOrEqual(5);
  });
});
