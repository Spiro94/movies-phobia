# External Integrations

**Analysis Date:** 2026-01-26

## APIs & External Services

**Currently Integrated:**
- None detected - No external API services are currently integrated

**Planned/Mentioned:**
- Movie/Series data source - TBD (required for MVP features)
- User phobia data storage - TBD

## Data Storage

**Databases:**
- Not integrated - Application is client-only SPA with no backend database
- Future integration required for:
  - User phobia profiles/preferences
  - Movie/series phobia-trigger ratings
  - User accounts/authentication

**File Storage:**
- Local filesystem only - Assets (SVG logos, CSS) stored in `public/` directory
- No cloud storage (AWS S3, Cloudinary, etc.) currently integrated

**Caching:**
- Browser cache - Vite/production build leverages standard HTTP caching
- No application-level caching (Redis, Memcached) implemented
- React component state used for local UI state management

## Authentication & Identity

**Auth Provider:**
- Not implemented - No authentication system currently in place
- Required for future features:
  - User accounts
  - Saving phobia preferences
  - Submitting scene ratings

**Implementation Approach (Future):**
- Options: Custom auth, OAuth 2.0 (Google/GitHub), third-party service (Auth0, Supabase)
- Pending architecture decision

## Monitoring & Observability

**Error Tracking:**
- None - No error tracking service integrated
- Recommended for production: Sentry, LogRocket, or similar

**Logs:**
- Browser console only - No centralized logging
- No server-side logs (application is client-only)

## CI/CD & Deployment

**Hosting:**
- Not configured - Application is static SPA, deployable to:
  - Netlify, Vercel, GitHub Pages
  - Traditional web servers (nginx, Apache)
  - CDNs (Cloudflare Pages, AWS S3 + CloudFront)

**CI Pipeline:**
- Not implemented - No GitHub Actions, GitLab CI, or similar configured
- Build can be triggered: `npm run build && npm run preview`

## Environment Configuration

**Required env vars:**
- None currently - Application has no external dependencies requiring secrets

**Future env vars (anticipated):**
- `VITE_API_BASE_URL` - Backend API endpoint
- `VITE_AUTH_PROVIDER_ID` - Authentication service credentials
- `VITE_ANALYTICS_KEY` - Analytics service key (if added)

**Secrets location:**
- Not applicable currently
- Recommend: `.env.local` (git-ignored) for development
- CI/CD: GitHub Secrets or hosting platform secrets manager

## Webhooks & Callbacks

**Incoming:**
- None configured

**Outgoing:**
- None configured

## Third-Party Resources

**External Links (docs/references only):**
- Vite documentation: https://vite.dev
- React documentation: https://react.dev

## Accessibility to External Services

- No network requests made by application
- Application is fully client-side and offline-capable
- Future integration will require:
  - API endpoint for movie/series data
  - Database for user data persistence
  - Authentication service for user accounts

---

*Integration audit: 2026-01-26*
