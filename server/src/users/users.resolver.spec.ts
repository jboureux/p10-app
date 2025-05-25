import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserFromJwt } from '../common/types/user-from-jwt.interface';
import { UpdateProfileInput } from './dto/update-profile.input';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  let service: UsersService;

  const mockUsersService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    updateProfile: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('updateProfile', () => {
    const mockUser: UserFromJwt = {
      userId: '1',
      email: 'test@example.com',
      role: 'USER',
    };

    const mockUpdatedUser = {
      id: '1',
      email: 'newemail@example.com',
      firstname: 'John',
      lastname: 'Doe',
      role: 'USER',
      apiAvatarId: 'avatar-1',
    };

    it('should update user profile successfully', async () => {
      const updateProfileInput: UpdateProfileInput = {
        email: 'newemail@example.com',
        firstname: 'John',
        lastname: 'Doe',
      };

      mockUsersService.updateProfile.mockResolvedValue(mockUpdatedUser);

      const result = await resolver.updateProfile(mockUser, updateProfileInput);

      expect(service.updateProfile).toHaveBeenCalledWith(
        mockUser.userId,
        updateProfileInput,
      );
      expect(result).toEqual(mockUpdatedUser);
    });

    it('should update user profile with password change', async () => {
      const updateProfileInput: UpdateProfileInput = {
        email: 'newemail@example.com',
        firstname: 'John',
        lastname: 'Doe',
        currentPassword: 'oldpassword123',
        newPassword: 'newpassword123',
      };

      mockUsersService.updateProfile.mockResolvedValue(mockUpdatedUser);

      const result = await resolver.updateProfile(mockUser, updateProfileInput);

      expect(service.updateProfile).toHaveBeenCalledWith(
        mockUser.userId,
        updateProfileInput,
      );
      expect(result).toEqual(mockUpdatedUser);
    });

    it('should throw error when trying to change password without current password', async () => {
      const updateProfileInput: UpdateProfileInput = {
        newPassword: 'newpassword123',
      };

      mockUsersService.updateProfile.mockRejectedValue(
        new BadRequestException(
          'Le mot de passe actuel est requis pour modifier le mot de passe',
        ),
      );

      await expect(
        resolver.updateProfile(mockUser, updateProfileInput),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw error when current password is incorrect', async () => {
      const updateProfileInput: UpdateProfileInput = {
        currentPassword: 'wrongpassword',
        newPassword: 'newpassword123',
      };

      mockUsersService.updateProfile.mockRejectedValue(
        new UnauthorizedException('Mot de passe actuel incorrect'),
      );

      await expect(
        resolver.updateProfile(mockUser, updateProfileInput),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
