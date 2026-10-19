import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApartmentDto, PaginatedApartmentsDto } from './dto/apartment.dto';

@Injectable()
export class ApartmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: any): Promise<PaginatedApartmentsDto> {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query.limit) || 30));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.favoritesOnly) {
      where.isFavorite = true;
    }
    if (!query.includeHidden) {
      where.isHidden = false;
    }

    const [items, total] = await Promise.all([
      this.prisma.apartment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
      }),
      this.prisma.apartment.count({ where }),
    ]);

    const mappedItems: ApartmentDto[] = items.map((item) => ({
      ...item,
      images: this.safeParseImages(item.images),
    }));

    return {
      items: mappedItems,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  private safeParseImages(imagesJson: string): string[] {
    try {
      return JSON.parse(imagesJson);
    } catch {
      return [];
    }
  }
}
