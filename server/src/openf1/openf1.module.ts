import { Module} from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OpenF1Service } from './openf1.service';
import { OpenF1SeederCronService } from './openf1.cron';
import { TrackService } from './services/track.service';
import { GrandPrixService } from './services/grand-prix.service';
import { PiloteService } from './services/pilotes.service';
import { EcurieService } from './services/ecurie.service';
import { PiloteEcurieService } from './services/pilote-ecurie.service';
import { GrandPrixPiloteService } from './services/grand-prix-pilote.service';
import { PrismaService } from '../prisma.service';
import { OpenF1Scheduler } from './openF1.scheduler';

@Module({
  imports: [HttpModule],
  providers: [
    OpenF1Service,
    OpenF1SeederCronService,
    PrismaService,
    TrackService,
    GrandPrixService,
    PiloteService,
    EcurieService,
    PiloteEcurieService,
    GrandPrixPiloteService,
    OpenF1Scheduler,
  ],
  exports: [OpenF1SeederCronService],
})
export class OpenF1Module {}
