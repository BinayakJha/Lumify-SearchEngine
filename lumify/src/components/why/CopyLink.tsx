"use client";

import { useState } from "react";

export function CopyLink() {
  const [copied, setCopied] = useState(false);
  return (
    <button
      className="btn-ghost shrink-0"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* clipboard blocked — no-op */
        }
      }}
    >
      {copied ? "Copied!" : "Copy link"}
    </button>
  );
}
