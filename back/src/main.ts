import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const cors = process.env.CORS?.split(',') || ['http://localhost:3000'];

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: cors,
    },
  });

  await app.listen(3001);
}
bootstrap();
