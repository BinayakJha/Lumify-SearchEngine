"use client";

import { useState } from "react";
import { Lens, Rule, RuleType, RULE_KINDS } from "@/lib/lens/types";

// A row in the editor keeps list fields as raw text (domainsText/keywordsText)
// so typing commas and spaces doesn't fight the cursor; we parse on save.
interface EditableRule {
  type: RuleType;
  domainsText?: string;
  keywordsText?: string;
  weight?: number;
  year?: number;
}

const parseList = (s: string): string[] =>
  s.split(/[\s,]+/).map((x) => x.trim()).filter(Boolean);

const clampWeight = (w: number | undefined): number =>
  Math.min(10, Math.max(1, Math.round(w ?? 4)));

function blankRule(type: RuleType): EditableRule {
  if (type === "maxYear" || type === "minYear") return { type, year: 2022 };
  if (type === "boostKeyword" || type === "buryKeyword")
    return { type, keywordsText: "", weight: 4 };
  if (type === "allowOnly" || type === "block") return { type, domainsText: "" };
  if (type === "boostDomain" || type === "buryDomain")
    return { type, domainsText: "", weight: 4 };
  return { type, weight: 4 }; // preferRecent / preferOlder / smallWeb
}

function ruleToEditable(rule: Rule): EditableRule {
  const e: EditableRule = { type: rule.type };
  if ("domains" in rule) e.domainsText = rule.domains.join(", ");
  if ("keywords" in rule) e.keywordsText = rule.keywords.join(", ");
  if ("weight" in rule) e.weight = rule.weight;
  if ("year" in rule) e.year = rule.year;
  return e;
}

function editableToRule(e: EditableRule): Rule {
  switch (e.type) {
    case "boostDomain":
    case "buryDomain":
      return { type: e.type, domains: parseList(e.domainsText ?? ""), weight: clampWeight(e.weight) };
    case "allowOnly":
    case "block":
      return { type: e.type, domains: parseList(e.domainsText ?? "") };
    case "boostKeyword":
    case "buryKeyword":
      return { type: e.type, keywords: parseList(e.keywordsText ?? ""), weight: clampWeight(e.weight) };
    case "preferRecent":
    case "preferOlder":
    case "smallWeb":
      return { type: e.type, weight: clampWeight(e.weight) };
    case "maxYear":
    case "minYear":
      return { type: e.type, year: e.year ?? 2022 };
  }
}

export function LensEditor({
  initial,
  onSave,
  onCancel,
}: {
  initial: Lens;
  onSave: (lens: Lens) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial.name);
  const [emoji, setEmoji] = useState(initial.emoji ?? "🔧");
  const [description, setDescription] = useState(initial.description);
  const [rules, setRules] = useState<EditableRule[]>(
    initial.rules.length ? initial.rules.map(ruleToEditable) : [blankRule("boostDomain")],
  );

  const patch = (i: number, p: Partial<EditableRule>) =>
    setRules((rs) => rs.map((r, idx) => (idx === i ? { ...r, ...p } : r)));
  const changeType = (i: number, type: RuleType) =>
    setRules((rs) => rs.map((r, idx) => (idx === i ? blankRule(type) : r)));
  const removeRule = (i: number) => setRules((rs) => rs.filter((_, idx) => idx !== i));
  const addRule = () => setRules((rs) => [...rs, blankRule("boostDomain")]);

  const save = () =>
    onSave({
      ...initial,
      name: name.trim() || "Untitled lens",
      emoji: emoji.trim() || "🔧",
      description: description.trim(),
      builtin: false,
      rules: rules.map(editableToRule),
    });

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4"
      onClick={onCancel}
    >
      <div
        className="my-8 w-full max-w-lg rounded-2xl bg-white shadow-pop"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-3">
          <h2 className="font-semibold">{initial.builtin ? "Fork lens" : "Edit lens"}</h2>
          <button className="btn-ghost px-2 py-1" onClick={onCancel} aria-label="Close">✕</button>
        </div>

        <div className="space-y-4 px-5 py-4">
          <div className="flex gap-2">
            <input
              className="field w-16 text-center text-lg"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              aria-label="Emoji"
              maxLength={2}
            />
            <input
              className="field flex-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Lens name"
              aria-label="Lens name"
            />
          </div>
          <input
            className="field"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What does this lens do?"
            aria-label="Lens description"
          />

          <div className="space-y-2">
            <div className="text-xs font-medium uppercase tracking-wide text-zinc-400">Rules</div>
            {rules.map((rule, i) => {
              const kind = RULE_KINDS.find((k) => k.type === rule.type)!;
              return (
                <div key={i} className="rounded-lg border border-zinc-200 p-2.5">
                  <div className="flex items-center gap-2">
                    <select
                      className="field flex-1 py-1.5"
                      value={rule.type}
                      onChange={(e) => changeType(i, e.target.value as RuleType)}
                    >
                      {RULE_KINDS.map((k) => (
                        <option key={k.type} value={k.type}>{k.label}</option>
                      ))}
                    </select>
                    <button
                      className="btn-ghost px-2 py-1 text-zinc-400 hover:text-rose-600"
                      onClick={() => removeRule(i)}
                      aria-label="Remove rule"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="mt-1 px-0.5 text-xs text-zinc-400">{kind.help}</p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {kind.fields.includes("domains") && (
                      <textarea
                        className="field min-h-[2.4rem] flex-1 font-mono text-xs"
                        value={rule.domainsText ?? ""}
                        onChange={(e) => patch(i, { domainsText: e.target.value })}
                        placeholder="arxiv.org, .edu, nature.com"
                        rows={2}
                      />
                    )}
                    {kind.fields.includes("keywords") && (
                      <textarea
                        className="field min-h-[2.4rem] flex-1 text-xs"
                        value={rule.keywordsText ?? ""}
                        onChange={(e) => patch(i, { keywordsText: e.target.value })}
                        placeholder="recipe, sponsored, review"
                        rows={2}
                      />
                    )}
                    {kind.fields.includes("weight") && (
                      <label className="flex items-center gap-1.5 text-xs text-zinc-500">
                        strength
                        <input
                          type="number"
                          min={1}
                          max={10}
                          className="field w-16 py-1.5"
                          value={rule.weight ?? 4}
                          onChange={(e) => patch(i, { weight: Number(e.target.value) })}
                        />
                      </label>
                    )}
                    {kind.fields.includes("year") && (
                      <label className="flex items-center gap-1.5 text-xs text-zinc-500">
                        year
                        <input
                          type="number"
                          className="field w-24 py-1.5"
                          value={rule.year ?? 2022}
                          onChange={(e) => patch(i, { year: Number(e.target.value) })}
                        />
                      </label>
                    )}
                  </div>
                </div>
              );
            })}
            <button className="btn-ghost w-full border border-dashed border-zinc-300" onClick={addRule}>
              + Add rule
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-zinc-200 px-5 py-3">
          <button className="btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="btn-primary" onClick={save}>Save lens</button>
        </div>
      </div>
    </div>
  );
}
