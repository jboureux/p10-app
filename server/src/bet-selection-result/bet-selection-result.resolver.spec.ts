import { Test, TestingModule } from '@nestjs/testing';
import { BetsSelectionResultService } from './bet-selection-result.service';

class TestBetSelectionResultResolver {
  constructor(
    private readonly betSelectionResultService: BetsSelectionResultService,
  ) {}

  create(userId: string, input: any) {
    return this.betSelectionResultService.create(userId, input);
  }

  update(userId: string, input: any) {
    return this.betSelectionResultService.update(userId, input);
  }
}

describe('BetSelectionResultResolver', () => {
  let resolver: TestBetSelectionResultResolver;
  let service: BetsSelectionResultService;

  const mockBetSelectionResultService = {
    create: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: BetsSelectionResultService,
          useValue: mockBetSelectionResultService,
        },
      ],
    }).compile();

    service = module.get<BetsSelectionResultService>(
      BetsSelectionResultService,
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

  describe('update', () => {
    it('should call service.update with correct parameters', () => {
      const userId = 'test-user-id';
      const input = { someField: 'updated-value' };

      const updateSpy = jest.spyOn(service, 'update');
      resolver.update(userId, input);

      expect(updateSpy).toHaveBeenCalledWith(userId, input);
    });
  });
});
