# Plan: Flat Search & Filtering Aggregator (999.md)

**PRD**: `docs/prd-flat-search.md`  
**Research**: `docs/research-flat-search.md`  
**Date**: 2026-10-19  
**Status**: Planned  

## Implementation Phases

### Phase 1: Tracer Bullet (End-to-End Vertical Slice)
**Goal:** Establish a working end-to-end path from NestJS HTTP routing and Prisma database through to a minimal Next.js UI to validate fullstack connectivity early.  
**Touches:** backend / database / frontend  
**Phase Completion Criteria:** Initial bootstrap of backend and frontend; `GET /api/apartments` returns seeded/dummy data to a simple Next.js page.  
**Tasks:**
- [x] **Task 1.1: Project Monorepo Structure & NestJS Bootstrap**
  - Description: Scaffold `backend/` and `frontend/` folders, configure root scripts.
  - Files: `package.json`, `backend/package.json`, `backend/src/main.ts`
  - Verification: Backend starts on port 3001 and responds with health check.
- [x] **Task 1.2: Prisma Schema & Database Initialization**
  - Description: Initialize SQLite database, create `Apartment` and `PriceHistory` models, run initial migration.
  - Files: `backend/prisma/schema.prisma`
  - Verification: Run `npx prisma db push` and verify SQLite file creation.
- [ ] **Task 1.3: Apartments Controller & Service Facade Skeleton**
  - Description: Create route handler `GET /api/apartments` returning paginated response DTO.
  - Files: `backend/src/apartments/apartments.controller.ts`, `backend/src/apartments/apartments.service.ts`
  - Verification: Automated integration test verifying `GET /api/apartments` returns 200 with typed JSON.
- [ ] **Task 1.4: Next.js Frontend Skeleton & API Client**
  - Description: Setup Next.js with Tailwind CSS and an API client fetching from backend.
  - Files: `frontend/src/app/page.tsx`, `frontend/src/lib/api.ts`
  - Verification: `npm run build` passes in `frontend/`.

---

### Phase 2: Core Scraper & 999.md Ingestion Engine
**Goal:** Implement the GraphQL parser for 999.md with query generation matching user filter parameters, data normalization, deduplication, and manual sync.  
**Touches:** backend  
**Phase Completion Criteria:** Triggering `POST /api/apartments/sync` scrapes real 999.md listings and saves them to the database.  
**Tasks:**
- [ ] **Task 2.1: 999.md GraphQL Client & Query Generator**
  - Description: Build scraper service that builds GraphQL search requests for 999.md with filters (offer type, rooms, district, price).
  - Files: `backend/src/scraper/scraper.service.ts`, `backend/src/scraper/graphql.constants.ts`
  - Verification: Unit test asserting GraphQL payload formatting and mock response normalization.
- [ ] **Task 2.2: Data Normalizer & Currency Converter**
  - Description: Parse ad attributes (rooms, area, floor, EUR price conversion, author type: private vs agency, photos) into database model.
  - Files: `backend/src/scraper/normalizer.ts`
  - Verification: Unit test asserting correct extraction of private owner vs agency and EUR price per m².
- [ ] **Task 2.3: Ingestion Pipeline & Upsert with Price History**
  - Description: Ingest listings into SQLite using Prisma upsert, detecting and recording price changes in `PriceHistory`.
  - Files: `backend/src/scraper/ingestion.service.ts`
  - Verification: Integration test verifying second sync updates existing records and creates price history entry on price change.
- [ ] **Task 2.4: Sync API Endpoint & On-Startup Trigger**
  - Description: Add `POST /api/apartments/sync` and optional on-application-bootstrap initial sync check.
  - Files: `backend/src/apartments/apartments.controller.ts`
  - Verification: Test asserting sync endpoint returns count of fetched, new, and updated ads.

---

### Phase 3: Advanced Filtering, Search & Scheduled Cron
**Goal:** Full REST API filtering (price, rooms, district, author type), favorites/hide toggling, and 24h background cron task.  
**Touches:** backend  
**Phase Completion Criteria:** API supports all filter criteria, favorites toggle, and scheduled cron triggers without errors.  
**Tasks:**
- [ ] **Task 3.1: Filtering & Sorting DTOs with ValidationPipe**
  - Description: Create `GetApartmentsQueryDto` with class-validator decorators for all filters (dealType, authorType, rooms, price range, districts).
  - Files: `backend/src/apartments/dto/get-apartments-query.dto.ts`
  - Verification: Test asserting validation rejects invalid query parameters.
- [ ] **Task 3.2: Filter Query Builder in Apartments Service**
  - Description: Dynamic Prisma `where` clause builder for multi-district filtering, private owner filtering, and price ranges.
  - Files: `backend/src/apartments/apartments.service.ts`
  - Verification: Integration tests verifying private-only filter, price range bounds, and room counts.
- [ ] **Task 3.3: Favorites & Hidden State Management Endpoints**
  - Description: Implement `PATCH /api/apartments/:id/favorite` and `PATCH /api/apartments/:id/hide`.
  - Files: `backend/src/apartments/apartments.controller.ts`
  - Verification: Tests asserting state toggles persist and excluded/included as requested.
- [ ] **Task 3.4: 24h Background Scheduled Cron Task**
  - Description: Setup `@nestjs/schedule` cron job running once daily to fetch new ads and log sync metrics.
  - Files: `backend/src/scraper/scraper.cron.ts`, `backend/src/app.module.ts`
  - Verification: Test executing the scheduled cron handler directly asserting successful run.

---

### Phase 4: Frontend UI — Data Table, Card View & Deep Filter Bar
**Goal:** Deliver a modern, responsive Next.js frontend with Tailwind CSS featuring Table & Card views, filter sidebar, live sync button, and modal details.  
**Touches:** frontend  
**Phase Completion Criteria:** User can view listings in responsive table and cards, filter by criteria, toggle favorites, and run manual sync.  
**Tasks:**
- [ ] **Task 4.1: Filter Sidebar & Toolbar Component**
  - Description: Responsive filter controls for price range, rooms chips, district multiselect, author type toggle ("Только собственники"), and search bar.
  - Files: `frontend/src/components/FilterSidebar.tsx`, `frontend/src/components/Header.tsx`
  - Verification: Component test / typecheck verifying filter state management and query generation.
- [ ] **Task 4.2: Apartment Table View Component**
  - Description: Interactive data table with sortable columns (Price, Area, €/m², Date), author badges, and quick actions (favorite, hide, open on 999.md).
  - Files: `frontend/src/components/ApartmentTable.tsx`
  - Verification: Verify table renders correctly on desktop and tablet with empty state.
- [ ] **Task 4.3: Apartment Card Grid & Image Carousel**
  - Description: Visual grid view with photo thumbnails, price trend indicators (price drops), and room/floor tags.
  - Files: `frontend/src/components/ApartmentCard.tsx`, `frontend/src/components/ApartmentGrid.tsx`
  - Verification: Visual verification and responsiveness on mobile and desktop.
- [ ] **Task 4.4: Sync Status, Favorites View & Detail Modal**
  - Description: Header indicator showing last sync time, manual sync trigger button with spinning loader, and apartment detail modal.
  - Files: `frontend/src/components/ApartmentModal.tsx`, `frontend/src/app/page.tsx`
  - Verification: End-to-end user flow: sync -> filter -> switch to table view -> toggle favorite.

---

## 4. Next Step
- Create GitHub Milestones and Issues: `issues docs/plan-flat-search.md`
