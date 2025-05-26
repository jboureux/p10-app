/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma.service';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  const mockPrismaService = {
    user: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all users without passwords', async () => {
      const users = [{ id: '1', email: 'a@b.com' }];
      mockPrismaService.user.findMany.mockResolvedValue(users);

      const result = await service.findAll();

      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          email: true,
          firstname: true,
          lastname: true,
          role: true,
          apiAvatarId: true,
          password: false,
        },
      });
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return one user by id without password', async () => {
      const user = { id: '1', email: 'a@b.com' };
      mockPrismaService.user.findFirst.mockResolvedValue(user);

      const result = await service.findOne('1');

      expect(mockPrismaService.user.findFirst).toHaveBeenCalledWith({
        where: { id: '1' },
        select: {
          id: true,
          email: true,
          firstname: true,
          lastname: true,
          role: true,
          apiAvatarId: true,
          password: false,
        },
      });
      expect(result).toEqual(user);
    });
  });

  describe('update', () => {
    it('should hash password if provided and update user', async () => {
      const updateInput = { id: '1', firstname: 'John', password: 'pass123' };
      const hashedPass = 'hashedPass';

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPass);

      const updatedUser = { id: '1', firstname: 'John' };
      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.update('1', updateInput);

      expect(bcrypt.hash).toHaveBeenCalledWith('pass123', 10);

      // Vérifier l'appel complet avec les valeurs exactes
      const updateCall = mockPrismaService.user.update.mock.calls[0][0];

      expect(updateCall.where).toEqual({ id: '1' });
      expect(updateCall.data).toEqual(
        expect.objectContaining({
          firstname: 'John',
          password: hashedPass,
        }),
      );
      expect(updateCall.select).toEqual({
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        role: true,
        apiAvatarId: true,
        password: false,
      });

      expect(result).toEqual(updatedUser);
    });
  });
  describe('updateProfile', () => {
    const userId = 'user-1';

    it('should throw UnauthorizedException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.updateProfile(userId, {})).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw BadRequestException if newPassword provided without currentPassword', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ password: 'hash' });

      await expect(
        service.updateProfile(userId, { newPassword: 'newpass' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw UnauthorizedException if currentPassword invalid', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ password: 'hash' });
      // Correction: Cast correct pour bcrypt.compare
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.updateProfile(userId, {
          currentPassword: 'wrongpass',
          newPassword: 'newpass',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should hash newPassword and update user', async () => {
      const user = { password: 'hash' };
      mockPrismaService.user.findUnique.mockResolvedValue(user);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedNewPass');
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const input = {
        email: 'new@example.com',
        firstname: 'Jane',
        lastname: 'Doe',
        currentPassword: 'oldpass',
        newPassword: 'newpass',
      };
      const updatedUser = { id: userId, email: 'new@example.com' };
      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.updateProfile(userId, input);

      expect(bcrypt.compare).toHaveBeenCalledWith('oldpass', user.password);
      expect(bcrypt.hash).toHaveBeenCalledWith('newpass', 10);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: {
          email: input.email,
          firstname: input.firstname,
          lastname: input.lastname,
          password: 'hashedNewPass',
        },
        select: {
          id: true,
          email: true,
          firstname: true,
          lastname: true,
          role: true,
          apiAvatarId: true,
          password: false,
        },
      });
      expect(result).toEqual(updatedUser);
    });

    it('should update user profile without password if newPassword not provided', async () => {
      const user = { password: 'hash' };
      mockPrismaService.user.findUnique.mockResolvedValue(user);

      const input = {
        email: 'partial@example.com',
        firstname: 'Partial',
      };
      const updatedUser = { id: userId, email: 'partial@example.com' };
      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.updateProfile(userId, input);

      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: {
          email: input.email,
          firstname: input.firstname,
        },
        select: {
          id: true,
          email: true,
          firstname: true,
          lastname: true,
          role: true,
          apiAvatarId: true,
          password: false,
        },
      });
      expect(result).toEqual(updatedUser);
    });
  });

  describe('remove', () => {
    it('should delete user by id', async () => {
      const deletedUser = { id: '1', email: 'delete@user.com' };
      mockPrismaService.user.delete.mockResolvedValue(deletedUser);

      const result = await service.remove('1');

      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(deletedUser);
    });
  });
});
