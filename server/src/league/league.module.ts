// src/league/league.module.ts
import { Module } from '@nestjs/common';
import { LeagueResolver } from './league.resolver';
import { LeagueService } from './league.service';
import { PrismaService } from '../prisma.service';
import { PubSubModule } from 'src/public-subscription/public-subscription.module';

@Module({
  imports: [PubSubModule],
  providers: [LeagueResolver, LeagueService, PrismaService],
})
export class LeagueModule {}
