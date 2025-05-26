import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { GrandPrixResolver } from './grand-prix.resolver';
import { GrandPrixService } from './grand-prix.service';

@Module({
  providers: [GrandPrixService, GrandPrixResolver, PrismaService],
  exports: [GrandPrixService],
})
export class GrandPrixModule {}
