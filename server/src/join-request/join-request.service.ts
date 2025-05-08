import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateJoinRequestInput } from './dto/create-join-request.input';
import { UpdateJoinRequestStatusInput } from './dto/update-join-request-status.input';
import { JoinRequestStatus } from '../entities/join-request.entity';

@Injectable()
export class JoinRequestService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, input: CreateJoinRequestInput) {
    const league = await this.prisma.league.findUnique({
      where: { id: input.leagueId },
    });

    if (!league || league.isPrivate) {
      throw new ForbiddenException('Cette ligue est privée ou n’existe pas');
    }

    const existingMembership = await this.prisma.userLeague.findFirst({
      where: {
        userId,
        leagueId: input.leagueId,
      },
    });

    if (existingMembership) {
      throw new ForbiddenException("Vous êtes déjà membre de cette ligue");
    }

    const existingRequest = await this.prisma.joinRequest.findFirst({
      where: {
        userId,
        leagueId: input.leagueId,
        status: JoinRequestStatus.PENDING,
      },
    });

    if (existingRequest) {
      throw new ForbiddenException(
        "Une demande est déjà en attente pour cette ligue",
      );
    }

    return this.prisma.joinRequest.create({
      data: {
        userId,
        leagueId: input.leagueId,
        status: JoinRequestStatus.PENDING,
      },
      include: {
        league: true, // 👈 nécessaire pour résoudre le champ league côté GraphQL
      },
    });
  }

  async updateStatus(adminId: string, input: UpdateJoinRequestStatusInput) {
    const request = await this.prisma.joinRequest.findUnique({
      where: { id: input.requestId },
      include: {
        league: {
          include: { userLeague: true },
        },
      },
    });

    if (!request) {
      throw new NotFoundException('Demande non trouvée');
    }

    const isAdmin = request.league.userLeague.some(
      (ul) => ul.userId === adminId && ul.isAdmin,
    );

    if (!isAdmin) {
      throw new ForbiddenException(
        "Vous n'êtes pas administrateur de cette ligue",
      );
    }

    const updatedRequest = await this.prisma.joinRequest.update({
      where: { id: input.requestId },
      data: { status: input.status },
      include: { league: true },
    });

    if (input.status === JoinRequestStatus.ACCEPTED) {
      const alreadyMember = await this.prisma.userLeague.findFirst({
        where: {
          userId: request.userId,
          leagueId: request.leagueId,
        },
      });

      if (!alreadyMember) {
        await this.prisma.userLeague.create({
          data: {
            userId: request.userId,
            leagueId: request.leagueId,
            isAdmin: false,
            role: "MEMBER",
          },
        });
      }
    }

    return updatedRequest;
  }

  async getPendingRequestsForLeague(leagueId: string, adminId: string) {
    const isAdmin = await this.prisma.userLeague.findFirst({
      where: {
        leagueId,
        userId: adminId,
        isAdmin: true,
      },
    });

    if (!isAdmin) {
      throw new ForbiddenException();
    }

    return this.prisma.joinRequest.findMany({
      where: { leagueId, status: JoinRequestStatus.PENDING },
      include: { user: true },
    });
  }
}