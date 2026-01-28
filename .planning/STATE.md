# Project State

## Project Reference

**Movies Phobia** — A web application that helps people with phobias identify and avoid triggering content in movies and TV shows.

**Core Value:** Enable people with phobias to make informed viewing decisions by providing specific, actionable information about triggering content before they watch.

---

## Current Position

- **Phase:** 1 of 4 — Foundation & Core Features
- **Status:** GAP CLOSURE — Completed 01-04 (Wire Danger Scores), working on identified gaps
- **Progress:** 6 of 7 plans complete (86% of Phase 1)
- **Last activity:** 2026-01-28 — Completed 01-04-PLAN.md (Wire Danger Scores to Scene Tags)

---

## Progress

```
Phase 1: Foundation & Core Features    ██████████░░ 86%
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
| Vitest for test runner | Vite-native, faster than Jest, better integration | 2026-01-28 |
| Testing Library for React hooks | Industry standard, behavior-focused testing approach | 2026-01-28 |
| Co-located test files | Tests in same directory as implementation (*.test.tsx pattern) | 2026-01-28 |
| Model Profile | Budget (Sonnet for writing, Haiku for research/verification) | 2026-01-26 |
| Workflow Configuration | Research, Plan Checker, and Execution Verifier all enabled | 2026-01-26 |

---

## Pending Todos

None yet.

---

## Blockers & Concerns

- **Authentication strategy TBD** — Need to decide auth approach before implementing user accounts (Phase 2)
- **Backend persistence TBD** — localStorage working for Phase 1; need strategy for Phase 2+ scene tags

---

## Session Continuity

- **Last session:** 2026-01-28 14:16 — Completed 01-04 (Wire Danger Scores)
- **Stopped at:** Gap closure in progress — 01-04 complete, 01-05 next
- **Next action:** Execute 01-05 (Average intensity ratings calculation)
- **Resume file:** None

---

*Last updated: 2026-01-28 14:16*
