import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserFromJwt } from 'src/common/types/user-from-jwt.interface';
import { BetSelectionResult } from 'src/entities/bets-selection-result.entity';
import { BetSelectionResultService } from './bet-selection-result.service';
import { CreateBetSelectionResultInput } from './dto/create-bet-selection-result';
import { UpdateBetSelectionResultInput } from './dto/update-bet-selection-result';
import { UserBetStatus } from './dto/user-bet-status.dto';

@Resolver()
export class BetSelectionResultResolver {
  constructor(
    private readonly betSelectionResultService: BetSelectionResultService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => BetSelectionResult)
  async createBet(
    @CurrentUser() user: UserFromJwt,
    @Args('input') input: CreateBetSelectionResultInput,
  ) {
    return await this.betSelectionResultService.create(user.userId, input);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => BetSelectionResult)
  async updateBet(
    @CurrentUser() user: UserFromJwt,
    @Args('input') input: UpdateBetSelectionResultInput,
  ) {
    return await this.betSelectionResultService.update(user.userId, input);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => UserBetStatus, { name: 'hasUserBetOnGrandPrix' })
  async hasUserBetOnGrandPrix(
    @CurrentUser() user: UserFromJwt,
    @Args('grandPrixId') grandPrixId: string,
  ): Promise<UserBetStatus> {
    return await this.betSelectionResultService.hasUserBetOnGrandPrix(
      user.userId,
      grandPrixId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => BetSelectionResult, {
    name: 'getUserBetForGrandPrix',
    nullable: true,
  })
  async getUserBetForGrandPrix(
    @CurrentUser() user: UserFromJwt,
    @Args('grandPrixId') grandPrixId: string,
  ) {
    return await this.betSelectionResultService.getUserBetForGrandPrix(
      user.userId,
      grandPrixId,
    );
  }
}
