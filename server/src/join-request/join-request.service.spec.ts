import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JoinRequestService } from './join-request.service';
import { PrismaService } from '../prisma.service';
import { JoinRequestStatus } from '../entities/join-request.entity';

describe('JoinRequestService', () => {
  let service: JoinRequestService;
  let prisma: PrismaService;

  const mockPrisma = {
    league: {
      findUnique: jest.fn(),
    },
    userLeague: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    joinRequest: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JoinRequestService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<JoinRequestService>(JoinRequestService);
    prisma = module.get<PrismaService>(PrismaService);

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  describe('create', () => {
    const userId = 'user1';
    const input = { leagueId: 'league1' };

    it('should throw ForbiddenException if league does not exist', async () => {
      mockPrisma.league.findUnique.mockResolvedValue(null);

      await expect(service.create(userId, input)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw ForbiddenException if league is private', async () => {
      mockPrisma.league.findUnique.mockResolvedValue({
        id: 'league1',
        isPrivate: true,
      });

      await expect(service.create(userId, input)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw ForbiddenException if user is already member', async () => {
      mockPrisma.league.findUnique.mockResolvedValue({
        id: 'league1',
        isPrivate: false,
      });
      mockPrisma.userLeague.findFirst.mockResolvedValue({ id: 'membership1' });

      await expect(service.create(userId, input)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw ForbiddenException if there is an existing pending request', async () => {
      mockPrisma.league.findUnique.mockResolvedValue({
        id: 'league1',
        isPrivate: false,
      });
      mockPrisma.userLeague.findFirst.mockResolvedValue(null);
      mockPrisma.joinRequest.findFirst.mockResolvedValue({
        id: 'req1',
        status: JoinRequestStatus.PENDING,
      });

      await expect(service.create(userId, input)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should create a join request when all checks pass', async () => {
      mockPrisma.league.findUnique.mockResolvedValue({
        id: 'league1',
        isPrivate: false,
      });
      mockPrisma.userLeague.findFirst.mockResolvedValue(null);
      mockPrisma.joinRequest.findFirst.mockResolvedValue(null);
      const createdRequest = {
        id: 'req1',
        userId,
        leagueId: input.leagueId,
        status: JoinRequestStatus.PENDING,
        league: {},
      };
      mockPrisma.joinRequest.create.mockResolvedValue(createdRequest);

      const result = await service.create(userId, input);

      expect(mockPrisma.joinRequest.create).toHaveBeenCalledWith({
        data: {
          userId,
          leagueId: input.leagueId,
          status: JoinRequestStatus.PENDING,
        },
        include: { league: true },
      });
      expect(result).toEqual(createdRequest);
    });
  });

  describe('updateStatus', () => {
    const adminId = 'admin1';
    const input = { requestId: 'req1', status: JoinRequestStatus.ACCEPTED };

    it('should throw NotFoundException if request does not exist', async () => {
      mockPrisma.joinRequest.findUnique.mockResolvedValue(null);

      await expect(service.updateStatus(adminId, input)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if user is not admin', async () => {
      mockPrisma.joinRequest.findUnique.mockResolvedValue({
        id: input.requestId,
        userId: 'user2',
        leagueId: 'league1',
        league: {
          userLeague: [{ userId: 'someoneElse', isAdmin: false }],
        },
      });

      await expect(service.updateStatus(adminId, input)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should update request status and add userLeague if accepted and not member', async () => {
      const request = {
        id: input.requestId,
        userId: 'user2',
        leagueId: 'league1',
        league: {
          userLeague: [{ userId: adminId, isAdmin: true }],
        },
      };

      mockPrisma.joinRequest.findUnique.mockResolvedValue(request);
      mockPrisma.joinRequest.update.mockResolvedValue({
        ...request,
        status: input.status,
        league: request.league,
      });
      mockPrisma.userLeague.findFirst.mockResolvedValue(null);
      mockPrisma.userLeague.create.mockResolvedValue({ id: 'ul1' });

      const result = await service.updateStatus(adminId, input);

      expect(mockPrisma.joinRequest.update).toHaveBeenCalledWith({
        where: { id: input.requestId },
        data: { status: input.status },
        include: { league: true },
      });

      expect(mockPrisma.userLeague.create).toHaveBeenCalledWith({
        data: {
          userId: request.userId,
          leagueId: request.leagueId,
          isAdmin: false,
          role: 'MEMBER',
        },
      });

      expect(result.status).toBe(input.status);
    });

    it('should update request status but not create userLeague if already member', async () => {
      const request = {
        id: input.requestId,
        userId: 'user2',
        leagueId: 'league1',
        league: {
          userLeague: [{ userId: adminId, isAdmin: true }],
        },
      };

      mockPrisma.joinRequest.findUnique.mockResolvedValue(request);
      mockPrisma.joinRequest.update.mockResolvedValue({
        ...request,
        status: input.status,
        league: request.league,
      });
      mockPrisma.userLeague.findFirst.mockResolvedValue({ id: 'ulExisting' });

      const result = await service.updateStatus(adminId, input);

      expect(mockPrisma.userLeague.create).not.toHaveBeenCalled();
      expect(result.status).toBe(input.status);
    });
  });

  describe('getPendingRequestsForLeague', () => {
    const leagueId = 'league1';
    const adminId = 'admin1';

    it('should throw ForbiddenException if user is not admin', async () => {
      mockPrisma.userLeague.findFirst.mockResolvedValue(null);

      await expect(
        service.getPendingRequestsForLeague(leagueId, adminId),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should return pending join requests if user is admin', async () => {
      mockPrisma.userLeague.findFirst.mockResolvedValue({
        userId: adminId,
        isAdmin: true,
      });
      const requests = [
        {
          id: 'req1',
          status: JoinRequestStatus.PENDING,
          user: { id: 'user1' },
        },
      ];
      mockPrisma.joinRequest.findMany.mockResolvedValue(requests);

      const result = await service.getPendingRequestsForLeague(
        leagueId,
        adminId,
      );

      expect(mockPrisma.joinRequest.findMany).toHaveBeenCalledWith({
        where: { leagueId, status: JoinRequestStatus.PENDING },
        include: { user: true },
      });
      expect(result).toEqual(requests);
    });
  });
});
