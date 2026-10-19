# Research: Flat Search & Filtering Aggregator (999.md)

**PRD**: `docs/prd-flat-search.md`  
**Date**: 2026-10-19  
**Status**: Complete  

## 1. Codebase Anatomy & Existing Patterns
- **Target Source Platform**: `999.md` (Moldova's primary classifieds network).
- **Backend Stack**: NestJS 10/11, Prisma ORM, SQLite (embedded zero-config persistence), `@nestjs/schedule` (for daily automated cron task), `axios` (HTTP transport).
- **Frontend Stack**: Next.js 14+ (App Router), React 18/19, Tailwind CSS, Lucide React (icons), TanStack Table / custom responsive Table & Grid.
- **Data Exchange**: REST API between Next.js and NestJS with typed DTO contracts and DTO validation via `class-validator` / `class-transformer`.

---

## 2. Technical Approaches & Trade-offs

### Option 1: Headless Browser Scraping (Playwright / Puppeteer)
- **Description**: Launch a Chromium instance on schedule or request, navigate to `999.md`, and extract DOM elements.
- **Pros**: Handles client-side rendering seamlessly.
- **Cons / Risks**: Heavy memory footprint (>300MB RAM), slow execution (5–10s per page), fragile selectors, high risk of timeouts or zombie browser processes.

### Option 2: HTML Scraping via Cheerio / Regex
- **Description**: Fetch SSR HTML pages and parse tags or Next.js streaming chunks.
- **Pros**: Fast, low memory.
- **Cons / Risks**: 999.md loads actual ad cards via client-side GraphQL queries after the initial shell loads. The raw HTML contains filter lists and metadata, but listings themselves are fetched via Apollo GraphQL.

### Option 3: Direct 999.md GraphQL API Integration (Recommended)
- **Description**: Send structured GraphQL queries directly to `https://999.md/graphql` replicating the exact `SearchAds` query and variables used by the official 999.md web client.
- **Pros**:
  - Blazingly fast (200–400ms per request for 78 listings).
  - 100% typed, structured data directly from the source (IDs, exact prices, currencies, rooms, floor, square meters, images, author types).
  - Native support for remote filters (`filterId: 16` for Deal Type, `filterId: 30` for Rooms, `filterId: 32` for Region, `filterId: 1074` for Districts).
  - Minimal CPU and memory overhead (pure JSON HTTP requests).
- **Cons / Risks**: Requires maintaining the GraphQL query document and fragments. Mitigated with robust error handling and fallback parsing.

### Selected Recommendation
We select **Option 3: Direct 999.md GraphQL API Integration**, supplemented by a resilient HTTP client service with exponential backoff and structured parsing.

---

## 3. Proposed Contracts & Data Architecture

### 3.1. Database Schema (`prisma/schema.prisma`)

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum DealType {
  SALE
  RENT_MONTH
  RENT_DAY
}

enum AuthorType {
  PRIVATE
  AGENCY
  DEVELOPER
}

model Apartment {
  id              String         @id
  title           String
  url             String
  dealType        DealType       @default(SALE)
  authorType      AuthorType     @default(AGENCY)
  price           Float
  currency        String         // EUR, USD, MDL
  priceEur        Float          // Normalized EUR price for uniform sorting
  pricePerMeterEur Float?
  rooms           Int?           // 1, 2, 3, 4+
  area            Float?         // m²
  floor           Int?
  city            String?
  district        String?
  street          String?
  images          String         // JSON array of image URLs
  publishedAt     DateTime
  isFavorite      Boolean        @default(false)
  isHidden        Boolean        @default(false)
  userNotes       String?
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
  priceHistory    PriceHistory[]

  @@index([priceEur])
  @@index([rooms])
  @@index([district])
  @@index([authorType])
  @@index([isFavorite])
  @@index([isHidden])
}

model PriceHistory {
  id          Int       @id @default(autoincrement())
  apartmentId String
  priceEur    Float
  recordedAt  DateTime  @default(now())
  apartment   Apartment @relation(fields: [apartmentId], references: [id], onDelete: Cascade)

  @@index([apartmentId])
}

model SearchFilterConfig {
  id          String   @id @default("default")
  dealType    String   @default("SALE")
  rooms       String   // JSON array e.g. [2]
  cityId      Int      @default(12900) // Chisinau
  districtIds String   // JSON array e.g. [937, 931, 916]
  maxPriceEur Float?
  maxArea     Float?
  lastSyncAt  DateTime?
  updatedAt   DateTime @updatedAt
}
```

### 3.2. REST API Endpoints

#### 1. `GET /api/apartments`
- **Query Parameters**:
  - `page?: number` (default: 1)
  - `limit?: number` (default: 30)
  - `dealType?: string` (`SALE`, `RENT_MONTH`)
  - `authorType?: string` (`ALL`, `PRIVATE`, `AGENCY`)
  - `rooms?: string` (comma-separated: `1,2,3`)
  - `minPrice?: number`, `maxPrice?: number`
  - `minArea?: number`, `maxArea?: number`
  - `minFloor?: number`, `maxFloor?: number`
  - `districts?: string` (comma-separated names)
  - `search?: string` (title or street text)
  - `sortBy?: string` (`date_desc`, `price_asc`, `price_desc`, `price_m2_asc`, `area_desc`)
  - `favoritesOnly?: boolean`
  - `includeHidden?: boolean`
- **Response DTO**:
  ```typescript
  export interface PaginatedApartmentsDto {
    items: ApartmentDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
  ```

#### 2. `POST /api/apartments/sync`
- **Payload**: Optional custom filter override.
- **Response**: `{ success: boolean; fetchedCount: number; newCount: number; updatedCount: number }`

#### 3. `PATCH /api/apartments/:id/favorite`
- **Payload**: `{ isFavorite: boolean }`
- **Response**: Updated `ApartmentDto`

#### 4. `PATCH /api/apartments/:id/hide`
- **Payload**: `{ isHidden: boolean }`
- **Response**: Updated `ApartmentDto`

#### 5. `GET /api/filters/config`
- **Response**: Current default filter configuration and available metadata (districts, room types, price boundaries).

---

## 4. Risks, Concurrency & Security
- **Idempotency & Race Conditions**: Ingestion writes use Prisma `upsert` keyed on `id`. Concurrent sync attempts are guarded with an in-memory lock (`isSyncing: boolean`).
- **Network Resilience**: 999.md requests use a 10-second timeout, with user-friendly error boundaries so the frontend always works against previously synced database records even if offline.
- **Data Quality**: Safe fallbacks for missing prices, unparseable floor numbers, or missing photos.

---

## 5. Next Step
- Run phased implementation planning: `plan docs/prd-flat-search.md`
