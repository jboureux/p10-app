import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { League } from '../entities/league.entity';
import { CreateLeagueInput } from './dto/create-league.input';
import { LeagueService } from './league.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserFromJwt } from 'src/common/types/user-from-jwt.interface';
import { UseGuards } from '@nestjs/common';
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
}
