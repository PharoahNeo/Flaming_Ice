# SwiftRoute Logistics

A full-stack logistics website for SwiftRoute Logistics — a global freight and shipping company. Built with React + Vite (frontend) and Express (backend) in a pnpm monorepo.

## Features

- **Home page** — Hero, live stats, services overview, inline shipment tracker, About Us section
- **Services** — Full service catalog with pricing (live from API)
- **Tracking** — Real-time shipment lookup with event timeline
- **Quote** — Multi-step quote request form
- **Contact** — Global offices + contact form
- **About Us** — Company story, milestone timeline, leadership
- **AI Chatbot** — Floating GPT-powered assistant on every page

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 7, TailwindCSS, shadcn/ui |
| Backend | Node.js 20, Express 5 |
| Database | PostgreSQL + Drizzle ORM |
| API | OpenAPI spec → Orval codegen (React Query hooks + Zod) |
| AI | OpenAI GPT |
| Monorepo | pnpm workspaces |

## Running with Docker

### Prerequisites

- Docker + Docker Compose
- An OpenAI API key (for the chatbot)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/PharoahNeo/Flaming_Ice.git
   cd Flaming_Ice
   ```

2. Copy the environment file and fill in your values:
   ```bash
   cp .env.example .env
   # Edit .env with your OPENAI_API_KEY, POSTGRES_PASSWORD, and SESSION_SECRET
   ```

3. Build and start all services:
   ```bash
   docker compose up --build
   ```

4. The website is available at **http://localhost**

   The API server is at **http://localhost:8080**

### Services

| Service | Port | Description |
|---|---|---|
| `web` | 80 | React frontend (nginx) |
| `api` | 8080 | Express API server |
| `db` | 5432 | PostgreSQL database |

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `OPENAI_API_KEY` | Yes | OpenAI API key for the chatbot |
| `POSTGRES_PASSWORD` | Recommended | Database password (default: `postgres`) |
| `SESSION_SECRET` | Recommended | Session signing secret |
| `OPENAI_BASE_URL` | No | Custom OpenAI base URL (default: `https://api.openai.com/v1`) |

### Running DB Migrations

After first boot, run the schema push:
```bash
docker compose exec api node -e "require('./dist/index.mjs')" # server starts migrations on boot
```

Or use drizzle-kit directly in development:
```bash
pnpm --filter @workspace/db run push
```

## Development (without Docker)

### Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL

### Setup

```bash
pnpm install
cp .env.example .env
# Set DATABASE_URL in .env

pnpm --filter @workspace/db run push
```

### Start dev servers

```bash
# API server (port 8080)
pnpm --filter @workspace/api-server run dev

# Frontend (auto port)
pnpm --filter @workspace/logistics-website run dev
```

## Sample Tracking Numbers

For demo purposes:
- `SWR-2024-001` — In Transit
- `SWR-2024-002` — Delivered

## Admin Dashboard

Visit `/admin/login` to access the back-office.

Default credentials (override via env vars `ADMIN_USERNAME` / `ADMIN_PASSWORD`):
- Username: `admin`
- Password: `swiftroute2026`

The dashboard provides:
- **Overview** — page views, unique visitors, daily traffic chart, top pages, top referrers
- **Shipments** — full CRUD for tracking numbers (create, edit, delete, manage status events)
- **Quotes** — view all quote requests, change status, delete
- **Chats** — browse AI chatbot conversations and full message history
- **Visitors** — recent page-view log

Page views are recorded automatically for every public-page navigation (admin pages excluded).
