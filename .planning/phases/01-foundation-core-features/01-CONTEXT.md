# Phase 1: Foundation & Core Features - Context

**Gathered:** 2026-01-26
**Status:** Ready for planning

<domain>

## Phase Boundary

Build the core phobia-aware movie browsing experience with TMDB API integration, personalized danger scores, and the scene tagging framework. This establishes the foundation that authentication and community features will build upon. Does NOT include user accounts or authentication.

</domain>

<decisions>

## Implementation Decisions

### Browse/Discovery UI

- **Layout:** Claude's Discretion — card grid or list format based on responsive design principles
- **Phobia selection:** Both modal on first load (required selection) AND sidebar filter (to refine/change selections in-session)
- **Loading behavior:** Infinite scroll for the popular/browse list
- **Empty state (no phobias selected):** Show movies but display generic warnings instead of personalized scores; don't block browsing

### Danger Score Visualization

- **Display format:** Both color-coded badge AND numeric score (0-100) on each card
- **Multiple phobias:** Show breakdown per phobia, not just a single aggregate score
- **Position on card:** Bottom of card (not prominent overlay)
- **Accompanying text:** No explanation needed — users understand from context (color + number)

### Scene Tagging Workflow

- **UI location:** Separate modal/drawer for tagging (not inline on movie detail page)
- **Timestamp capture:** Claude's Discretion — pick between text input or time picker based on UX best practices
- **Tag display:** Timeline view showing tags chronologically across movie duration
- **Tag visibility:** Show both aggregated statistics AND individual contributor tags (with expandable detail)

### Claude's Discretion

- Search experience design (real-time vs form submission, result presentation)
- Data persistence strategy for Phase 1 (localStorage, IndexedDB, or other)
- Exact color scale for danger scores (red/yellow/green mapping)
- Timeline visualization implementation details
- Tag list sorting/filtering options

</decisions>

<specifics>

## Specific Ideas

- The goal is to help someone like your wife with trypophobia (zero tolerance) know immediately if a movie is safe, or find the specific unsafe moments if it has scenes she can tolerate
- Timestamps are critical for the preview use case: a partner can jump to specific scenes to assess tolerability before deciding to watch together
- Consider your wife's workflow: "Is this movie safe for me?" → quick check of danger score → if risky, see timeline of unsafe moments → optionally ask partner to preview scene 45:30

</specifics>

<deferred>

## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 01-foundation-core-features*
*Context gathered: 2026-01-26*
