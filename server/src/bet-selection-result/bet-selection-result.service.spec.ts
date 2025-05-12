import { Test, TestingModule } from '@nestjs/testing';
import { BetSelectionResultService } from './bet-selection-result.service';

describe('BetSelectionResultService', () => {
  let service: BetSelectionResultService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BetSelectionResultService],
    }).compile();

    service = module.get<BetSelectionResultService>(BetSelectionResultService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
