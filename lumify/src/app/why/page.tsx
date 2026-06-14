import Link from "next/link";
import { redirect } from "next/navigation";
import { analyze } from "@/lib/why/engine";
import { WhyInput } from "@/components/why/WhyInput";
import { CopyLink } from "@/components/why/CopyLink";
import { JournalRecorder } from "@/components/why/JournalRecorder";
import { WhyResults } from "@/components/why/WhyResults";

// SSR permalink for a question — shareable and refresh-safe. The animated
// version lives on the home page; this is the canonical, no-JS-needed view.
export default async function WhyPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; ref?: string }>;
}) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  if (!q) redirect("/");

  const analysis = analyze(q);

  return (
    <div className="min-h-screen">
      <JournalRecorder analysis={analysis} enabled={sp.ref !== "1"} />
      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-zinc-50/80 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3">
          <Link href="/" className="shrink-0 text-lg font-bold tracking-tight">
            <span className="bg-gradient-to-r from-brand to-fuchsia-500 bg-clip-text text-transparent">
              Lumify
            </span>
          </Link>
          <div className="flex-1">
            <WhyInput initialQuery={q} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 pt-6 pb-24 md:pb-6">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wide text-zinc-400">You asked</p>
            <h1 className="truncate text-2xl font-semibold text-zinc-900">{q}</h1>
          </div>
          <CopyLink />
        </div>

        <WhyResults analysis={analysis} />
      </main>
    </div>
  );
}
