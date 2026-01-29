# Project State

## Project Reference

**Movies Phobia** — A web application that helps people with phobias identify and avoid triggering content in movies and TV shows.

**Core Value:** Enable people with phobias to make informed viewing decisions by providing specific, actionable information about triggering content before they watch.

---

## Current Position

- **Phase:** 1 of 4 — Foundation & Core Features
- **Status:** COMPLETE ✓ — All 7 Phase 1 plans finished (01-01 through 01-05)
- **Progress:** 7 of 7 plans complete (100% of Phase 1)
- **Last activity:** 2026-01-29 — Completed Quick Task #008 (Revert Tailwind Migration)
- **Verification:** PASSED (2026-01-28) — All 8 must-haves verified against codebase

---

## Progress

```
Phase 1: Foundation & Core Features    ████████████ 100% ✓
Phase 2: Authentication & Profiles     ░░░░░░░░░░░░ 0%
Phase 3: Scene Tagging & Community     ░░░░░░░░░░░░ 0%
Phase 4: Polish & Launch               ░░░░░░░░░░░░ 0%
```

---

## Recent Decisions

| Decision | Context | Date |
|----------|---------|------|
| Phobia taxonomy: 23 DSM-5 aligned phobias | Covers 5 categories (animal, natural, blood, situational, other) | 2026-01-26 |
| Danger score thresholds: 0-30 green, 31-70 yellow, 71-100 red | Traffic-light color mapping for quick visual assessment | 2026-01-26 |
| localStorage for phobia persistence | Phase 1 solution; may migrate to IndexedDB in Phase 2+ | 2026-01-26 |
| axios for TMDB API client | Bearer token auth with rate limit handling | 2026-01-26 |
| TanStack Query v5 for server state | Industry standard for pagination and caching | 2026-01-26 |
| React Router v6 for navigation | Client-side routing with URL state, browser back button, shareable links | 2026-01-27 |
| Time utilities store seconds internally | Accept mm:ss format for user input, validate against runtime | 2026-01-27 |
| Modal requires selection or explicit Skip | Prevents danger score misinterpretation, with explanation shown | 2026-01-28 |
| Sidebar is persistent UI | Not modal - always visible for easy in-session refinement | 2026-01-28 |
| 500ms search debounce | Prevents excessive TMDB API calls and respects rate limits | 2026-01-28 |
| MUI Timeline for scene visualization | Saves ~100 lines, provides accessibility and professional UX | 2026-01-28 |
| 5-second duplicate tag window | Aggregates similar contributions, prevents spam/noise | 2026-01-28 |
| localStorage quota monitoring at 90% | Proactive warning before quota exceeded (5MB limit) | 2026-01-28 |
| SceneTag interface uses numeric timestamp | Enables precise validation against runtime in seconds | 2026-01-28 |
| Weighted average for community consensus | Accounts for multiple users per tag (3 users at 8 + 1 user at 2 = avg 6.5) | 2026-01-28 |
| Full-width layout for movie detail pages | Removed 1200px maxWidth constraint; content uses full viewport width | 2026-01-28 |
| Top-center dialog positioning pattern | Modals use items-start + pt-20 instead of pure center (better UX) | 2026-01-28 |
| Body without flex centering | Removed Vite's display: flex + place-items: center; root constraint prevented full-width | 2026-01-28 |
| Inline styles pattern | Reverted Tailwind CSS migration; using inline styles via style prop for all components | 2026-01-29 |
| Model Profile | Budget (Sonnet for writing, Haiku for research/verification) | 2026-01-26 |
| Workflow Configuration | Research, Plan Checker, and Execution Verifier all enabled | 2026-01-26 |

---

## Pending Todos

None yet.

---

## Quick Tasks Completed

| # | Description | Date | Commit | Directory |
|---|-------------|------|--------|-----------|
| 001 | Fix layout shrinkage, danger score calculation, and real-time updates | 2026-01-28 | [0ec4cfb](https://github.com/villamizar/movies-phobia/commit/0ec4cfb) | [001-fix-layout-danger-score-bugs](./quick/001-fix-layout-danger-score-bugs/) |
| 002 | Fix movie detail layout width and dialog positioning | 2026-01-28 | [8130c45](https://github.com/villamizar/movies-phobia/commit/8130c45), [551c4bf](https://github.com/villamizar/movies-phobia/commit/551c4bf) | [002-fix-movie-detail-layout-and-dialog-posit](./quick/002-fix-movie-detail-layout-and-dialog-posit/) |
| 003 | Fix root body flexbox centering for true full-width layout | 2026-01-28 | [8a68f40](https://github.com/villamizar/movies-phobia/commit/8a68f40) | [003-fix-full-width-layout-and-modal-stacking](./quick/003-fix-full-width-layout-and-modal-stacking/) |
| 008 | Revert Tailwind CSS migration to restore stable inline styling | 2026-01-29 | [5ad4c03](https://github.com/villamizar/movies-phobia/commit/5ad4c03) → [bedbbe5](https://github.com/villamizar/movies-phobia/commit/bedbbe5) | [008-revert-tailwind-migration](./quick/008-revert-tailwind-migration/) |

---

## Blockers & Concerns

- **Authentication strategy TBD** — Need to decide auth approach before implementing user accounts (Phase 2)
- **Backend persistence TBD** — localStorage working for Phase 1; need strategy for Phase 2+ scene tags

---

## Session Continuity

- **Last session:** 2026-01-29 15:06 — Completed Quick Task #008
- **Current activity:** 2026-01-29 — Quick task #008: Reverted Tailwind CSS migration
- **Next action:** Begin Phase 2 (Authentication & Profiles) planning
- **Resume file:** None

---

*Last updated: 2026-01-29 15:06*
