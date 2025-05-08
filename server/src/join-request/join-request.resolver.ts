import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { JoinRequestService } from './join-request.service';
import { JoinRequest } from '../entities/join-request.entity';
import { CreateJoinRequestInput } from './dto/create-join-request.input';
import { UpdateJoinRequestStatusInput } from './dto/update-join-request-status.input';
import { CurrentUser } from 'src/common/decorators/current-user.decorator'; // à adapter selon ton auth
import { UserFromJwt } from 'src/common/types/user-from-jwt.interface';     // idem
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Resolver(() => JoinRequest)
export class JoinRequestResolver {
  constructor(private readonly joinRequestService: JoinRequestService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => JoinRequest)
  createJoinRequest(
    @CurrentUser() user: UserFromJwt,
    @Args('input') input: CreateJoinRequestInput,
  ) {
    return this.joinRequestService.create(user.userId, input);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => JoinRequest)
  updateJoinRequestStatus(
    @CurrentUser() user: UserFromJwt,
    @Args('input') input: UpdateJoinRequestStatusInput,
  ) {
    return this.joinRequestService.updateStatus(user.userId, input);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [JoinRequest])
  pendingRequestsByLeague(
    @CurrentUser() user: UserFromJwt,
    @Args('leagueId') leagueId: string,
  ) {
    return this.joinRequestService.getPendingRequestsForLeague(leagueId, user.userId);
  }
}