import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserInput: CreateUserInput) {
    return await this.prisma.user.create({ data: createUserInput });
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  findOne(id: string) {
    return this.prisma.user.findFirst({ where: { id: id } });
  }

  async update(id: string, updateUserInput: UpdateUserInput) {
    return await this.prisma.user.update({
      where: {
        id: id,
      },
      data: updateUserInput,
    });
  }

  async remove(id: string) {
    return await this.prisma.user.delete({ where: { id: id } });
  }
}
