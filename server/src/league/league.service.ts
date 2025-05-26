import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import ShortUniqueId from 'short-unique-id';
import { PrismaService } from '../prisma.service';
import { CreateLeagueInput } from './dto/create-league.input';

@Injectable()
export class LeagueService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
  ) {}

  async create(createLeagueInput: CreateLeagueInput, creatorId: string) {
    const { randomUUID } = new ShortUniqueId({ length: 6 });
    const sharedLink = randomUUID().toUpperCase();

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
            role: 'ADMIN',
          },
        },
      },
      include: {
        userLeague: {
          include: {
            user: true, // ← pour `user { id }` dans GraphQL
          },
        },
      },
    });
    console.log(JSON.stringify(league, null, 2));

    return league;
  }

  async deleteLeague(leagueId: string, userId: string): Promise<boolean> {
    const league = await this.prisma.league.findUnique({
      where: { id: leagueId },
      include: {
        userLeague: true,
      },
    });

    if (!league) {
      throw new NotFoundException('Ligue introuvable');
    }

    const isAdmin = league.userLeague.some(
      (ul) => ul.userId === userId && ul.isAdmin,
    );

    if (!isAdmin) {
      throw new ForbiddenException(
        "Seul l'administrateur peut supprimer la ligue",
      );
    }

    await this.prisma.league.delete({
      where: { id: leagueId },
    });

    return true;
  }

  async leaveLeague(leagueId: string, userId: string): Promise<boolean> {
    const league = await this.prisma.league.findUnique({
      where: { id: leagueId },
      include: { userLeague: true },
    });

    if (!league) {
      throw new NotFoundException('Ligue introuvable');
    }

    const current = league.userLeague.find((ul) => ul.userId === userId);
    if (!current) {
      throw new ForbiddenException("Vous n'êtes pas membre de cette ligue");
    }

    const otherMembers = league.userLeague.filter((ul) => ul.userId !== userId);

    // Supprimer le lien UserLeague du quittant
    await this.prisma.userLeague.delete({
      where: { id: current.id },
    });

    if (current.isAdmin) {
      if (otherMembers.length < 1) {
        // Plus personne → on supprime la ligue
        await this.prisma.league.delete({
          where: { id: leagueId },
        });
      } else {
        // Transfert aléatoire de rôle admin
        const newAdmin =
          otherMembers[Math.floor(Math.random() * otherMembers.length)];
        await this.prisma.userLeague.update({
          where: { id: newAdmin.id },
          data: { isAdmin: true, role: 'ADMIN' },
        });

        // await this.pubSub.publish('leagueAdminPromoted', {
        //   leagueAdminPromoted: {
        //     userId: newAdmin.userId,
        //     leagueId,
        //     leagueName: league.name,
        //   },
        // });
      }
    }

    return true;
  }

  async getMyLeagues(userId: string) {
    return this.prisma.league.findMany({
      where: {
        userLeague: {
          some: {
            userId,
          },
        },
      },
      include: {
        userLeague: true,
      },
    });
  }

  async getAllLeagues() {
    return this.prisma.league.findMany({
      include: {
        userLeague: {
          include: {
            user: true, // optionnel si tu veux les infos du user
          },
        },
      },
    });
  }

  async getLeague(id: string) {
    return this.prisma.league.findUnique({
      where: {
        id: id,
      },
      include: {
        userLeague: {
          include: {
            user: true, // optionnel si tu veux les infos du user
          },
        },
      },
    });
  }

  async joinPrivateLeagueWithLink(
    userId: string,
    sharedLink: string,
  ): Promise<boolean> {
    const league = await this.prisma.league.findUnique({
      where: { sharedLink },
      include: { userLeague: true },
    });

    if (!league || !league.isPrivate) {
      throw new ForbiddenException(
        "Lien invalide ou la ligue n'est pas privée",
      );
    }

    const alreadyMember = league.userLeague.some((ul) => ul.userId === userId);
    if (alreadyMember) {
      throw new ForbiddenException('Vous êtes déjà membre de cette ligue');
    }

    await this.prisma.userLeague.create({
      data: {
        userId,
        leagueId: league.id,
        isAdmin: false,
        role: 'MEMBER',
      },
    });

    return true;
  }
}
