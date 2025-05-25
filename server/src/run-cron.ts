import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { OpenF1SeederCronService } from './openf1/openf1.cron';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const cron = app.get(OpenF1SeederCronService);

  await cron.seedUpcomingGrandPrix();
  await app.close();
}

bootstrap();
