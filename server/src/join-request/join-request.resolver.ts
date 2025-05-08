import { Resolver, Mutation, Args, Query,Subscription } from '@nestjs/graphql';
import { JoinRequestService } from './join-request.service';
import { JoinRequest } from '../entities/join-request.entity';
import { CreateJoinRequestInput } from './dto/create-join-request.input';
import { UpdateJoinRequestStatusInput } from './dto/update-join-request-status.input';
import { CurrentUser } from 'src/common/decorators/current-user.decorator'; // à adapter selon ton auth
import { UserFromJwt } from 'src/common/types/user-from-jwt.interface';     // idem
import { UseGuards,Inject } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PubSub } from 'graphql-subscriptions';
import { PrismaService } from 'src/prisma.service';
import { User } from 'src/entities/user.entity';


@Resolver(() => JoinRequest)
export class JoinRequestResolver {
  constructor(private readonly joinRequestService: JoinRequestService, @Inject('PUB_SUB') private readonly pubSub: PubSub,private readonly prisma: PrismaService) {}

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
        leagueId: input.leagueId,
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
    const request = await this.joinRequestService.updateStatus(user.userId, input);

    // Notifier l’utilisateur concerné
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
    return this.joinRequestService.getPendingRequestsForLeague(leagueId, user.userId);
  }

  @Subscription(() => String, {
    filter: async (payload, _: any, context) => {
      const leagueId = payload.joinRequestCreated.leagueId;
      const userId = context?.req?.user?.userId;
      if (!userId) return false;
  
      const admin = await context.injector
        .get(PrismaService)
        .userLeague.findFirst({
          where: { leagueId, userId, isAdmin: true },
        });
  
      return !!admin;
    },
  })
  joinRequestCreated() {
    return this.pubSub.asyncIterableIterator('joinRequestCreated');
  }


  @Subscription(() => String, {
    filter: (payload, _, context) => {
      const userId = context?.req?.user?.userId;
      if (!userId) return false;
      console.log('>> payload:', payload.joinRequestResolved);
      console.log('>> context.userId:', userId);
      
      return payload.joinRequestResolved.userId === userId;
    },
  })
  joinRequestResolved() {
    return this.pubSub.asyncIterableIterator('joinRequestResolved');
  }
}