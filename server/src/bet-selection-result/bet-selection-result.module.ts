import { Module } from '@nestjs/common';
import { BetSelectionResultResolver } from './bet-selection-result.resolver';
import { BetsSelectionResultService } from './bet-selection-result.service';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [
    BetSelectionResultResolver,
    BetsSelectionResultService,
    PrismaService,
  ],
})
export class BetSelectionResultModule {}
