// A single normalized search result. Every provider maps its native shape
// into this so the rest of the app never cares where results came from.
export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  /** ISO date string if the provider gave us one. */
  publishedDate?: string;
  /** Human label for age, e.g. "2021" or "3 days ago". */
  age?: string;
  /** Favicon URL (we fall back to Google's favicon service). */
  favicon?: string;
}

export interface SearchProvider {
  /** Stable identifier shown in the UI, e.g. "mock", "searxng", "brave". */
  name: string;
  search(query: string, opts?: { count?: number }): Promise<SearchResult[]>;
}

export function faviconFor(url: string): string {
  try {
    const host = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?sz=64&domain=${host}`;
  } catch {
    return "";
  }
}
