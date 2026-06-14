"use client";

import { Lens } from "@/lib/lens/types";

export function LensPicker({
  lenses,
  selectedId,
  onSelect,
  onNew,
}: {
  lenses: Lens[];
  selectedId: string;
  onSelect: (lens: Lens) => void;
  onNew: () => void;
}) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      {lenses.map((lens) => (
        <button
          key={lens.id}
          type="button"
          className="chip"
          data-active={lens.id === selectedId}
          onClick={() => onSelect(lens)}
          title={lens.description}
        >
          {lens.emoji && <span aria-hidden>{lens.emoji}</span>}
          <span>{lens.name}</span>
          {!lens.builtin && <span className="text-zinc-400">·</span>}
        </button>
      ))}
      <button
        type="button"
        className="chip shrink-0 border-dashed text-zinc-500"
        onClick={onNew}
      >
        + New lens
      </button>
    </div>
  );
}
