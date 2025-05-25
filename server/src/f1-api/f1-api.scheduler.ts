// src/f1-api/f1-api.scheduler.ts
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { F1ApiImporterService } from './f1-api-importer.service';

@Injectable()
export class F1ApiScheduler {
  constructor(private readonly f1ApiImporter: F1ApiImporterService) {}

  // Tous les jours à 3h du matin pour récupérer les nouveaux résultats
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async importDailyResults() {
    console.log(
      "🕒 [CRON] Début de l'importation quotidienne des résultats F1 MDS",
    );
    try {
      await this.f1ApiImporter.importAllAvailableResults();
      console.log(
        "✅ [CRON] Fin de l'importation quotidienne des résultats F1 MDS",
      );
    } catch (error) {
      console.error(
        "🚨 [CRON] Erreur lors de l'importation quotidienne:",
        error,
      );
    }
  }

  // Méthode pour test manuel
  async testImportResults() {
    console.log("🧪 [Test Manuel] Début de l'importation des résultats F1 MDS");
    try {
      await this.f1ApiImporter.importAllAvailableResults();
      console.log("✅ [Test Manuel] Fin de l'importation des résultats F1 MDS");
    } catch (error) {
      console.error("🚨 [Test Manuel] Erreur lors de l'importation:", error);
    }
  }

  // Méthode pour importer les résultats d'une date spécifique
  async testImportResultsForDate(date: string) {
    console.log(`🧪 [Test Manuel] Début de l\'importation pour ${date}`);
    try {
      const imported = await this.f1ApiImporter.importResultsForDate(date);
      console.log(
        `✅ [Test Manuel] ${imported} résultats importés pour ${date}`,
      );
    } catch (error) {
      console.error(
        `🚨 [Test Manuel] Erreur lors de l\'importation pour ${date}:`,
        error,
      );
    }
  }
}
