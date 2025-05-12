import { Test, TestingModule } from '@nestjs/testing';
import { BetSelectionResultResolver } from './bet-selection-result.resolver';

describe('BetSelectionResultResolver', () => {
  let resolver: BetSelectionResultResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BetSelectionResultResolver],
    }).compile();

    resolver = module.get<BetSelectionResultResolver>(BetSelectionResultResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
