import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './modules/health/health.module';
import { WeatherModule } from './modules/weather/weather.module';
import { UsageModule } from './modules/usage/usage.module';
import { AnalyzerModule } from './modules/analyzer/analyzer.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HealthModule,
    WeatherModule,
    UsageModule,
    AnalyzerModule,
  ],
})
export class AppModule {}
