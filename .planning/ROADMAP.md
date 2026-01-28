# Roadmap

## Phase 1: Foundation & Core Features ✓ COMPLETE

**Goal:** Build the core phobia-aware movie browsing experience with TMDB integration, danger scores, and scene tagging framework.

**Acceptance Criteria:**
- [x] TMDB API integration complete and tested
- [x] Browse popular movies and TV shows with working UI
- [x] Search functionality for specific movies/shows
- [x] Movie detail page displaying plot and metadata
- [x] Personalized danger score calculation based on phobia selection
- [x] Scene tagging UI (timestamp, phobia type, intensity, notes)
- [x] View individual tags from all users
- [x] Average intensity ratings calculation

**Status:** COMPLETE (2026-01-28) — All 7 plans executed, verified, and integrated
**Verification:** PASSED — All 8 must-haves verified against codebase

---

## Phase 2: Authentication & User Profiles

**Goal:** Enable user accounts so tagging contributions can be tracked, personalized, and moderated.

**Acceptance Criteria:**
- [ ] Authentication system implemented (strategy TBD)
- [ ] User account creation flow
- [ ] User phobia profile (select from predefined phobia list)
- [ ] Persistent user preferences
- [ ] User attribution on contributed tags
- [ ] Account management UI

---

## Phase 3: Scene Tagging & Community Growth

**Goal:** Build community tagging features and ensure high-quality, consistent phobia data.

**Acceptance Criteria:**
- [ ] Advanced tagging: timestamp ranges, multiple phobia types per scene
- [ ] Tag moderation workflow (if abuse detected)
- [ ] Community tag statistics dashboard
- [ ] User contribution history
- [ ] Tag quality metrics

---

## Phase 4: Polish & Launch

**Goal:** Prepare for production and user growth.

**Acceptance Criteria:**
- [ ] Performance optimization
- [ ] Error handling and logging
- [ ] User documentation and onboarding
- [ ] Accessibility audit and fixes
- [ ] SEO optimization
- [ ] Launch plan execution

---

## Known Constraints

- **Tech Stack:** React 19 + TypeScript + Vite (locked)
- **API Dependency:** TMDB API for all metadata (rate limits, ToS compliance required)
- **Authentication:** Strategy TBD before Phase 2
- **Data Persistence:** Strategy TBD before Phase 2
- **Phobia List:** Must be comprehensive yet manageable

---

*Roadmap created: 2026-01-26*
