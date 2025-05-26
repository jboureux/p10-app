import { Test, TestingModule } from '@nestjs/testing';
import { LeagueService } from './league.service';
import { PrismaService } from 'src/prisma.service';
import { ForbiddenException } from '@nestjs/common';

describe('LeagueService', () => {
  let service: LeagueService;
  let prisma: PrismaService;

  const mockPrismaService = {
    league: {
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    },
    userLeague: {
      create: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockPubSub = {
    publish: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeagueService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: 'PUB_SUB', useValue: mockPubSub },
      ],
    }).compile();

    service = module.get<LeagueService>(LeagueService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a league with userLeague', async () => {
      const mockInputPrivate = {
        name: 'Test League',
        isPrivate: true,
        apiAvatarId: '1',
      };

      const mockInputPublic = {
        name: 'Public League',
        isPrivate: false,
        apiAvatarId: '2',
      };

      const mockCreatorId = 'user-1';

      mockPrismaService.league.create.mockResolvedValue({
        id: 'league-1',
        ...mockInputPrivate,
      });

      const resultPrivate = await service.create(
        mockInputPrivate,
        mockCreatorId,
      );

      const resultPublic = await service.create(mockInputPublic, mockCreatorId);

      expect(mockPrismaService.league.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            name: mockInputPrivate.name,
            isPrivate: true,
            userLeague: expect.any(Object),
          }),
        }),
      );

      expect(mockPrismaService.league.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            name: mockInputPublic.name,
            isPrivate: true,
            userLeague: expect.any(Object),
          }),
        }),
      );
      expect(resultPrivate).toBeDefined();
      expect(resultPublic).toBeDefined();
    });
  });

  describe('deleteLeague', () => {
    it('should delete league if user is admin', async () => {
      const leagueId = 'league-1';
      const userId = 'user-1';

      mockPrismaService.league.findUnique.mockResolvedValue({
        id: leagueId,
        userLeague: [{ userId, isAdmin: true }],
      });

      mockPrismaService.league.delete.mockResolvedValue(true);

      const result = await service.deleteLeague(leagueId, userId);
      expect(result).toBe(true);
    });

    it('should throw ForbiddenException if user is not admin', async () => {
      const leagueId = 'league-1';
      const userId = 'user-2';

      mockPrismaService.league.findUnique.mockResolvedValue({
        id: leagueId,
        userLeague: [{ userId: 'other-user', isAdmin: true }],
      });

      await expect(service.deleteLeague(leagueId, userId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('leaveLeague', () => {
    it('should delete userLeague entry when user leaves', async () => {
      const leagueId = 'league-1';
      const userId = 'user-1';

      mockPrismaService.league.findUnique.mockResolvedValue({
        id: leagueId,
        name: 'League A',
        userLeague: [
          { id: 'ul-1', userId, isAdmin: false },
          { id: 'ul-2', userId: 'user-2', isAdmin: false },
        ],
      });

      mockPrismaService.userLeague.delete.mockResolvedValue(true);

      const result = await service.leaveLeague(leagueId, userId);
      expect(mockPrismaService.userLeague.delete).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should promote another user if admin leaves', async () => {
      const leagueId = 'league-1';
      const userId = 'admin-user';

      mockPrismaService.league.findUnique.mockResolvedValue({
        id: leagueId,
        name: 'League B',
        userLeague: [
          { id: 'ul-admin', userId, isAdmin: true },
          { id: 'ul-member', userId: 'user-2', isAdmin: false },
        ],
      });

      mockPrismaService.userLeague.delete.mockResolvedValue(true);
      mockPrismaService.userLeague.update.mockResolvedValue(true);

      const result = await service.leaveLeague(leagueId, userId);
      expect(mockPrismaService.userLeague.update).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });

  describe('joinPrivateLeagueWithLink', () => {
    it('should allow joining a private league with a valid link', async () => {
      const sharedLink = 'ABC123';
      const userId = 'user-1';

      mockPrismaService.league.findUnique.mockResolvedValue({
        id: 'league-1',
        isPrivate: true,
        userLeague: [],
      });

      mockPrismaService.userLeague.create.mockResolvedValue(true);

      const result = await service.joinPrivateLeagueWithLink(
        userId,
        sharedLink,
      );
      expect(mockPrismaService.userLeague.create).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should throw ForbiddenException if already a member', async () => {
      const sharedLink = 'ABC123';
      const userId = 'user-1';

      mockPrismaService.league.findUnique.mockResolvedValue({
        id: 'league-1',
        isPrivate: true,
        userLeague: [{ userId }],
      });

      await expect(
        service.joinPrivateLeagueWithLink(userId, sharedLink),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
