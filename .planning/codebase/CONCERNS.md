# Codebase Concerns

**Analysis Date:** 2026-01-26

## Project Maturity

**Early Stage Codebase:**
- Issue: Project contains only boilerplate template code with no actual feature implementation
- Files: `src/App.tsx`, `src/main.tsx`
- Impact: README describes three core features (phobia ratings, scene identification, scene selection) but none are implemented
- Status: Pre-development; significant architectural work required before feature development can proceed

## Test Coverage Gaps

**Complete Lack of Tests:**
- What's not tested: All functionality
- Files: `src/App.tsx` (35 lines)
- Risk: No regression detection possible; refactoring will be unsafe
- Priority: **High**
- Note: No test runner configured (jest, vitest, etc.) - must be added before meaningful test coverage can begin

## Architecture Concerns

**Missing Data Layer:**
- Issue: No API integration, database connection, or state management implemented
- Files: Entire `src/` directory
- Impact: Cannot implement core features without fundamental architectural decisions
- Blocker: Must define data persistence strategy before feature development

**No State Management:**
- Issue: Only local `useState` used in App component; no plan for global state
- Files: `src/App.tsx`
- Impact: User ratings, movie data, phobia selections, and scene mappings have nowhere to persist
- Action required: Evaluate state management solution (Context, Redux, Zustand, etc.) based on scale

**Missing API Client:**
- Issue: No HTTP client or API communication layer
- Files: Not present in codebase
- Impact: Cannot fetch movie data, submit ratings, or persist user selections
- Blocker: Need to design and implement API layer before backend integration

## Boilerplate Remnants

**Unused Assets and Demo Code:**
- Issue: Default Vite+React template artifacts remain
- Files: `src/App.tsx` (lines 12-30), `src/assets/`, vite/react logos
- Impact: Misleading demo content; future maintainers confused about what is intentional
- Action: Remove demo content (count button, Vite/React logos) once feature structure is in place

## Feature Implementation Gaps

**Three Core Features Not Started:**
1. **Phobia/Fear Trigger Identification:**
   - Required: Movie/series database integration
   - Required: Scene/timestamp mapping structure
   - Required: Phobia category taxonomy
   - Status: Not designed or implemented

2. **Rating System:**
   - Required: User authentication (not present)
   - Required: Persistent storage for user ratings
   - Required: Possibly movie/series metadata API
   - Status: Not designed or implemented

3. **Scene Tagging:**
   - Required: UI for marking specific timestamps/scenes
   - Required: Phobia category selector
   - Required: Persistence for user's scene selections
   - Status: Not designed or implemented

## Configuration & Tooling Concerns

**TypeScript Configuration Issues:**
- Issue: `noUncheckedSideEffectImports` enabled in strict mode but may be overly restrictive for library use
- Files: `tsconfig.app.json` (line 25)
- Impact: May prevent legitimate library imports; developers must verify this doesn't break needed dependencies
- Review needed: Validate this setting against actual dependency usage as codebase grows

**Non-Standard Vite Fork:**
- Issue: Using `rolldown-vite` instead of official Vite
- Files: `package.json` (line 28), override at line 31
- Impact: Community plugins may not work; upgrade path uncertain; potential maintenance burden
- Rationale needed: Confirm why non-standard Vite fork was chosen and establish migration plan if official Vite must be used

## Security Considerations

**User Data Not Addressed:**
- Risk: README mentions user-specific data (ratings, phobia selections) but no authentication/authorization present
- Files: Not present in codebase
- Current mitigation: None (project in early stage)
- Recommendations:
  - Design user authentication before accepting any user data
  - Plan data isolation strategy (per-user data access)
  - Consider GDPR/privacy implications of phobia tracking
  - Validate all input from user scene selections

**No Input Validation:**
- Risk: Once API is implemented, user inputs (phobia selections, ratings, timestamps) will need validation
- Files: Will affect future implementation
- Current mitigation: None
- Recommendations:
  - Use schema validation library (Zod, Yup) for all user inputs
  - Validate timestamps against actual movie durations
  - Sanitize phobia category inputs

## Dependency Management

**Few Dependencies (Asset):**
- Current: React 19.2.0, React DOM 19.2.0 only in production
- Impact: Minimal attack surface currently, but project is severely under-featured
- Upcoming: Will require backend client, state management, API library, possibly video player library, authentication library, etc.
- Risk: Rapid dependency growth planned; need to establish dependency review process now

**Build Tool Risk:**
- Issue: rolldown-vite is beta/experimental tooling
- Impact: May have performance issues or instability as project scales
- Recommendation: Monitor build performance and readiness to migrate if needed

## Missing Infrastructure

**No Environment Configuration:**
- Issue: No `.env` example or environment variable setup documented
- Files: Not present
- Impact: Once backend is added, developers won't know what env vars are needed
- Action: Create `.env.example` with required variables before backend integration

**No Build Optimization Guidance:**
- Issue: Vite config is default/minimal
- Files: `vite.config.ts`
- Impact: No code splitting, lazy loading, or performance optimization strategy defined
- Action: Plan for asset optimization and code splitting as feature complexity grows

---

*Concerns audit: 2026-01-26*
