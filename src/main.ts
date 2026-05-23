import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('APP_PORT', 61209);

  app.setGlobalPrefix('api');

  await app.listen(port, '0.0.0.0');
  console.log(`PowerCast is running on port ${port}`);
}

void bootstrap();
