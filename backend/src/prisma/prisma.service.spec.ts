import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    await prisma.onModuleInit();
  });

  afterAll(async () => {
    await prisma.onModuleDestroy();
  });

  it('should be defined and connect to SQLite', async () => {
    expect(prisma).toBeDefined();
    const count = await prisma.apartment.count();
    expect(typeof count).toBe('number');
  });

  it('should support search filter config query', async () => {
    const config = await prisma.searchFilterConfig.upsert({
      where: { id: 'default' },
      update: {},
      create: { id: 'default' },
    });
    expect(config).toBeDefined();
    expect(config.id).toBe('default');
  });
});
