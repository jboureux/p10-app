import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma.service';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import * as bcrypt from 'bcryptjs';

// Mock bcrypt
jest.mock('bcryptjs');
const bcryptMock = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerInput: RegisterInput = {
      email: 'test@example.com',
      password: 'password123',
      firstname: 'John',
      lastname: 'Doe',
    };

    it('should successfully register a new user', async () => {
      // Arrange
      const hashedPassword = 'hashedPassword123';
      const mockUser = {
        id: '1',
        email: registerInput.email,
        password: hashedPassword,
        firstname: registerInput.firstname,
        lastname: registerInput.lastname,
        role: 'USER',
        apiAvatarId: 'avatar-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const mockToken = 'jwt-token';

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      (bcryptMock.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockPrismaService.user.create.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue(mockToken);

      // Act
      const result = await service.register(registerInput);

      // Assert
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: registerInput.email },
      });
      expect(bcryptMock.hash).toHaveBeenCalledWith(registerInput.password, 10);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: registerInput.email,
          password: hashedPassword,
          firstname: registerInput.firstname,
          lastname: registerInput.lastname,
          role: 'USER',
          apiAvatarId: 'avatar-id',
        },
      });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      });
      expect(result).toEqual({
        token: mockToken,
        user: mockUser,
      });
    });

    it('should throw ConflictException when user already exists', async () => {
      // Arrange
      const existingUser = {
        id: '1',
        email: registerInput.email,
        password: 'existingPassword',
        firstname: 'Existing',
        lastname: 'User',
        role: 'USER',
        apiAvatarId: 'existing-avatar',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);

      // Act & Assert
      await expect(service.register(registerInput)).rejects.toThrow(
        new ConflictException('Email déjà utilisé'),
      );
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: registerInput.email },
      });
      expect(bcryptMock.hash).not.toHaveBeenCalled();
      expect(mockPrismaService.user.create).not.toHaveBeenCalled();
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });

    it('should handle database errors during user creation', async () => {
      // Arrange
      const hashedPassword = 'hashedPassword123';
      const dbError = new Error('Database connection failed');

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      (bcryptMock.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockPrismaService.user.create.mockRejectedValue(dbError);

      // Act & Assert
      await expect(service.register(registerInput)).rejects.toThrow(dbError);
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });

    it('should handle bcrypt hashing errors', async () => {
      // Arrange
      const hashError = new Error('Hashing failed');

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      (bcryptMock.hash as jest.Mock).mockRejectedValue(hashError);

      // Act & Assert
      await expect(service.register(registerInput)).rejects.toThrow(hashError);
      expect(mockPrismaService.user.create).not.toHaveBeenCalled();
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const loginInput: LoginInput = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should successfully login with valid credentials', async () => {
      // Arrange
      const hashedPassword = 'hashedPassword123';
      const mockUser = {
        id: '1',
        email: loginInput.email,
        password: hashedPassword,
        firstname: 'John',
        lastname: 'Doe',
        role: 'USER',
        apiAvatarId: 'avatar-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const mockToken = 'jwt-token';

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcryptMock.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue(mockToken);

      // Act
      const result = await service.login(loginInput);

      // Assert
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginInput.email },
      });
      expect(bcryptMock.compare).toHaveBeenCalledWith(
        loginInput.password,
        hashedPassword,
      );
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      });
      expect(result).toEqual({
        token: mockToken,
        user: mockUser,
      });
    });

    it('should throw UnauthorizedException when user does not exist', async () => {
      // Arrange
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.login(loginInput)).rejects.toThrow(
        new UnauthorizedException('Email ou mot de passe incorrect'),
      );
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginInput.email },
      });
      expect(bcryptMock.compare).not.toHaveBeenCalled();
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when user has no password', async () => {
      // Arrange
      const mockUser = {
        id: '1',
        email: loginInput.email,
        password: null,
        firstname: 'John',
        lastname: 'Doe',
        role: 'USER',
        apiAvatarId: 'avatar-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      // Act & Assert
      await expect(service.login(loginInput)).rejects.toThrow(
        new UnauthorizedException('Email ou mot de passe incorrect'),
      );
      expect(bcryptMock.compare).not.toHaveBeenCalled();
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      // Arrange
      const hashedPassword = 'hashedPassword123';
      const mockUser = {
        id: '1',
        email: loginInput.email,
        password: hashedPassword,
        firstname: 'John',
        lastname: 'Doe',
        role: 'USER',
        apiAvatarId: 'avatar-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcryptMock.compare as jest.Mock).mockResolvedValue(false);

      // Act & Assert
      await expect(service.login(loginInput)).rejects.toThrow(
        new UnauthorizedException('Email ou mot de passe incorrect'),
      );
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginInput.email },
      });
      expect(bcryptMock.compare).toHaveBeenCalledWith(
        loginInput.password,
        hashedPassword,
      );
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });

    it('should handle database errors during user lookup', async () => {
      // Arrange
      const dbError = new Error('Database connection failed');
      mockPrismaService.user.findUnique.mockRejectedValue(dbError);

      // Act & Assert
      await expect(service.login(loginInput)).rejects.toThrow(dbError);
      expect(bcryptMock.compare).not.toHaveBeenCalled();
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });

    it('should handle bcrypt comparison errors', async () => {
      // Arrange
      const hashedPassword = 'hashedPassword123';
      const mockUser = {
        id: '1',
        email: loginInput.email,
        password: hashedPassword,
        firstname: 'John',
        lastname: 'Doe',
        role: 'USER',
        apiAvatarId: 'avatar-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const compareError = new Error('Bcrypt comparison failed');

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcryptMock.compare as jest.Mock).mockRejectedValue(compareError);

      // Act & Assert
      await expect(service.login(loginInput)).rejects.toThrow(compareError);
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });
  });

  describe('JWT token generation', () => {
    it('should generate token with correct payload structure', async () => {
      // Arrange
      const registerInput: RegisterInput = {
        email: 'test@example.com',
        password: 'password123',
        firstname: 'John',
        lastname: 'Doe',
      };
      const mockUser = {
        id: '123',
        email: registerInput.email,
        password: 'hashedPassword',
        firstname: registerInput.firstname,
        lastname: registerInput.lastname,
        role: 'USER',
        apiAvatarId: 'avatar-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      (bcryptMock.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockPrismaService.user.create.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('token');

      // Act
      await service.register(registerInput);

      // Assert
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: '123',
        email: 'test@example.com',
        role: 'USER',
      });
    });
  });
});
