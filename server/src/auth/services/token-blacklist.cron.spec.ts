import { Test, TestingModule } from '@nestjs/testing';
import { TokenBlacklistCron } from './token-blacklist.cron';
import { PrismaService } from '../../prisma.service';

describe('TokenBlacklistCron', () => {
  let service: TokenBlacklistCron;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenBlacklistCron,
        {
          provide: PrismaService,
          useValue: {
            blacklistedToken: {
              deleteMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<TokenBlacklistCron>(TokenBlacklistCron);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should delete expired tokens', async () => {
    const mockDeleteResult = { count: 5 };
    jest
      .spyOn(prismaService.blacklistedToken, 'deleteMany')
      .mockResolvedValue(mockDeleteResult);

    // Spy on console.log
    const consoleSpy = jest.spyOn(console, 'log');

    await service.cleanExpiredTokens();

    expect(prismaService.blacklistedToken.deleteMany).toHaveBeenCalledWith({
      where: {
        expiresAt: {
          lt: expect.any(Date),
        },
      },
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      '[CRON] 🧹 5 token(s) expiré(s) supprimé(s) de la blacklist.',
    );
  });

  it('should log when no tokens are deleted', async () => {
    const mockDeleteResult = { count: 0 };
    jest
      .spyOn(prismaService.blacklistedToken, 'deleteMany')
      .mockResolvedValue(mockDeleteResult);

    // Spy on console.log
    const consoleSpy = jest.spyOn(console, 'log');

    await service.cleanExpiredTokens();

    expect(consoleSpy).toHaveBeenCalledWith(
      '[CRON] Aucun token expiré à supprimer.',
    );
  });
});
