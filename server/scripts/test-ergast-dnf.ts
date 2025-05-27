import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ErgastImporterService } from '../src/ergast/ergast-importer.service';

async function testErgastDnfImport() {
  console.log('🚀 Test importation DNF depuis Ergast');

  const app = await NestFactory.createApplicationContext(AppModule);
  const ergastImporter = app.get(ErgastImporterService);

  try {
    // Tester avec le GP de Monaco 2025 (round 8) qui a des pilotes retirés
    await ergastImporter.importRaceResults('2025', '1');
    await ergastImporter.importRaceResults('2025', '2');
    await ergastImporter.importRaceResults('2025', '3');
    await ergastImporter.importRaceResults('2025', '4');
    await ergastImporter.importRaceResults('2025', '5');
    await ergastImporter.importRaceResults('2025', '6');
    await ergastImporter.importRaceResults('2025', '7');
    await ergastImporter.importRaceResults('2025', '8');

    console.log("✅ Test d'importation DNF terminé");
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    await app.close();
  }
}

if (require.main === module) {
  testErgastDnfImport().catch(console.error);
}
