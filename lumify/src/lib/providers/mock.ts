import { SearchProvider, SearchResult, faviconFor } from "./types";

// A deliberately diverse, query-agnostic result set. Commercial pages and
// content farms sit near the top (as they tend to on the real web), while the
// academic papers, docs, and indie blogs are scattered lower down — so the
// moment you switch lenses the re-ranking is dramatic and obvious. This is the
// dataset that makes Lumify demoable with zero API keys or network.
interface Fixture {
  domain: string;
  path: string;
  title: string; // {q} is replaced with the query
  snippet: string;
  year: number;
}

const FIXTURES: Fixture[] = [
  { domain: "reddit.com", path: "/r/answers/comments/abc", title: "What actually works for {q}? Honest answers : r/answers", snippet: "1.2k votes, 340 comments. Asked this exact thing about {q} and here's what people who actually tried it said...", year: 2024 },
  { domain: "pinterest.com", path: "/pin/8821", title: "27 {q} ideas you'll love | Pinterest", snippet: "Discover Pinterest's best ideas and inspiration for {q}. Get inspired and try out new things.", year: 2024 },
  { domain: "quora.com", path: "/What-is-{q}", title: "What is the best way to approach {q}? - Quora", snippet: "Answer (1 of 47): I've spent years on {q} and the honest answer is it depends. Let me explain with a story...", year: 2023 },
  { domain: "medium.com", path: "/@growthhacker/{q}-2024", title: "The Ultimate Guide to {q} in 2024 (10 min read)", snippet: "Member-only story. In this comprehensive guide we'll cover everything you need to know about {q}...", year: 2023 },
  { domain: "amazon.com", path: "/s?k={q}", title: "{q} - Amazon.com", snippet: "Shop a wide selection of {q}. Free shipping on orders over $25. Read reviews and compare prices.", year: 2024 },
  { domain: "w3schools.com", path: "/{q}/default.asp", title: "{q} Tutorial - W3Schools", snippet: "Well organized and easy to understand tutorial on {q} with lots of examples of how to use it.", year: 2021 },
  { domain: "geeksforgeeks.org", path: "/{q}", title: "{q} - GeeksforGeeks", snippet: "A Computer Science portal for geeks. It contains well written, well thought articles on {q}.", year: 2022 },
  { domain: "youtube.com", path: "/watch?v=dQw4", title: "{q} explained in 12 minutes - YouTube", snippet: "In this video we break down {q} from scratch. Subscribe and hit the bell for more!", year: 2024 },
  { domain: "en.wikipedia.org", path: "/wiki/{q}", title: "{q} - Wikipedia", snippet: "{q} is a topic studied across several disciplines. This article covers its history, methods, and reception.", year: 2024 },
  { domain: "nytimes.com", path: "/2023/{q}.html", title: "The Surprising Truth About {q} - The New York Times", snippet: "A deep investigation into {q} and why experts say the conventional wisdom may be wrong.", year: 2023 },
  { domain: "developer.mozilla.org", path: "/en-US/docs/{q}", title: "{q} - MDN Web Docs", snippet: "The definitive reference for {q}, including syntax, examples, browser compatibility, and specifications.", year: 2023 },
  { domain: "nature.com", path: "/articles/{q}", title: "A systematic review of {q} | Nature", snippet: "Here we present a meta-analysis of 142 studies on {q}, finding robust evidence across populations.", year: 2021 },
  { domain: "arxiv.org", path: "/abs/2019.0421", title: "{q}: A Survey (arXiv)", snippet: "We survey the literature on {q}, taxonomize approaches, and identify open problems for future work.", year: 2019 },
  { domain: "cs.stanford.edu", path: "/~research/{q}", title: "{q} — Stanford CS Research Group", snippet: "Our lab studies {q}. This page collects papers, datasets, and lecture notes from our seminar.", year: 2018 },
  { domain: "nih.gov", path: "/pmc/{q}", title: "{q} and human health: a clinical overview - PMC, NIH", snippet: "This review summarizes peer-reviewed clinical evidence regarding {q}, mechanisms, and outcomes.", year: 2020 },
  { domain: "react.dev", path: "/learn/{q}", title: "{q} – React", snippet: "Official React documentation explaining {q} with interactive examples and best practices.", year: 2024 },
  { domain: "simonwillison.net", path: "/2023/{q}", title: "Notes on {q}", snippet: "I spent the weekend digging into {q}. Here are my notes, some code I wrote, and what surprised me.", year: 2023 },
  { domain: "ratfactor.com", path: "/{q}", title: "{q}, a slow read", snippet: "A hand-built page about {q} on my personal site. No trackers, no ads, just one person's thoughts.", year: 2016 },
  { domain: "newsletter.substack.com", path: "/p/{q}", title: "Why everyone is talking about {q}", snippet: "This week's issue: a contrarian take on {q} and three links worth your time. Subscribe for more.", year: 2023 },
  { domain: "news.ycombinator.com", path: "/item?id=38211", title: "Ask HN: best resources for learning {q}?", snippet: "Discussion thread. Commenters share the books, papers, and projects that taught them {q}.", year: 2022 },
  { domain: "oldweb.example.org", path: "/~jsmith/{q}.html", title: "John's {q} page", snippet: "Last updated 2009. A personal homepage about {q} from the early web, still online after all these years.", year: 2009 },
  { domain: "gao.gov", path: "/products/{q}", title: "{q}: Report to Congressional Committees", snippet: "This U.S. Government Accountability Office report examines {q} and offers recommendations.", year: 2017 },
];

function buildResults(query: string): SearchResult[] {
  const q = query.trim() || "search";
  return FIXTURES.map((f) => {
    const url = `https://${f.domain}${f.path.replace(/\{q\}/g, encodeURIComponent(q))}`;
    return {
      title: f.title.replace(/\{q\}/g, q),
      url,
      snippet: f.snippet.replace(/\{q\}/g, q),
      publishedDate: `${f.year}-01-01`,
      age: String(f.year),
      favicon: faviconFor(url),
    };
  });
}

export const mockProvider: SearchProvider = {
  name: "mock",
  async search(query: string): Promise<SearchResult[]> {
    return buildResults(query);
  },
};
