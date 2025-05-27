import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { TokenBlacklistService } from './services/token-blacklist.service';
import { PrismaService } from '../prisma.service';
import { JwtModule } from '@nestjs/jwt';

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let prismaService: PrismaService;
  // Array to track created test emails
  const testEmails: string[] = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test-secret-key',
          signOptions: { expiresIn: '1h' },
        }),
      ],
      providers: [
        AuthResolver,
        AuthService,
        PrismaService,
        {
          provide: TokenBlacklistService,
          useValue: {
            blacklist: jest.fn(),
            isBlacklisted: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
    prismaService = module.get<PrismaService>(PrismaService);

    // No need to clean up before each test as we're using timestamp-based emails
  });

  afterAll(async () => {
    // Clean up all test users created during tests
    if (testEmails.length > 0) {
      await prismaService.user.deleteMany({
        where: {
          email: {
            in: testEmails,
          },
        },
      });
    }
    await prismaService.$disconnect();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('AuthResolver', () => {
    it('should register a new user', async () => {
      const email = `test-${Date.now()}@example.com`; // Use unique email with timestamp
      testEmails.push(email); // Track the email for cleanup

      const registerInput = {
        email,
        password: 'password123',
        firstname: 'Test',
        lastname: 'User',
        apiAvatarId: 'avatar-id',
      };

      const result = await resolver.register(registerInput);

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('user');
      expect(result.user).toHaveProperty('email', registerInput.email);
      expect(result.user).toHaveProperty('firstname', registerInput.firstname);
      expect(result.user).toHaveProperty('lastname', registerInput.lastname);
    });

    it('should login an existing user', async () => {
      // First register a user with unique email
      const uniqueEmail = `login-test-${Date.now()}@example.com`;
      testEmails.push(uniqueEmail); // Track the email for cleanup

      const registerInput = {
        email: uniqueEmail,
        password: 'password123',
        firstname: 'Login',
        lastname: 'Test',
        apiAvatarId: 'avatar-id',
      };

      await resolver.register(registerInput);

      // Then try to login
      const loginInput = {
        email: uniqueEmail,
        password: 'password123',
      };

      const result = await resolver.login(loginInput);

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('user');
      expect(result.user).toHaveProperty('email', loginInput.email);
    });

    it('should logout a user and blacklist the token', async () => {
      // First login to get a token
      const uniqueEmail = `logout-test-${Date.now()}@example.com`;
      testEmails.push(uniqueEmail); // Track the email for cleanup

      // Register first
      await resolver.register({
        email: uniqueEmail,
        password: 'password123',
        firstname: 'Logout',
        lastname: 'Test',
      });

      const loginInput = {
        email: uniqueEmail,
        password: 'password123',
      };

      const loginResult = await resolver.login(loginInput);

      // Mock the request object with the token
      const req = {
        headers: {
          authorization: `Bearer ${loginResult.token}`,
        },
      };

      const result = await resolver.logout(req);

      expect(result).toBe(true);
    });

    it('should return false when trying to logout without a token', async () => {
      const req = {
        headers: {},
      };

      const result = await resolver.logout(req);

      expect(result).toBe(false);
    });
  });
});
