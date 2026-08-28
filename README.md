# Life OS

A local-first personal operating system for managing your life with quests, habits, goals, and RPG-style progression — all on your device.

**No accounts. No backend. No AI APIs.** Your data never leaves the browser.

![Life OS](https://img.shields.io/badge/status-MVP%20complete-22c55e)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6)
![React](https://img.shields.io/badge/React-19-61dafb)

## Features

### Core productivity
- **Dashboard** — today's quests, habits, momentum, life attributes, and quick actions
- **Quests** — daily, side, main, and epic quests with XP rewards and milestones
- **Goals** — milestones, progress tracking, and linked quests
- **Habits** — streaks, momentum (forgiving consistency), and daily check-offs
- **Command palette** — `⌘K` / `Ctrl+K` to navigate, create, log mood, and start focus

### Gamification
- **XP & levels** — earned from quests, habits, goals, focus sessions, and daily missions
- **Daily mission board** — four daily objectives + all-complete bonus (up to 235 XP/day)
- **Life attributes** — discipline, creativity, fitness, learning, social, finance
- **Achievements** — unlock milestones with toast notifications
- **Focus mode** — timed deep-work sessions with XP rewards

### Reflection & insight
- **Timeline** — chronological feed of everything you do
- **Life Map** — 2D visualization of life areas (goals, quests, habits per category)
- **Observatory** — charts and stats (activity, XP, habits, quests)
- **Weekly reflection** — structured check-in with summary cards
- **Daily check-in** — mood, energy, and focus scales

### Personalization & data
- **Onboarding** — display name and focus areas (no account required)
- **Profile** — stats, level, XP, preferences
- **Settings** — accent color, reduced motion, notifications prefs, export/import/reset
- **PWA** — installable, works offline after first load

## Quick start

```bash
npm install
npx playwright install chromium   # first time only, for E2E tests
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Typecheck + production build (includes PWA service worker) |
| `npm run preview` | Serve production build locally |
| `npm run test` | Unit tests (Vitest) |
| `npm run test:watch` | Unit tests in watch mode |
| `npm run test:e2e` | End-to-end tests (Playwright) |
| `npm run lint` | ESLint |

## Install as PWA

1. Run `npm run build && npm run preview` (or deploy the `dist/` folder)
2. In Chrome/Edge: use **Install** from the address bar or browser menu
3. The app caches assets for offline use via the service worker

## Architecture

```
src/
├── app/           # Pages and router
├── components/    # UI (dashboard, quests, layout, gamification, …)
├── domain/        # Business logic (quests, habits, XP, daily missions, …)
├── db/            # Dexie repositories and seed data
├── stores/        # Zustand state
└── lib/           # Export, validation, gamification sync
```

- **Persistence:** IndexedDB via [Dexie](https://dexie.org/)
- **State:** [Zustand](https://zustand.docs.pmnd.rs/) stores hydrated on boot
- **Logic:** Pure functions in `domain/` (unit tested)
- **Backup:** JSON export/import with Zod validation

## Privacy

- All data is stored in **IndexedDB** on your device
- No analytics, tracking, or external API calls
- Export your data anytime from **Settings → Export**

## Stack

TypeScript · React 19 · Vite · React Router · Zustand · Dexie · Tailwind CSS v4 · Framer Motion · Recharts · Zod · Vitest · Playwright

## License

Private project.
