import { SearchProvider, SearchResult, faviconFor } from "./types";

// Talks to a SearXNG instance over its JSON API. Point SEARXNG_URL at a
// self-hosted instance (recommended — public ones rate-limit and often
// disable JSON). No API key, no HTML scraping: this is the robust replacement
// for the brittle CSS-selector scraping the 2023 version relied on.
interface SearxngResult {
  title?: string;
  url?: string;
  content?: string;
  publishedDate?: string | null;
}

export function makeSearxngProvider(baseUrl: string): SearchProvider {
  const base = baseUrl.replace(/\/$/, "");
  return {
    name: "searxng",
    async search(query: string, opts): Promise<SearchResult[]> {
      const url = `${base}/search?q=${encodeURIComponent(query)}&format=json&categories=general&safesearch=0`;
      const res = await fetch(url, {
        headers: { Accept: "application/json", "User-Agent": "Lumify/1.0" },
        // Search results are fine to cache briefly.
        next: { revalidate: 60 },
      });
      if (!res.ok) {
        throw new Error(`SearXNG responded ${res.status}`);
      }
      const data = (await res.json()) as { results?: SearxngResult[] };
      const results = data.results ?? [];
      return results
        .filter((r) => r.url && r.title)
        .slice(0, opts?.count ?? 25)
        .map((r) => ({
          title: r.title!,
          url: r.url!,
          snippet: r.content ?? "",
          publishedDate: r.publishedDate ?? undefined,
          age: r.publishedDate?.match(/(19|20)\d{2}/)?.[0],
          favicon: faviconFor(r.url!),
        }));
    },
  };
}
