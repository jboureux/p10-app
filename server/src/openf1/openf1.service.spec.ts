import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { OpenF1Service } from './openf1.service';
import { of, throwError } from 'rxjs'; // Ajout de throwError

describe('OpenF1Service', () => {
  let service: OpenF1Service;
  let httpService: HttpService;

  const mockHttpService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpenF1Service,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<OpenF1Service>(OpenF1Service);
    httpService = module.get<HttpService>(HttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCurrentMeetings', () => {
    it('should return current meetings within +/- 7 days', async () => {
      // Arrange
      const mockMeetings = [
        { meeting_key: 1, meeting_name: 'Bahrain Grand Prix' },
        { meeting_key: 2, meeting_name: 'Saudi Arabian Grand Prix' },
      ];
      const mockResponse = { data: mockMeetings };

      mockHttpService.get.mockReturnValue(of(mockResponse));

      // Act
      const result = await service.getCurrentMeetings();

      // Assert
      expect(result).toEqual(mockMeetings);
      expect(mockHttpService.get).toHaveBeenCalledTimes(1);

      const calledUrl = mockHttpService.get.mock.calls[0][0];
      expect(calledUrl).toContain('https://api.openf1.org/v1/meetings');
      expect(calledUrl).toContain('date_start>=');
      expect(calledUrl).toContain('date_start<=');
    });

    it('should call API with correct date range', async () => {
      // Arrange
      const mockResponse = { data: [] };
      mockHttpService.get.mockReturnValue(of(mockResponse));

      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneWeekAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      // Act
      await service.getCurrentMeetings();

      // Assert
      const calledUrl = mockHttpService.get.mock.calls[0][0];
      expect(calledUrl).toContain(oneWeekAgo.toISOString().split('T')[0]); // Check date part
      expect(calledUrl).toContain(oneWeekAhead.toISOString().split('T')[0]); // Check date part
    });

    it('should handle empty response', async () => {
      // Arrange
      const mockResponse = { data: [] };
      mockHttpService.get.mockReturnValue(of(mockResponse));

      // Act
      const result = await service.getCurrentMeetings();

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('getLatestRaceSession', () => {
    it('should return session key for race session', async () => {
      // Arrange
      const meetingKey = 123;
      const expectedSessionKey = 456;
      const mockResponse = {
        data: [{ session_key: expectedSessionKey, session_name: 'Race' }],
      };

      mockHttpService.get.mockReturnValue(of(mockResponse));

      // Act
      const result = await service.getLatestRaceSession(meetingKey);

      // Assert
      expect(result).toBe(expectedSessionKey);
      expect(mockHttpService.get).toHaveBeenCalledWith(
        `https://api.openf1.org/v1/sessions?meeting_key=${meetingKey}&session_name=Race`,
      );
    });

    it('should return undefined when no race session found', async () => {
      // Arrange
      const meetingKey = 123;
      const mockResponse = { data: [] };

      mockHttpService.get.mockReturnValue(of(mockResponse));

      // Act
      const result = await service.getLatestRaceSession(meetingKey);

      // Assert
      expect(result).toBeUndefined();
    });

    it('should return undefined when data is null', async () => {
      // Arrange
      const meetingKey = 123;
      const mockResponse = { data: null };

      mockHttpService.get.mockReturnValue(of(mockResponse));

      // Act
      const result = await service.getLatestRaceSession(meetingKey);

      // Assert
      expect(result).toBeUndefined();
    });

    it('should return session key from first element when multiple sessions', async () => {
      // Arrange
      const meetingKey = 123;
      const expectedSessionKey = 456;
      const mockResponse = {
        data: [
          { session_key: expectedSessionKey, session_name: 'Race' },
          { session_key: 789, session_name: 'Race' },
        ],
      };

      mockHttpService.get.mockReturnValue(of(mockResponse));

      // Act
      const result = await service.getLatestRaceSession(meetingKey);

      // Assert
      expect(result).toBe(expectedSessionKey);
    });
  });

  describe('getDrivers', () => {
    it('should return drivers for a session', async () => {
      // Arrange
      const sessionKey = 456;
      const mockDrivers = [
        { driver_number: 1, name_acronym: 'VER', full_name: 'Max Verstappen' },
        { driver_number: 11, name_acronym: 'PER', full_name: 'Sergio Pérez' },
        { driver_number: 44, name_acronym: 'HAM', full_name: 'Lewis Hamilton' },
      ];
      const mockResponse = { data: mockDrivers };

      mockHttpService.get.mockReturnValue(of(mockResponse));

      // Act
      const result = await service.getDrivers(sessionKey);

      // Assert
      expect(result).toEqual(mockDrivers);
      expect(mockHttpService.get).toHaveBeenCalledWith(
        `https://api.openf1.org/v1/drivers?session_key=${sessionKey}`,
      );
    });

    it('should return empty array when no drivers found', async () => {
      // Arrange
      const sessionKey = 456;
      const mockResponse = { data: [] };

      mockHttpService.get.mockReturnValue(of(mockResponse));

      // Act
      const result = await service.getDrivers(sessionKey);

      // Assert
      expect(result).toEqual([]);
    });

    it('should handle null data response', async () => {
      // Arrange
      const sessionKey = 456;
      const mockResponse = { data: null };

      mockHttpService.get.mockReturnValue(of(mockResponse));

      // Act
      const result = await service.getDrivers(sessionKey);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('Error handling', () => {
    it('should propagate HTTP errors from getCurrentMeetings', async () => {
      // Arrange
      const error = new Error('Network error');
      // CORRECTION : Utiliser throwError au lieu de of().pipe()
      mockHttpService.get.mockReturnValue(throwError(() => error));

      // Act & Assert
      await expect(service.getCurrentMeetings()).rejects.toThrow(
        'Network error',
      );
    });

    it('should propagate HTTP errors from getLatestRaceSession', async () => {
      // Arrange
      const error = new Error('API error');
      // CORRECTION : Utiliser throwError au lieu de of().pipe()
      mockHttpService.get.mockReturnValue(throwError(() => error));

      // Act & Assert
      await expect(service.getLatestRaceSession(123)).rejects.toThrow(
        'API error',
      );
    });

    it('should propagate HTTP errors from getDrivers', async () => {
      // Arrange
      const error = new Error('Server error');
      // CORRECTION : Utiliser throwError au lieu de of().pipe()
      mockHttpService.get.mockReturnValue(throwError(() => error));

      // Act & Assert
      await expect(service.getDrivers(456)).rejects.toThrow('Server error');
    });
  });
});
