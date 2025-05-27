import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from '../prisma.service';
import { ErgastService } from './ergast.service';
import { ErgastImporterService } from './ergast-importer.service';
import { ErgastScheduler } from './ergast.scheduler';

@Module({
  imports: [HttpModule],
  providers: [
    ErgastService,
    ErgastImporterService,
    PrismaService,
    ErgastScheduler,
  ],
  exports: [ErgastImporterService],
})
export class ErgastModule {}
