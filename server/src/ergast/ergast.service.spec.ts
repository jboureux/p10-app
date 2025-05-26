import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ErgastService } from './ergast.service';
import { of, throwError } from 'rxjs';

describe('ErgastService', () => {
  let service: ErgastService;
  let httpService: HttpService;

  const mockHttpService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ErgastService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<ErgastService>(ErgastService);
    httpService = module.get<HttpService>(HttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getRaceResults', () => {
    it('should return race results and date', async () => {
      // Arrange
      const season = '2023';
      const round = '5';
      const mockResults = [
        {
          position: '1',
          Driver: { driverId: 'verstappen', familyName: 'Verstappen' },
          points: '25',
        },
        {
          position: '2',
          Driver: { driverId: 'perez', familyName: 'Pérez' },
          points: '18',
        },
      ];
      const mockDate = '2023-05-07';

      const mockResponse = {
        data: {
          MRData: {
            RaceTable: {
              Races: [
                {
                  Results: mockResults,
                  date: mockDate,
                },
              ],
            },
          },
        },
      };

      mockHttpService.get.mockReturnValue(of(mockResponse));

      // Act
      const result = await service.getRaceResults(season, round);

      // Assert
      expect(result).toEqual({
        results: mockResults,
        date: mockDate,
      });
      expect(mockHttpService.get).toHaveBeenCalledWith(
        `https://api.jolpi.ca/ergast/f1/${season}/${round}/results.json`,
      );
    });

    it('should return empty results when no race data found', async () => {
      // Arrange
      const season = '2023';
      const round = '5';
      const mockResponse = {
        data: {
          MRData: {
            RaceTable: {
              Races: [],
            },
          },
        },
      };

      mockHttpService.get.mockReturnValue(of(mockResponse));

      // Act
      const result = await service.getRaceResults(season, round);

      // Assert
      expect(result).toEqual({
        results: [],
        date: undefined,
      });
    });

    it('should handle missing MRData structure', async () => {
      // Arrange
      const season = '2023';
      const round = '5';
      const mockResponse = {
        data: {},
      };

      mockHttpService.get.mockReturnValue(of(mockResponse));

      // Act
      const result = await service.getRaceResults(season, round);

      // Assert
      expect(result).toEqual({
        results: [],
        date: undefined,
      });
    });

    it('should handle null response data', async () => {
      // Arrange
      const season = '2023';
      const round = '5';
      const mockResponse = {
        data: null,
      };

      mockHttpService.get.mockReturnValue(of(mockResponse));

      // Act
      const result = await service.getRaceResults(season, round);

      // Assert
      expect(result).toEqual({
        results: [],
        date: undefined,
      });
    });

    it('should handle race without Results', async () => {
      // Arrange
      const season = '2023';
      const round = '5';
      const mockDate = '2023-05-07';

      const mockResponse = {
        data: {
          MRData: {
            RaceTable: {
              Races: [
                {
                  date: mockDate,
                  // No Results property
                },
              ],
            },
          },
        },
      };

      mockHttpService.get.mockReturnValue(of(mockResponse));

      // Act
      const result = await service.getRaceResults(season, round);

      // Assert
      expect(result).toEqual({
        results: [],
        date: mockDate,
      });
    });
  });

  describe('getLatestRoundForDate', () => {
    it('should return round for matching date', async () => {
      // Arrange
      const season = '2023';
      const targetDate = new Date('2023-05-07T00:00:00.000Z');
      const expectedRound = '5';

      const mockResponse = {
        data: {
          MRData: {
            RaceTable: {
              Races: [
                { round: '4', date: '2023-04-30' },
                { round: expectedRound, date: '2023-05-07' },
                { round: '6', date: '2023-05-21' },
              ],
            },
          },
        },
      };

      mockHttpService.get.mockReturnValue(of(mockResponse));

      // Act
      const result = await service.getLatestRoundForDate(season, targetDate);

      // Assert
      expect(result).toBe(expectedRound);
      expect(mockHttpService.get).toHaveBeenCalledWith(
        `https://api.jolpi.ca/ergast/f1/${season}.json`,
      );
    });

    it('should return null when no matching date found', async () => {
      // Arrange
      const season = '2023';
      const targetDate = new Date('2023-12-25T00:00:00.000Z');

      const mockResponse = {
        data: {
          MRData: {
            RaceTable: {
              Races: [
                { round: '4', date: '2023-04-30' },
                { round: '5', date: '2023-05-07' },
                { round: '6', date: '2023-05-21' },
              ],
            },
          },
        },
      };

      mockHttpService.get.mockReturnValue(of(mockResponse));

      // Act
      const result = await service.getLatestRoundForDate(season, targetDate);

      // Assert
      expect(result).toBeNull();
    });

    it('should handle empty races array', async () => {
      // Arrange
      const season = '2023';
      const targetDate = new Date('2023-05-07T00:00:00.000Z');

      const mockResponse = {
        data: {
          MRData: {
            RaceTable: {
              Races: [],
            },
          },
        },
      };

      mockHttpService.get.mockReturnValue(of(mockResponse));

      // Act
      const result = await service.getLatestRoundForDate(season, targetDate);

      // Assert
      expect(result).toBeNull();
    });

    it('should handle missing MRData structure', async () => {
      // Arrange
      const season = '2023';
      const targetDate = new Date('2023-05-07T00:00:00.000Z');

      const mockResponse = {
        data: {},
      };

      mockHttpService.get.mockReturnValue(of(mockResponse));

      // Act
      const result = await service.getLatestRoundForDate(season, targetDate);

      // Assert
      expect(result).toBeNull();
    });

    it('should handle null response data', async () => {
      // Arrange
      const season = '2023';
      const targetDate = new Date('2023-05-07T00:00:00.000Z');

      const mockResponse = {
        data: null,
      };

      mockHttpService.get.mockReturnValue(of(mockResponse));

      // Act
      const result = await service.getLatestRoundForDate(season, targetDate);

      // Assert
      expect(result).toBeNull();
    });

    it('should match date using UTC comparison', async () => {
      // Arrange
      const season = '2023';
      // Create date with different timezone but same UTC date
      const targetDate = new Date('2023-05-07T14:30:00.000Z');
      const expectedRound = '5';

      const mockResponse = {
        data: {
          MRData: {
            RaceTable: {
              Races: [{ round: expectedRound, date: '2023-05-07' }],
            },
          },
        },
      };

      mockHttpService.get.mockReturnValue(of(mockResponse));

      // Act
      const result = await service.getLatestRoundForDate(season, targetDate);

      // Assert
      expect(result).toBe(expectedRound);
    });

    it('should return first matching round when multiple races on same date', async () => {
      // Arrange
      const season = '2023';
      const targetDate = new Date('2023-05-07T00:00:00.000Z');
      const expectedRound = '5';

      const mockResponse = {
        data: {
          MRData: {
            RaceTable: {
              Races: [
                { round: expectedRound, date: '2023-05-07' },
                { round: '6', date: '2023-05-07' }, // Same date, different round
              ],
            },
          },
        },
      };

      mockHttpService.get.mockReturnValue(of(mockResponse));

      // Act
      const result = await service.getLatestRoundForDate(season, targetDate);

      // Assert
      expect(result).toBe(expectedRound);
    });
  });

  describe('Error handling', () => {
    it('should propagate HTTP errors from getRaceResults', async () => {
      // Arrange
      const error = new Error('Network error');
      mockHttpService.get.mockReturnValue(throwError(() => error));

      // Act & Assert
      await expect(service.getRaceResults('2023', '5')).rejects.toThrow(
        'Network error',
      );
    });

    it('should propagate HTTP errors from getLatestRoundForDate', async () => {
      // Arrange
      const error = new Error('API error');
      mockHttpService.get.mockReturnValue(throwError(() => error));

      // Act & Assert
      await expect(
        service.getLatestRoundForDate('2023', new Date()),
      ).rejects.toThrow('API error');
    });
  });
});
