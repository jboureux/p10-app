// src/league/league.module.ts
import { Module } from '@nestjs/common';
import { LeagueResolver } from './league.resolver';
import { LeagueService } from './league.service';
import { PrismaService } from '../prisma.service';
import { PubSubModule } from 'src/public-subscription/public-subscription.module';
import { makeGaugeProvider } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [PubSubModule],
  providers: [
    LeagueResolver,
    LeagueService,
    PrismaService,
    makeGaugeProvider({
      name: 'p10_total_leagues',
      help: 'Total number of leagues',
    }),
  ],
})
export class LeagueModule {}
