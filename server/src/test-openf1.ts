import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const http = app.get(HttpService);

  try {
    const response = await firstValueFrom(http.get('https://api.openf1.org/v1/meetings'));
    console.log('✅ Réponse API OpenF1 :');
    console.dir(response.data, { depth: null });
  } catch (error) {
    console.error('❌ Erreur lors de l’appel à l’API OpenF1 :', error.message);
  }

  await app.close();
}

bootstrap();
