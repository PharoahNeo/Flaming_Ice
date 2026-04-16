# SwiftRoute Logistics Website

## Overview

Full-stack logistics website for "SwiftRoute Logistics" — a global freight and shipping company. Built as a pnpm monorepo with a React/Vite frontend and Express backend.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + TailwindCSS + shadcn/ui
- **AI**: OpenAI GPT via Replit AI integration (chatbot)

## Features

- Home page with hero, live stats, services overview, About Us section, inline shipment tracking field
- Full tracking page (`/tracking`) with real-time shipment lookup (SWR-2024-001, SWR-2024-002)
- Services page (`/services`) with live API data
- Quote request form (`/quote`) connected to API
- Contact page (`/contact`) with global offices
- About Us page (`/about`) with timeline, team, and company info
- AI-powered chatbot widget (floating bottom-right, on all pages)
- Chatbot uses SSE streaming, persists conversations in PostgreSQL

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
  - **IMPORTANT**: After codegen, manually fix `lib/api-zod/src/index.ts` to only contain `export * from "./generated/api";`
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Architecture

```
artifacts/
  api-server/         — Express API (stats, services, tracking, quotes, openai chatbot)
  logistics-website/  — React+Vite frontend (all pages + chatbot widget)
lib/
  api-spec/           — OpenAPI spec + Orval codegen config
  api-client-react/   — Generated TanStack Query hooks
  api-zod/            — Generated Zod validation schemas
  db/                 — Drizzle ORM schema + migrations
```

## DB Schema

- `quotes` — quote requests from the form
- `conversations` — chatbot conversation sessions
- `messages` — chatbot messages (role: user | assistant)

## OpenAI Chatbot

- API routes at `/api/openai/conversations` and `/api/openai/conversations/:id/messages`
- Streams responses via SSE
- System prompt configured with SwiftRoute company info, services, contact details
- Model: GPT-5.2 via Replit AI integration

## Sample Data

- Tracking: `SWR-2024-001` (In Transit), `SWR-2024-002` (Delivered)
