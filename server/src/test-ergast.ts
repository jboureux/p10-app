import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ErgastScheduler } from './ergast/ergast.scheduler';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const scheduler = app.get(ErgastScheduler);
  await scheduler.testManualImport();
  await app.close();
}

bootstrap();