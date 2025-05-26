import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { BetSelectionResultService } from './bet-selection-result.service';
import { PrismaService } from '../prisma.service';
import { CreateBetSelectionResultInput } from './dto/create-bet-selection-result';

describe('BetSelectionResultService', () => {
  let service: BetSelectionResultService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    betSelectionResult: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    grandPrix: {
      findUnique: jest.fn(),
    },
    grandPrixPilote: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BetSelectionResultService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<BetSelectionResultService>(BetSelectionResultService);
    prismaService = module.get<PrismaService>(PrismaService);

    // 🛠️ Supprimer les erreurs attendues dans la console
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('create', () => {
    const userId = 'user-123';
    const input: CreateBetSelectionResultInput = {
      grandPrixId: 'gp-456',
      grandPrixPiloteId: 'gpp-789',
    };

    const mockGrandPrix = {
      idApiRaces: 'gp-456',
      name: 'Monaco Grand Prix',
      date: new Date(),
    };

    const mockGrandPrixPilote = {
      id: 'gpp-789',
      piloteId: 'pilot-123',
      grandPrixId: 'gp-456',
    };

    const mockCreatedBet = {
      id: 'bet-001',
      pointP10: 0,
      userId: userId,
      grandPrixId: 'gp-456',
      grandPrixPiloteId: 'gpp-789',
      user: { id: userId, name: 'Test User' },
      grandPrix: mockGrandPrix,
      grandPrixPilote: mockGrandPrixPilote,
    };

    describe('when bet creation is successful', () => {
      beforeEach(() => {
        mockPrismaService.betSelectionResult.findFirst.mockResolvedValue(null);
        mockPrismaService.grandPrix.findUnique.mockResolvedValue(mockGrandPrix);
        mockPrismaService.grandPrixPilote.findUnique.mockResolvedValue(
          mockGrandPrixPilote,
        );
        mockPrismaService.betSelectionResult.create.mockResolvedValue(
          mockCreatedBet,
        );
      });

      it('should create a new bet selection result successfully', async () => {
        const result = await service.create(userId, input);

        expect(result).toEqual(mockCreatedBet);
        expect(
          mockPrismaService.betSelectionResult.findFirst,
        ).toHaveBeenCalledWith({
          where: {
            userId: userId,
            grandPrix: { idApiRaces: input.grandPrixId },
          },
        });
        expect(mockPrismaService.grandPrix.findUnique).toHaveBeenCalledWith({
          where: { idApiRaces: input.grandPrixId },
        });
        expect(
          mockPrismaService.grandPrixPilote.findUnique,
        ).toHaveBeenCalledWith({
          where: { id: input.grandPrixPiloteId },
        });
        expect(
          mockPrismaService.betSelectionResult.create,
        ).toHaveBeenCalledWith({
          data: {
            pointP10: 0,
            user: { connect: { id: userId } },
            grandPrix: { connect: { idApiRaces: input.grandPrixId } },
            grandPrixPilote: { connect: { id: input.grandPrixPiloteId } },
          },
          include: {
            user: true,
            grandPrix: true,
            grandPrixPilote: true,
          },
        });
      });

      it('should call all required Prisma methods in the correct order', async () => {
        await service.create(userId, input);

        const findFirstCall =
          mockPrismaService.betSelectionResult.findFirst.mock
            .invocationCallOrder[0];
        const findGrandPrixCall =
          mockPrismaService.grandPrix.findUnique.mock.invocationCallOrder[0];
        const findGrandPrixPiloteCall =
          mockPrismaService.grandPrixPilote.findUnique.mock
            .invocationCallOrder[0];
        const createCall =
          mockPrismaService.betSelectionResult.create.mock
            .invocationCallOrder[0];

        expect(findFirstCall).toBeLessThan(findGrandPrixCall);
        expect(findGrandPrixCall).toBeLessThan(findGrandPrixPiloteCall);
        expect(findGrandPrixPiloteCall).toBeLessThan(createCall);
      });
    });

    describe('when user has already bet on this Grand Prix', () => {
      beforeEach(() => {
        mockPrismaService.betSelectionResult.findFirst.mockResolvedValue({
          id: 'existing-bet',
          userId: userId,
          grandPrixId: input.grandPrixId,
        });
      });

      it('should throw ConflictException', async () => {
        await expect(service.create(userId, input)).rejects.toThrow(
          new ConflictException('User has already bet on this Grand Prix.'),
        );

        expect(
          mockPrismaService.betSelectionResult.findFirst,
        ).toHaveBeenCalledWith({
          where: {
            userId: userId,
            grandPrix: { idApiRaces: input.grandPrixId },
          },
        });
        expect(mockPrismaService.grandPrix.findUnique).not.toHaveBeenCalled();
        expect(
          mockPrismaService.grandPrixPilote.findUnique,
        ).not.toHaveBeenCalled();
        expect(
          mockPrismaService.betSelectionResult.create,
        ).not.toHaveBeenCalled();
      });
    });

    describe('when Grand Prix is not found', () => {
      beforeEach(() => {
        mockPrismaService.betSelectionResult.findFirst.mockResolvedValue(null);
        mockPrismaService.grandPrix.findUnique.mockResolvedValue(null);
      });

      it('should throw NotFoundException for Grand Prix', async () => {
        await expect(service.create(userId, input)).rejects.toThrow(
          new NotFoundException('Grand Prix introuvable.'),
        );

        expect(
          mockPrismaService.betSelectionResult.findFirst,
        ).toHaveBeenCalled();
        expect(mockPrismaService.grandPrix.findUnique).toHaveBeenCalledWith({
          where: { idApiRaces: input.grandPrixId },
        });
        expect(
          mockPrismaService.grandPrixPilote.findUnique,
        ).not.toHaveBeenCalled();
        expect(
          mockPrismaService.betSelectionResult.create,
        ).not.toHaveBeenCalled();
      });
    });

    describe('when Grand Prix Pilote is not found', () => {
      beforeEach(() => {
        mockPrismaService.betSelectionResult.findFirst.mockResolvedValue(null);
        mockPrismaService.grandPrix.findUnique.mockResolvedValue(mockGrandPrix);
        mockPrismaService.grandPrixPilote.findUnique.mockResolvedValue(null);
      });

      it('should throw NotFoundException for Grand Prix Pilote', async () => {
        await expect(service.create(userId, input)).rejects.toThrow(
          new NotFoundException('Grand Prix Pilote introuvable.'),
        );

        expect(
          mockPrismaService.betSelectionResult.findFirst,
        ).toHaveBeenCalled();
        expect(mockPrismaService.grandPrix.findUnique).toHaveBeenCalled();
        expect(
          mockPrismaService.grandPrixPilote.findUnique,
        ).toHaveBeenCalledWith({
          where: { id: input.grandPrixPiloteId },
        });
        expect(
          mockPrismaService.betSelectionResult.create,
        ).not.toHaveBeenCalled();
      });
    });
  });
});
