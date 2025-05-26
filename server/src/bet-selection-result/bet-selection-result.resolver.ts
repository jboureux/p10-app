import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserFromJwt } from 'src/common/types/user-from-jwt.interface';
import { CreateBetSelectionResultInput } from './dto/create-bet-selection-result';
import { UpdateBetSelectionResultInput } from './dto/update-bet-selection-result';
import { BetSelectionResultService } from './bet-selection-result.service';
import { BetSelectionResult } from 'src/entities/bets-selection-result.entity';

@Resolver()
export class BetSelectionResultResolver {
  constructor(
    private readonly betSelectionResultService: BetSelectionResultService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => BetSelectionResult)
  create(
    @CurrentUser() user: UserFromJwt,
    @Args('input') input: CreateBetSelectionResultInput,
  ) {
    return this.betSelectionResultService.create(user.userId, input);
  }
}
