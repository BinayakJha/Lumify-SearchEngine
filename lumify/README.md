# Lumify — the search engine that asks *why you asked*

Type a question. Instead of fetching answers, Lumify infers the **reasons you
might be asking it**, shows the **deeper need** behind each, and hands you a
**sharper question to ask instead**. Then it shows its work: exactly which
signals it read out of your words.

It runs **entirely on your device** — classic NLP and a hand-built intent model.
No search API, no LLM, no model download, no tracking. Works offline.

> **"should I text him back"**
> 🧭 Making a decision — *you're weighing whether to text him back*
> 💔 Processing a feeling — *you may be working through how you feel*
> 😌 Looking for reassurance — *part of this is wanting to hear you're okay*
>
> *Ask instead:* "A year from now, which would I regret more — going through with it, or not?"

## Why it's different

Every other engine assumes the words *are* the need. Often they aren't: the same
question hides a kid who needs an ELI5, a student with a deadline, and someone
settling an argument. Lumify surfaces that gap instead of papering over it — a
mirror, not a know-it-all.

## How it works

Given a question, a battery of small, transparent algorithms run locally:

- **Question-type classifier** — why / how-to / decision / yes-no / comparison / troubleshooting…
- **Emotion & urgency lexicons** — tone and time-pressure
- **Perspective detector** — about you, about someone else, or general
- **Presupposition extractor** — what the question quietly assumes
- **Topic extractor** — the real subject under the scaffolding

Those signals score ~15 **universal "asker motivations"** (`src/lib/why/motivations.ts`),
each fuzzy-matched against example questions. The top reasons are shown with the
evidence that fired. The whole engine (`src/lib/why/engine.ts`) is **pure,
deterministic, and unit-tested** (`src/lib/why/engine.test.ts`).

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

No configuration, no keys — it's fully local.

```bash
npm test           # engine unit tests (Why Engine + lens engine)
npm run typecheck
npm run build
```

## Also included: lens web-search (`/search`)

An earlier mode lives at `/search`: real web results you re-rank with shareable
"lenses." It's optional and needs a provider (`BRAVE_API_KEY` or `SEARXNG_URL`
in `.env.local`, see `.env.example`); without one it serves built-in demo data.
The Why Engine is the main event and needs none of that.
