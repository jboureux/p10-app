import { Test, TestingModule } from '@nestjs/testing';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../../prisma.service';
import { TokenBlacklistService } from './token-blacklist.service';

jest.mock('jsonwebtoken');

describe('TokenBlacklistService', () => {
  let service: TokenBlacklistService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenBlacklistService,
        {
          provide: PrismaService,
          useValue: {
            blacklistedToken: {
              create: jest.fn().mockImplementation((data) => Promise.resolve(data)),
              findUnique: jest.fn().mockImplementation((data) => Promise.resolve(data)),
              deleteMany: jest.fn().mockImplementation((data) => Promise.resolve(data)),
            },
          },
        },
      ],
    }).compile();

    service = module.get<TokenBlacklistService>(TokenBlacklistService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('blacklist', () => {
    it('should add a token to the blacklist', async () => {
      const token = 'valid.jwt.token';
      const expTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      const expectedDate = new Date(expTime * 1000);

      (jwt.decode as jest.Mock).mockReturnValue({ exp: expTime });
      
      await service.blacklist(token);

      expect(jwt.decode).toHaveBeenCalledWith(token);
      expect(prismaService.blacklistedToken.create).toHaveBeenCalledWith({
        data: {
          token,
          expiresAt: expect.any(Date),
        },
      });

      // Check that the date passed is close to our expected date
      const createCall = (prismaService.blacklistedToken.create as jest.Mock).mock.calls[0][0];
      const dateDiff = Math.abs(createCall.data.expiresAt.getTime() - expectedDate.getTime());
      expect(dateDiff).toBeLessThan(1000); // Allow 1 second difference for test execution time
    });

    it('should throw an error if token has no expiration', async () => {
      const token = 'invalid.jwt.token';
      
      (jwt.decode as jest.Mock).mockReturnValue({});
      
      await expect(service.blacklist(token)).rejects.toThrow('Impossible de lire la date d’expiration du token');
    });
  });

  describe('isBlacklisted', () => {
    it('should return true if token is blacklisted', async () => {
      const token = 'blacklisted.token';
      
      (prismaService.blacklistedToken.findUnique as jest.Mock).mockResolvedValue({
        token,
        expiresAt: new Date(),
      });
      
      const result = await service.isBlacklisted(token);
      
      expect(result).toBe(true);
    });

    it('should return false if token is not blacklisted', async () => {
      const token = 'valid.token';
      
      (prismaService.blacklistedToken.findUnique as jest.Mock).mockResolvedValue(null);
      
      const result = await service.isBlacklisted(token);
      
      expect(result).toBe(false);
    });
  });

  describe('cleanExpiredTokens', () => {
    it('should delete expired tokens', async () => {
      await service.cleanExpiredTokens();
      
      expect(prismaService.blacklistedToken.deleteMany).toHaveBeenCalledWith({
        where: {
          expiresAt: {
            lt: expect.any(Date),
          },
        },
      });
    });
  });
});
