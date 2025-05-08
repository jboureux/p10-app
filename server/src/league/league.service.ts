import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateLeagueInput } from './dto/create-league.input';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LeagueService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createLeagueInput: CreateLeagueInput, creatorId: string) {
    const sharedLink = uuidv4();

    const league = await this.prisma.league.create({
      data: {
        name: createLeagueInput.name,
        isPrivate: createLeagueInput.isPrivate,
        isActive: true,
        apiAvatarId: createLeagueInput.apiAvatarId,
        sharedLink,
        userLeague: {
          create: {
            userId: creatorId,
            isAdmin: true,
            role: "ADMIN",
          },
        },
      },
    });

    return league;
  }
}