import { Test, TestingModule } from '@nestjs/testing';
import { BetSelectionResultService } from './bet-selection-result.service';
import { PrismaService } from '../prisma.service';

describe('BetSelectionResultService', () => {
  let service: BetSelectionResultService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BetSelectionResultService,
        {
          provide: PrismaService,
          useValue: {
            grandPrix: { findUnique: jest.fn() },
            grandPrixPilote: { findUnique: jest.fn() },
            betSelectionResult: {
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<BetSelectionResultService>(BetSelectionResultService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
