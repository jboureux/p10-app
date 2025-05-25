import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { F1ApiImporterService } from './f1-api-importer.service';
import { F1ApiScheduler } from './f1-api.scheduler';
import { F1ApiService } from './f1-api.service';

@Module({
  imports: [HttpModule],
  providers: [
    F1ApiService,
    F1ApiImporterService,
    F1ApiScheduler,
    PrismaService,
  ],
  exports: [F1ApiService, F1ApiImporterService, F1ApiScheduler],
})
export class F1ApiModule {}
