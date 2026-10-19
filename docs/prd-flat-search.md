# PRD: Flat Search & Filtering Aggregator (999.md)

**Date**: 2026-10-19  
**Status**: Approved  

## 1. Goal & Value
Provide a streamlined, high-speed web application for searching, filtering, and tracking real estate apartments from 999.md. It empowers users to automatically find suitable housing by customizable criteria (deal type, room count, city/districts, budget, floor, and private owner vs agency), view results in a responsive data table and card grid, and receive daily automated scans for newly listed properties.

## 2. User Scenarios

### 2.1. Primary Path (Happy Path)
1. **Initial Launch & Automatic Ingestion**: On application launch, the backend fetches fresh listings from 999.md matching configured search parameters (deal type, rooms, district, price threshold).
2. **Browsing & Visualization**: User opens the frontend and immediately sees parsed listings presented in both an interactive data table (sortable by price, area, price/m², date) and a visual card gallery with image previews and badges ("Собственник" vs "Агентство").
3. **Interactive Deep Filtering**: User refines results directly on the frontend using dynamic filters:
   - Price range (in EUR, with unified currency conversion).
   - Rooms (1, 2, 3, 4+).
   - District selection (Botanica, Râșcani, Centru, Ciocana, Buiucani, Telecentru).
   - Author toggle (filter out agencies and show only private owners).
   - Area and Floor bounds.
4. **Manual & Scheduled Ingestion**:
   - User can click "Синхронизировать сейчас" for an instant refresh.
   - A daily cron job scans for new apartments, persists new entries, detects price drops, and updates the local feed.
5. **Engagement & Tracking**: User can mark listings as favorites or hide unwanted listings.

### 2.2. Edge Cases & Error States
- **External 999.md GraphQL Downtime / Network Timeout**: System handles timeouts gracefully, serves existing cached/persisted apartments from the database, and alerts the user with a non-blocking toast warning.
- **Empty Result Set**: When filter parameters yield no matches, the UI displays a clean empty state with recommendations to broaden criteria.
- **Malformed / Incomplete Ad Data**: If an ad lacks photos, floor, or structured street info, the parser applies default fallbacks without crashing the ingestion pipeline.
- **Duplicate Listings**: Identical ad IDs are updated idempotently (`upsert`), recording price changes in history rather than duplicating records.
- **Price Currency Discrepancies**: Prices in MDL or USD are converted to standard EUR using exchange rates for uniform sorting.

## 3. Scope Boundaries

### In Scope (Current Iteration)
- [ ] Parsing apartments via 999.md GraphQL API with support for user-specified filters (rooms, sale/rent, price, districts).
- [ ] Storing apartments and price history in a local SQLite database via Prisma ORM.
- [ ] NestJS REST API for fetching, filtering, searching, favoriting, and manual sync triggering.
- [ ] Scheduled background cron job (once every 24h) to automatically fetch newly posted listings.
- [ ] Modern Next.js App Router frontend with Tailwind CSS:
  - Responsive Data Table view (with column sorting, quick badges, and external links).
  - Visual Card Grid view with photo thumbnails and author badges.
  - Sidebar / toolbar filters for price, rooms, district, author type, and search.
  - Sync status indicator and manual trigger button.

### Out of Scope (Deferred / Non-Goals)
- Multi-user authentication / OAuth login (single-user / local desktop mode for this iteration).
- Native mobile app (responsive web UI covers mobile devices).
- SMS notifications (Telegram notifications can be plugged in a future milestone).

## 4. Constraints & Non-Functional Requirements (NFR)
- **Performance**: Ingestion of 50–100 listings completes in under 3 seconds; UI renders under 200ms using server components & memoized client filters.
- **Reliability**: Zero crashes on missing/unexpected ad schema fields from 999.md.
- **Security**: Strict DTO validation via class-validator/Zod; all inputs sanitized.
- **Usability**: WCAG 2.1 AA compliant contrast, keyboard navigability, clear responsive breakpoints.

## 5. Acceptance Criteria (Definition of Done)
- [ ] When launching the app, initial sync queries 999.md and populates database with valid apartment records.
- [ ] Frontend displays listings in both Table view and Card view with responsive pagination/filtering.
- [ ] Filtering by rooms, price, districts, and author type ("Только собственники") accurately filters results without page reloads.
- [ ] Clicking "Синхронизировать" triggers background ingestion and returns updated count.
- [ ] Scheduled cron executes daily and records new apartments without duplication.
- [ ] Favoriting and hiding apartments persists across page refreshes.

## 6. Next Step
- Run technical research: `research docs/prd-flat-search.md`
