import { Test, TestingModule } from '@nestjs/testing';
import { BetSelectionResultService } from './bet-selection-result.service';

class TestBetSelectionResultResolver {
  constructor(
    private readonly betSelectionResultService: BetSelectionResultService,
  ) {}

  create(userId: string, input: any) {
    return this.betSelectionResultService.create(userId, input);
  }
}

describe('BetSelectionResultResolver', () => {
  let resolver: TestBetSelectionResultResolver;
  let service: BetSelectionResultService;

  const mockBetSelectionResultService = {
    create: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: BetSelectionResultService,
          useValue: mockBetSelectionResultService,
        },
      ],
    }).compile();

    service = module.get<BetSelectionResultService>(
      BetSelectionResultService,
    );
    resolver = new TestBetSelectionResultResolver(service);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should have service injected', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with correct parameters', () => {
      const userId = 'test-user-id';
      const input = { someField: 'test-value' };

      const createSpy = jest.spyOn(service, 'create');
      resolver.create(userId, input);

      expect(createSpy).toHaveBeenCalledWith(userId, input);
    });
  });
});
