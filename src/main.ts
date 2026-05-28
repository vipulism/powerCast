import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('APP_PORT', 61209);

  app.setGlobalPrefix('api');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('PowerCast API')
    .setDescription('Weather-aware power consumption intelligence APIs for summaries, alerts, Telegram, and Home Assistant.')
    .setVersion('0.1.0')
    .addTag('health')
    .addTag('weather')
    .addTag('usage')
    .addTag('summary')
    .addTag('alerts')
    .addTag('status')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument, {
    jsonDocumentUrl: 'api/docs-json',
  });

  await app.listen(port, '0.0.0.0');
  console.log(`PowerCast is running on port ${port}`);
  console.log(`PowerCast Swagger docs available at http://localhost:${port}/api/docs`);
}

void bootstrap();
