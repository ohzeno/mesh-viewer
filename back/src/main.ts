import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(compression()); // 압축을 사용하여 응답 크기를 줄임

  const origins = configService
    .get('FRONTEND_URL')
    .split(',')
    .map((origin) => origin.trim());

  app.enableCors({
    origin: origins,
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe()); // 향후 확장성을 위해 ValidationPipe를 전역으로 사용
  const PORT = process.env.PORT;
  await app.listen(PORT);
}
bootstrap();
