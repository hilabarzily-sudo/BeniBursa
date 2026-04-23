# BeniBursa — Social Content Engine

**אוטונומי. מקבל חומר גולמי, מחזיר 30+ פיסות תוכן מוכנות לפרסום.**

מערכת שמפעילה pipeline אמיתי של ניתוח, תכנון וייצור תוכן לפלטפורמות חברתיות — לא רק חיתוכים, אלא פוסטים מובחנים לפי הדקדוק של כל פלטפורמה (Hook, פורמט, יחס, אורך, קיפלים, מוזיקה, קופי, hashtags).

---

## Architecture

```
┌──────────────┐        ┌──────────────────┐        ┌───────────────┐
│  Next.js 15  │        │     Inngest      │        │  Python       │
│  (apps/web)  ├───────▶│   orchestrator   ├───────▶│  worker-py    │
│              │        │                  │        │  (FastAPI)    │
│  UI + API    │◀───────│  analyze →       │◀───────│  FFmpeg,      │
│              │        │  strategize →    │        │  Whisper,     │
│              │        │  generate        │        │  SceneDetect  │
└──────┬───────┘        └────────┬─────────┘        └───────┬───────┘
       │                         │                          │
       ▼                         ▼                          ▼
   ┌────────────────────────────────────────────────────────────┐
   │  Supabase (Postgres + pgvector + Auth + Storage buckets)   │
   └────────────────────────────────────────────────────────────┘
```

### Layers

1. **Ingestion** — Chunked upload via Supabase signed URLs, validation, asset records.
2. **Analysis** — Scene detection (PySceneDetect), transcription (Whisper), vision understanding (Claude Vision), color palette, keywords.
3. **Strategy** — Claude Sonnet 4.6 reads analyses + Platform Playbook → emits a `ContentPlan` (JSON-schema validated).
4. **Generation** — FFmpeg pipeline renders each piece: trim → reframe 9:16 → burn captions → thumbnail → upload.
5. **Delivery** — Preview gallery + download; Phase 2 adds direct publishing.

---

## Tech Stack

| Layer         | Stack                                                                 |
|---------------|-----------------------------------------------------------------------|
| Frontend      | Next.js 15 · React 19 · Tailwind v3 · shadcn/ui · TypeScript          |
| Orchestration | Inngest (durable workflows, fan-out/fan-in)                           |
| DB / Auth     | Supabase (Postgres 15 + pgvector + RLS + Auth + Storage)              |
| ML worker     | Python 3.11 · FastAPI · Whisper · PySceneDetect · FFmpeg · Claude API |
| AI            | Anthropic Claude (Sonnet 4.6 orchestrator, Haiku 4.5 vision)          |
| Hosting       | Vercel (web) + Modal or Fly.io (worker) — local-first for MVP         |

---

## Repo Layout

```
.
├── apps/
│   ├── web/              Next.js 15 app (UI + API routes + Inngest)
│   └── worker-py/        FastAPI ML pipeline
├── packages/
│   └── shared/           Shared TS types, Zod schemas, platform playbooks
├── supabase/
│   ├── config.toml       Supabase CLI config
│   └── migrations/       SQL migrations (schema, RLS, storage buckets)
└── scripts/              Utility scripts
```

---

## Prerequisites

| Tool            | Install                                                         |
|-----------------|-----------------------------------------------------------------|
| Node.js ≥ 20    | `nvm install 20`                                                |
| pnpm ≥ 9        | `npm install -g pnpm`                                           |
| Python ≥ 3.11   | `pyenv install 3.11.10`                                         |
| FFmpeg          | `apt install ffmpeg` / `brew install ffmpeg`                    |
| Supabase CLI    | `brew install supabase/tap/supabase`                            |

---

## Setup — Step by Step

### 1. Clone & install

```bash
git clone <repo>
cd benibursa
pnpm install
cp .env.example .env.local
cp apps/worker-py/.env.example apps/worker-py/.env
```

### 2. Set up Supabase

**Option A — Supabase Cloud (recommended)**

1. Create project at https://supabase.com/dashboard
2. Project Settings → API → copy `URL`, `anon key`, `service_role key` into `.env.local`
3. Link the local project and push migrations:

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

**Option B — Local Supabase**

```bash
supabase start
supabase db reset
```

Your local URLs / keys will be printed — drop them into `.env.local`.

### 3. Set up Anthropic

1. Sign up at https://console.anthropic.com
2. Billing → add payment (first $5 free)
3. API Keys → create key → paste into `.env.local` as `ANTHROPIC_API_KEY`

### 4. Install Python worker

```bash
cd apps/worker-py
python -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
```

### 5. Run the stack

Open **3 terminals**:

```bash
# Terminal 1 — Inngest dev server
pnpm inngest:dev

# Terminal 2 — Next.js
pnpm dev

# Terminal 3 — Python worker
pnpm worker:dev
```

Open http://localhost:3000.

---

## Environment Variables

See `.env.example` — required for MVP:

- `ANTHROPIC_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `WORKER_URL` (default: `http://localhost:8787`)
- `WORKER_SECRET` (must match between web and worker)

Optional (Phase 2): R2, Modal, Twelve Labs, Suno, Stripe.

---

## Pipeline Flow

```
User uploads video
       │
       ▼
POST /api/uploads/create         ── signed URL, asset row in DB
       │
       ▼
Client PUT to Supabase Storage   ── direct browser → storage
       │
       ▼
POST /api/uploads/{id}/complete  ── fires Inngest "asset/uploaded"
       │
       ▼
┌──────────────────── Inngest ────────────────────┐
│                                                 │
│  analyzeAsset                                   │
│     → call worker /analyze                      │
│     → scenes + transcript + vision + palette    │
│     → persist to analyses table                 │
│     → fire "asset/analyzed"                     │
│                                                 │
│  strategizeProject (waits for all assets)       │
│     → call Claude /messages with playbook       │
│     → validated ContentPlan → content_pieces    │
│     → fire "plan/generated"                     │
│                                                 │
│  fanoutPieceGeneration                          │
│     → send "piece/generation-requested" per piece│
│                                                 │
│  generatePiece (per piece, concurrency=3)       │
│     → call worker /generate                     │
│     → FFmpeg trim+reframe+captions              │
│     → upload to Supabase Storage                │
│     → update content_pieces.output_url          │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Roadmap

### Phase 1 — MVP (current)

- [x] Monorepo skeleton
- [x] Supabase schema + RLS + storage buckets
- [x] Upload UI with progress
- [x] Inngest orchestration (analyze → strategize → generate)
- [x] Instagram Reel generation (FFmpeg)
- [x] Platform playbook for Instagram

### Phase 2 — Production

- [ ] Authentication flow polish (magic link + OAuth)
- [ ] Carousel, Story, Feed Grid generation
- [ ] TikTok + Facebook playbooks
- [ ] Stripe billing with credits
- [ ] Direct publish via Meta/TikTok APIs
- [ ] Modal/RunPod for GPU worker scaling

### Phase 3 — Moat

- [ ] Brand voice learning (fine-tuned on user's historical content)
- [ ] Trend-aware planning (trending sounds, formats)
- [ ] Performance feedback loop (actual reel analytics → model tuning)
- [ ] Multi-language expansion (Arabic, Spanish)

---

## License

Proprietary — all rights reserved.
