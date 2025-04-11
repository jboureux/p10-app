import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { TokenBlacklistService } from '../services/token-blacklist.service';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let blacklistService: TokenBlacklistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: TokenBlacklistService,
          useValue: {
            isBlacklisted: jest.fn(),
          },
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    blacklistService = module.get<TokenBlacklistService>(TokenBlacklistService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return user data when token is valid', async () => {
      const req = { get: jest.fn().mockReturnValue('Bearer valid-token') };
      const payload = { sub: 1, email: 'test@example.com', role: 'USER' };

      jest.spyOn(blacklistService, 'isBlacklisted').mockResolvedValue(false);

      const result = await strategy.validate(req, payload);

      expect(result).toEqual({
        userId: 1,
        email: 'test@example.com',
        role: 'USER',
      });
      expect(blacklistService.isBlacklisted).toHaveBeenCalledWith(
        'valid-token',
      );
    });

    it('should throw UnauthorizedException when token is blacklisted', async () => {
      const req = {
        get: jest.fn().mockReturnValue('Bearer blacklisted-token'),
      };
      const payload = { sub: 1, email: 'test@example.com', role: 'USER' };

      jest.spyOn(blacklistService, 'isBlacklisted').mockResolvedValue(true);

      await expect(strategy.validate(req, payload)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(blacklistService.isBlacklisted).toHaveBeenCalledWith(
        'blacklisted-token',
      );
    });

    it('should handle missing authorization header', async () => {
      const req = { get: jest.fn().mockReturnValue(undefined) };
      const payload = { sub: 1, email: 'test@example.com', role: 'USER' };

      jest.spyOn(blacklistService, 'isBlacklisted').mockResolvedValue(false);

      const result = await strategy.validate(req, payload);

      expect(result).toEqual({
        userId: 1,
        email: 'test@example.com',
        role: 'USER',
      });
      expect(blacklistService.isBlacklisted).toHaveBeenCalledWith(undefined);
    });
  });
});
