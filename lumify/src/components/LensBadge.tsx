import { Contribution } from "@/lib/lens/engine";

// The little green/red pills under each result that explain, in the open, why
// the lens moved it. This visible "show your work" is the whole pitch: ranking
// you can see, not an ad auction you can't.
export function LensBadge({ label, delta }: Contribution) {
  const boost = delta > 0;
  return (
    <span className={`badge ${boost ? "badge-boost" : "badge-bury"}`}>
      {boost ? "+" : "−"}
      {Math.abs(delta)} {label}
    </span>
  );
}
