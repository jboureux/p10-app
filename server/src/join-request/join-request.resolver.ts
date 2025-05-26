import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator'; 
import { UserFromJwt } from 'src/common/types/user-from-jwt.interface'; 
import { JoinRequest } from '../entities/join-request.entity';
import { CreateJoinRequestInput } from './dto/create-join-request.input';
import { UpdateJoinRequestStatusInput } from './dto/update-join-request-status.input';
import { JoinRequestService } from './join-request.service';
import { JoinRequestCreatedPayload } from 'src/entities/join-request-created.payload';

@Resolver(() => JoinRequest)
export class JoinRequestResolver {
  constructor(
    private readonly joinRequestService: JoinRequestService,
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => JoinRequest)
  async createJoinRequest(
    @CurrentUser() user: UserFromJwt,
    @Args('input') input: CreateJoinRequestInput,
  ) {
    const request = await this.joinRequestService.create(user.userId, input);

    // Émission de l’événement pour l’admin de la ligue
    await this.pubSub.publish('joinRequestCreated', {
      joinRequestCreated: {
        leagueId: request.leagueId, // ou input.leagueId
        message: `Nouvelle demande reçue pour la ligue ${request.league.name}`,
      },
    });

    return request;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => JoinRequest)
  async updateJoinRequestStatus(
    @CurrentUser() user: UserFromJwt,
    @Args('input') input: UpdateJoinRequestStatusInput,
  ) {
    const request = await this.joinRequestService.updateStatus(
      user.userId,
      input,
    );

    await this.pubSub.publish('joinRequestResolved', {
      joinRequestResolved: {
        userId: request.userId,
        status: request.status,
      },
    });

    return request;
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [JoinRequest])
  pendingRequestsByLeague(
    @CurrentUser() user: UserFromJwt,
    @Args('leagueId') leagueId: string,
  ) {
    return this.joinRequestService.getPendingRequestsForLeague(
      leagueId,
      user.userId,
    );
  }

  @Subscription(() => JoinRequestCreatedPayload, {
    filter: async (payload, _, context) => {
      const userId = context?.req?.user?.userId;
      const leagueId = payload.joinRequestCreated.leagueId;
      const prisma = context?.prisma;

      if (!userId || !prisma) {
        return false;
      }

      try {
        const admin = await prisma.userLeague.findFirst({
          where: { userId: userId, leagueId: leagueId, isAdmin: true },
        });

        return !!admin;
      } catch (error) {
        console.error('❌ Erreur lors de la recherche admin:', error);
        return false;
      }
    },
  })
  joinRequestCreated() {
    return this.pubSub.asyncIterableIterator('joinRequestCreated');
  }
}
