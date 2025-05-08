import { Resolver, Mutation, Args,Query } from '@nestjs/graphql';
import { League } from '../entities/league.entity';
import { CreateLeagueInput } from './dto/create-league.input';
import { LeagueService } from './league.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserFromJwt } from 'src/common/types/user-from-jwt.interface';
import {  UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Resolver(() => League)
export class LeagueResolver {
  constructor(private readonly leagueService: LeagueService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => League)
  createLeague(
    @CurrentUser() user: UserFromJwt,
    @Args('input') input: CreateLeagueInput,
  ) {
    return this.leagueService.create(input, user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  deleteLeague(
    @CurrentUser() user: UserFromJwt,
    @Args('leagueId') leagueId: string,
  ) {
    return this.leagueService.deleteLeague(leagueId, user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  leaveLeague(
    @CurrentUser() user: UserFromJwt,
    @Args('leagueId') leagueId: string,
  ) {
    return this.leagueService.leaveLeague(leagueId, user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  joinPrivateLeagueWithLink(
    @CurrentUser() user: UserFromJwt,
    @Args('sharedLink') sharedLink: string,
  ) {
    return this.leagueService.joinPrivateLeagueWithLink(user.userId, sharedLink);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [League])
  myLeagues(@CurrentUser() user: UserFromJwt) {
    return this.leagueService.getMyLeagues(user.userId);
  }

  @Query(() => [League])
  getAllLeagues() {
    return this.leagueService.getAllLeagues();
  }
}
