import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  // Nginx(같은 서버)가 넘긴 X-Forwarded-For로 req.ip를 실제 클라이언트 IP로 맞춤 (Throttler, 로그)
  // true 대신 'loopback': 직접 연결이 127.0.0.1/::1일 때만 헤더를 믿어 IP 위조를 막음
  app.set('trust proxy', 'loopback');
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
