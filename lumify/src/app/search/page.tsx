import { redirect } from "next/navigation";
import { runSearch } from "@/lib/providers";
import { builtinById, DEFAULT_LENS } from "@/lib/lens/builtins";
import { decodeLens } from "@/lib/lens/encode";
import { SearchExperience } from "@/components/SearchExperience";

// Server component: fetches raw results once (keeping any API key server-side),
// resolves the initial lens from the URL, then hands off to the client
// experience where lens-switching re-ranks instantly without refetching.
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; lens?: string; lensdata?: string }>;
}) {
  const sp = await searchParams;
  const query = (sp.q ?? "").trim();
  if (!query) redirect("/");

  const initialLens =
    decodeLens(sp.lensdata ?? "") ?? builtinById(sp.lens) ?? DEFAULT_LENS;

  const { provider, degraded, results } = await runSearch(query);

  return (
    <SearchExperience
      query={query}
      providerName={provider}
      degraded={degraded}
      rawResults={results}
      initialLens={initialLens}
    />
  );
}
