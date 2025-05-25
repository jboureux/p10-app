// src/ergast/ergast.scheduler.ts
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ErgastImporterService } from './ergast-importer.service';
import { ErgastService } from './ergast.service';

@Injectable()
export class ErgastScheduler {
  constructor(
    private readonly ergastImporter: ErgastImporterService,
    private readonly ergastService: ErgastService,
  ) {}

  @Cron('0 12 * * 1') // Chaque lundi à 12h UTC
  async handleErgastCron() {
    console.log('🕛 [Ergast Cron] Lancement de l’import des résultats');

    await this.import();

    console.log('✅ [Ergast Cron] Fin de l’import');
  }

  async testManualImport() {
    console.log('🧪 [Test Manuel] Lancement de l’import Ergast');

    await this.import();

    console.log('✅ [Test Manuel] Fin de l’import');
  }

  async import() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const season = yesterday.getFullYear().toString();
    const round = await this.ergastService.getLatestRoundForDate(
      season,
      yesterday,
    );

    if (round) {
      await this.ergastImporter.importRaceResults(season, round);
    } else {
      console.warn('⚠️ Aucun round trouvé pour la date d’hier');
    }
  }
}
