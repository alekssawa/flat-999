export interface Apartment {
  id: string;
  title: string;
  url: string;
  dealType: string;
  authorType: 'PRIVATE' | 'AGENCY' | 'DEVELOPER' | string;
  price: number;
  currency: string;
  priceEur: number;
  pricePerMeterEur?: number;
  rooms?: number;
  area?: number;
  floor?: number;
  city?: string;
  district?: string;
  street?: string;
  images: string[];
  publishedAt: string;
  isFavorite: boolean;
  isHidden: boolean;
  userNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedApartments {
  items: Apartment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApartmentsFilterParams {
  page?: number;
  limit?: number;
  dealType?: string;
  authorType?: string;
  rooms?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  minFloor?: number;
  maxFloor?: number;
  districts?: string;
  search?: string;
  sortBy?: string;
  favoritesOnly?: boolean;
  includeHidden?: boolean;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function fetchApartments(params: ApartmentsFilterParams = {}): Promise<PaginatedApartments> {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      query.append(key, String(val));
    }
  });

  const res = await fetch(`${API_BASE}/apartments?${query.toString()}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch apartments: ${res.statusText}`);
  }

  return res.json();
}

export async function syncApartments(): Promise<{ success: boolean; count?: number }> {
  const res = await fetch(`${API_BASE}/apartments/sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`Sync failed: ${res.statusText}`);
  }

  return res.json();
}
