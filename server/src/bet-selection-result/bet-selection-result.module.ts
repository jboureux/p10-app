import { Module } from '@nestjs/common';
import { BetSelectionResultResolver } from './bet-selection-result.resolver';
import { BetSelectionResultService } from './bet-selection-result.service';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [
    BetSelectionResultResolver,
    BetSelectionResultService,
    PrismaService,
  ],
})
export class BetSelectionResultModule {}
