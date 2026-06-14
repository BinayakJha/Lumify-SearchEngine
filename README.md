<div align="center">

# 🔎 Lumify

### The search engine that asks *why you asked.*

Type a question. Instead of answers, Lumify infers the **reasons you might be asking it**, the **deeper need** behind each, and a **sharper question to ask instead** — then aims you at the right place to look.

**100% on your device. No API · no tracking · works offline.**

<img src="docs/demo.gif" alt="Lumify demo — ask a question and see the reasons you might be asking it" width="760">

<sub>A real recording of the app: ask a question → the search bar glides up → skeletons load → the reasons, launchpad, and anatomy panel appear.</sub>

</div>

---

## Why Lumify?

Every other search engine assumes the words *are* the need. Often they aren't — the same question hides a kid who needs an ELI5, a student with a deadline, and someone settling an argument:

> **"why is the sky blue"** → 🤓 plain curiosity · 🧒 explaining it to a kid · 😤 settling an argument · 📝 homework
> *…and it notices your question quietly assumes "the sky is blue."*

> **"should I text him back"** → 🧭 making a decision · 💔 processing a feeling · 😌 looking for reassurance
> *Ask instead: "A year from now, which would I regret more — going through with it, or not?"*

Lumify surfaces that gap instead of papering over it. It's a **mirror, not a know-it-all.**

## What it does

- 🧠 **Infers the reasons** behind any question and ranks them by confidence.
- 🪜 **Names the deeper need** under each reason, and offers a **sharper reframe** (click it to re-analyze).
- 🔬 **Shows its work** — an "anatomy" panel with everything the local algorithms read: question type, tone, urgency, perspective, and hidden assumptions.
- 🧭 **Decision helper** — for "should I" questions: the hidden trade-off, 10/10/10, the friend test, the trap to avoid.
- 🔎 **Launchpad** — Lumify doesn't answer; it *aims you*. Each reason gets a tailored query + one-click deep link (Google, YouTube, Reddit, Wikipedia, Scholar).
- 📓 **Question journal** — a local-only mirror of what you ask over time ("3 reassurance questions about your career this week"). Never leaves your device.
- 🆘 **Care mode** — if a question signals crisis, it surfaces a real lifeline, not a web search.

## How it works

No model, no network — just classic NLP and a hand-built intent model running locally:

```
question ──▶ signal extractors ──▶ score ~16 "asker motivations" ──▶ ranked reasons
             • question-type classifier      (each scores itself           + deeper need
             • emotion & urgency lexicons      against the signals,         + sharper reframe
             • perspective detector            fuzzy-matched to             + launchpad link
             • presupposition extractor        example questions)           + evidence ("show your work")
             • topic extractor
```

The engine (`lumify/src/lib/why/`) is **pure, deterministic, and unit-tested** — the same `analyze()` runs on the server (for shareable `/why?q=…` permalinks) and in the browser (for the instant, animated search).

## Quick start

> Requires **Node 18.18+**.

```bash
git clone https://github.com/BinayakJha/Lumify-SearchEngine.git
cd Lumify-SearchEngine/lumify
npm install
npm run dev
```

Open **http://localhost:3000** — no keys, no config, fully local.

### Other commands

```bash
npm test         # unit tests for the engine, launchpad, and journal
npm run build    # production build  (stop the dev server first)
npm run typecheck
npm start        # serve the production build
```

## Tech stack

- **Next.js 15** (App Router) + **TypeScript** — pinned to 15 / Tailwind v3 for Node 18 compatibility.
- **Tailwind CSS v3** for styling; zero UI dependencies otherwise.
- **Vitest** for the engine tests.
- No backend, no database — your journal lives in `localStorage`, shareable state lives in the URL.

## Bonus: lens web-search (`/search`)

An earlier mode lives at **`/search`** — real web results you re-rank with shareable "lenses" (academic-only, no-slop, small-web, docs-only, pre-AI). It's optional and needs a provider (`BRAVE_API_KEY` or `SEARXNG_URL` in `lumify/.env.local`; see `.env.example`). Without one it serves built-in demo data. The Why Engine is the main event and needs none of that.

## Roadmap

- **Answerability meter** — is this even a question with an answer, or a decision/values/expert question?
- **"Who to ask, not what to search"** — route to the right human, not just the right site.
- Loaded-question check · deeper-not-wider autocomplete · shareable "Question DNA" cards.

## About

Lumify began as a 2023 search-engine experiment and was rebuilt from scratch in 2024 into the Why Engine. Made by [Binayak Jha](https://github.com/BinayakJha).
