// src/league/league.module.ts
import { Module } from '@nestjs/common';
import { LeagueResolver } from './league.resolver';
import { LeagueService } from './league.service';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [LeagueResolver, LeagueService, PrismaService],
})
export class LeagueModule {}
