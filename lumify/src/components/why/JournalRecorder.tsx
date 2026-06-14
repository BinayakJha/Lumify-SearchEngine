"use client";

import { useEffect } from "react";
import { Analysis } from "@/lib/why/types";
import { recordAnalysis } from "@/lib/why/journal";

// Invisible: records the current question to the local journal on mount.
// Skipped for reframe navigations so the journal reflects *your* questions,
// not the engine's suggested rewordings.
export function JournalRecorder({ analysis, enabled }: { analysis: Analysis; enabled: boolean }) {
  useEffect(() => {
    if (enabled) recordAnalysis(analysis);
  }, [analysis, enabled]);
  return null;
}
