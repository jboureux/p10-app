import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma.service';
import { UpdateProfileInput } from './dto/update-profile.input';
import { UpdateUserInput } from './dto/update-user.input';
//Note : la création d'utilisateur est déléguée à AuthResolver.register
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.user.findMany({
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
  }

  findOne(id: string) {
    return this.prisma.user.findFirst({
      where: { id: id },
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
  }

  async update(id: string, updateUserInput: UpdateUserInput) {
    const updateData = { ...updateUserInput };

    // Si un mot de passe est fourni, le hacher avant la mise à jour
    if (updateUserInput.password) {
      updateData.password = await bcrypt.hash(updateUserInput.password, 10);
    }

    return await this.prisma.user.update({
      where: {
        id: id,
      },
      data: updateData,
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
  }

  async updateProfile(userId: string, updateProfileInput: UpdateProfileInput) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    // Si un nouveau mot de passe est fourni, vérifier le mot de passe actuel
    if (updateProfileInput.newPassword) {
      if (!updateProfileInput.currentPassword) {
        throw new BadRequestException(
          'Le mot de passe actuel est requis pour modifier le mot de passe',
        );
      }

      const isCurrentPasswordValid = await bcrypt.compare(
        updateProfileInput.currentPassword,
        user.password,
      );

      if (!isCurrentPasswordValid) {
        throw new UnauthorizedException('Mot de passe actuel incorrect');
      }
    }

    // Préparer les données de mise à jour
    const updateData: {
      email?: string;
      firstname?: string;
      lastname?: string;
      password?: string;
    } = {};

    if (updateProfileInput.email) {
      updateData.email = updateProfileInput.email;
    }

    if (updateProfileInput.firstname) {
      updateData.firstname = updateProfileInput.firstname;
    }

    if (updateProfileInput.lastname) {
      updateData.lastname = updateProfileInput.lastname;
    }

    if (updateProfileInput.newPassword) {
      updateData.password = await bcrypt.hash(
        updateProfileInput.newPassword,
        10,
      );
    }

    // Mettre à jour l'utilisateur
    return await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        role: true,
        apiAvatarId: true,
        // Exclure explicitement le mot de passe
        password: false,
      },
    });
  }

  async remove(id: string) {
    return await this.prisma.user.delete({ where: { id: id } });
  }
}
