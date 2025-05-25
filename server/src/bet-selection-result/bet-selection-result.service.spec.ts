import { Test, TestingModule } from '@nestjs/testing';
import { BetsSelectionResultService } from './bet-selection-result.service';

describe('BetSelectionResultService', () => {
  let service: BetsSelectionResultService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BetsSelectionResultService],
    }).compile();

    service = module.get<BetsSelectionResultService>(BetsSelectionResultService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
