import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaClientExceptionFilter } from './prisma-client-exception/prisma-client-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: process.env.WEBAPP_URL });

  app.useGlobalFilters(new PrismaClientExceptionFilter());

  await app.listen(4000);
}

bootstrap().catch((reason) => console.log(reason));
