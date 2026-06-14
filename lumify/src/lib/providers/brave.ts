import { SearchProvider, SearchResult, faviconFor } from "./types";

// Brave Search API — real web results as JSON, with a free tier
// (~2,000 queries/month). Set BRAVE_API_KEY to use it. This is the
// highest-quality backend and the recommended one for a deployed Lumify.
interface BraveResult {
  title?: string;
  url?: string;
  description?: string;
  age?: string;
  page_age?: string;
}

export function makeBraveProvider(apiKey: string): SearchProvider {
  return {
    name: "brave",
    async search(query: string, opts): Promise<SearchResult[]> {
      const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(
        query,
      )}&count=${opts?.count ?? 20}`;
      const res = await fetch(url, {
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip",
          "X-Subscription-Token": apiKey,
        },
        next: { revalidate: 60 },
      });
      if (!res.ok) {
        throw new Error(`Brave API responded ${res.status}`);
      }
      const data = (await res.json()) as { web?: { results?: BraveResult[] } };
      const results = data.web?.results ?? [];
      return results
        .filter((r) => r.url && r.title)
        .map((r) => ({
          title: r.title!,
          url: r.url!,
          snippet: r.description ?? "",
          publishedDate: r.page_age ?? undefined,
          age: r.age ?? (r.page_age ? String(new Date(r.page_age).getFullYear()) : undefined),
          favicon: faviconFor(r.url!),
        }));
    },
  };
}
