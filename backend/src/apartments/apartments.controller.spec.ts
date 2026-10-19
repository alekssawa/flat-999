import { Test, TestingModule } from '@nestjs/testing';
import { ApartmentsController } from './apartments.controller';
import { ApartmentsService } from './apartments.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ApartmentsController', () => {
  let controller: ApartmentsController;
  let service: ApartmentsService;

  const mockApartmentsService = {
    findAll: jest.fn().mockResolvedValue({
      items: [
        {
          id: '105313033',
          title: '2-комнатная квартира, 52 м², 4 этаж',
          url: 'https://999.md/ru/105313033',
          dealType: 'SALE',
          authorType: 'AGENCY',
          price: 57200,
          currency: 'EUR',
          priceEur: 57200,
          pricePerMeterEur: 1100,
          rooms: 2,
          area: 52,
          floor: 4,
          city: 'Кишинёв',
          district: 'Центр',
          street: 'str. Nicolae Dimo',
          images: [],
          publishedAt: new Date(),
          isFavorite: false,
          isHidden: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      total: 1,
      page: 1,
      limit: 30,
      totalPages: 1,
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApartmentsController],
      providers: [
        {
          provide: ApartmentsService,
          useValue: mockApartmentsService,
        },
      ],
    }).compile();

    controller = module.get<ApartmentsController>(ApartmentsController);
    service = module.get<ApartmentsService>(ApartmentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated apartments DTO', async () => {
      const result = await controller.findAll({});
      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('total', 1);
      expect(result).toHaveProperty('page', 1);
      expect(result).toHaveProperty('limit', 30);
      expect(result).toHaveProperty('totalPages', 1);
      expect(Array.isArray(result.items)).toBe(true);
      expect(result.items[0].id).toBe('105313033');
      expect(service.findAll).toHaveBeenCalled();
    });
  });
});
