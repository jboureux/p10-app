import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { F1ApiImporterService } from '../src/f1-api/f1-api-importer.service';

async function bootstrap() {
  console.log("🚀 Test de l'importation F1 API avec flag DNF...");

  const app = await NestFactory.createApplicationContext(AppModule);
  const f1ApiImporter = app.get(F1ApiImporterService);

  try {
    console.log("🧪 [Test DNF] Début de l'importation des résultats F1 MDS");
    await f1ApiImporter.importAllAvailableResults();
    console.log("✅ [Test DNF] Fin de l'importation des résultats F1 MDS");
  } catch (error) {
    console.error("❌ [Test DNF] Erreur lors de l'importation:", error);
  } finally {
    await app.close();
    console.log('✅ Test terminé avec succès');
  }
}

bootstrap();
