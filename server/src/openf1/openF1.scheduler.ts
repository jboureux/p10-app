import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { OpenF1SeederCronService } from './openf1.cron';

@Injectable()
export class OpenF1Scheduler {
  constructor(private readonly seeder: OpenF1SeederCronService) {}

  @Cron('0 6 * * *') // Chaque jour à 6h UTC
  async handleCron() {
    console.log('🕘 [OpenF1 Cron] Début de la tâche automatique');
    await this.seeder.seedUpcomingGrandPrix();
    console.log('✅ [OpenF1 Cron] Fin de la tâche');
  }
}
