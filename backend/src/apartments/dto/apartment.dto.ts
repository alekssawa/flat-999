export class ApartmentDto {
  id: string;
  title: string;
  url: string;
  dealType: string;
  authorType: string;
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
  publishedAt: Date;
  isFavorite: boolean;
  isHidden: boolean;
  userNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class PaginatedApartmentsDto {
  items: ApartmentDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
