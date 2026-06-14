import { SearchProvider, SearchResult } from "./types";
import { mockProvider } from "./mock";
import { makeSearxngProvider } from "./searxng";
import { makeBraveProvider } from "./brave";

export type { SearchResult, SearchProvider } from "./types";

// Pick the best provider available from the environment. Priority:
// Brave (if key) → SearXNG (if URL) → Mock (always works, zero setup).
export function selectProvider(): SearchProvider {
  const braveKey = process.env.BRAVE_API_KEY?.trim();
  if (braveKey) return makeBraveProvider(braveKey);

  const searxngUrl = process.env.SEARXNG_URL?.trim();
  if (searxngUrl) return makeSearxngProvider(searxngUrl);

  return mockProvider;
}

export interface SearchOutcome {
  query: string;
  provider: string;
  /** True when the configured provider failed and we fell back to mock data. */
  degraded: boolean;
  results: SearchResult[];
}

// The single entry point used by both the search page and the /api/search
// route. It never throws: if the configured provider fails, it falls back to
// the mock provider so the page always renders something. This is the direct
// fix for the 2023 version, where one flaky upstream took the whole app down.
export async function runSearch(query: string): Promise<SearchOutcome> {
  const provider = selectProvider();
  if (!query.trim()) {
    return { query, provider: provider.name, degraded: false, results: [] };
  }
  try {
    const results = await provider.search(query);
    return { query, provider: provider.name, degraded: false, results };
  } catch (err) {
    if (provider.name === "mock") throw err; // mock can't fail; rethrow the unexpected
    console.error(`[lumify] provider "${provider.name}" failed, falling back to mock:`, err);
    const results = await mockProvider.search(query);
    return { query, provider: `${provider.name} → mock`, degraded: true, results };
  }
}
