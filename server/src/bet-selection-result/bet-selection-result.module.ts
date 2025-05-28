import { Module } from '@nestjs/common';
import { BetSelectionResultResolver } from './bet-selection-result.resolver';
import { BetSelectionResultService } from './bet-selection-result.service';
import { PrismaService } from '../prisma.service';
import { makeGaugeProvider } from '@willsoto/nestjs-prometheus';

@Module({
  providers: [
    BetSelectionResultResolver,
    BetSelectionResultService,
    PrismaService,
    makeGaugeProvider({
      name: 'p10_total_bets',
      help: 'Total number of bets placed',
    }),
  ],
})
export class BetSelectionResultModule {}
