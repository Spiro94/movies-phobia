# Movies Phobia

## What This Is

A web application that helps people with phobias identify and avoid triggering content in movies and TV shows. Users can search or browse content from TMDB, see personalized danger scores based on their specific phobias, view detailed scene-level warnings with timestamps and intensity ratings, and contribute tags to help the community.

## Core Value

Enable people with phobias to make informed viewing decisions by providing specific, actionable information about triggering content before they watch.

## Requirements

### Validated

- ✓ React 19 + TypeScript + Vite foundation — existing
- ✓ Component-based architecture with strict TypeScript — existing
- ✓ ESLint configuration with React hooks support — existing

### Active

- [ ] User authentication and account creation
- [ ] User phobia profile (select from predefined phobia list)
- [ ] TMDB API integration for movie/show catalog and metadata
- [ ] Browse popular movies and TV shows with danger indicators
- [ ] Search for specific movies and TV shows
- [ ] Movie detail page displaying plot, personalized danger score, and scene tags
- [ ] Personalized danger score calculation based on user's selected phobias
- [ ] Add scene tags: timestamp, phobia type, intensity (1-10), context notes
- [ ] View all individual tags from multiple users (not just averages)
- [ ] Average intensity ratings across multiple users for same scene
- [ ] Predefined phobia dropdown list for consistent tagging

### Out of Scope

- LLM-powered phobia detection from plots/reviews — defer to v2, focus on human-curated tags first
- Content moderation/approval workflow — add if abuse becomes an issue, start with trust model
- Video player integration with scene skipping — out of scope, users preview externally
- Mobile native apps — web-first, mobile web is sufficient for v1
- Social features (follows, comments, profiles) — keep focused on phobia tagging utility
- Export/import personal watch lists — not core to phobia identification
- Backend recommendation engine — just show TMDB's popular lists, don't build custom recommendations

## Context

**Personal motivation:** Built to help users like the creator's wife who has trypophobia (zero tolerance) and ailurophobia (context-dependent tolerance). Current problem: no way to know if content is safe before watching, leading to unpleasant surprises or overly cautious avoidance of potentially safe content.

**Usage pattern:** Users typically start with a movie title in mind and need to check safety. Timestamps allow someone (partner, friend) to preview specific scenes to assess tolerability before deciding whether to watch together.

**Community model:** Starts as personal database for creator and wife, grows to community-contributed tags. Requires accounts to limit abuse but trusts contributors initially (no pre-moderation).

**TMDB as source of truth:** All movie/show metadata (titles, plots, images, popularity) comes from TMDB API. Application layers phobia tags on top of TMDB's catalog rather than maintaining separate movie database.

## Constraints

- **Tech stack**: React 19 + TypeScript + Vite (already established)
- **API dependency**: TMDB API for all movie/show data — must stay within API rate limits and terms of service
- **Client-side only initially**: No backend planned for v1 — must determine data persistence strategy (localStorage, browser DB, or add simple backend)
- **Authentication strategy TBD**: Need to decide on auth approach before user accounts can be implemented
- **Phobia list scope**: Predefined list must be comprehensive enough to be useful but not so large it's overwhelming — requires research on common phobias

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use TMDB API instead of building movie database | Avoid maintaining complex movie metadata, leverage existing API with rich data | — Pending |
| Require user accounts for tagging | Limit abuse from bots/trolls without complex moderation in v1 | — Pending |
| Start with predefined phobia list | Keep tagging consistent and searchable vs. free-form user input | — Pending |
| Average intensity ratings across users | Balance individual perspectives with crowd wisdom | — Pending |
| Single timestamp per tag (start only) | Simpler than ranges, sufficient for preview use case | — Pending |
| Personalized danger scores | Different phobias have different trigger sensitivities per user | — Pending |

---
*Last updated: 2026-01-26 after initialization*
