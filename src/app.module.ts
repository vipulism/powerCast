import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { HealthModule } from './modules/health/health.module';
import { WeatherModule } from './modules/weather/weather.module';
import { UsageModule } from './modules/usage/usage.module';
import { AnalyzerModule } from './modules/analyzer/analyzer.module';
import { SummaryModule } from './modules/summary/summary.module';
import { SchedulerModule } from './modules/scheduler/scheduler.module';
import { AlertsModule } from './modules/alerts/alerts.module';
import { TelegramPollingModule } from './modules/telegram-polling/telegram-polling.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    HealthModule,
    WeatherModule,
    UsageModule,
    AnalyzerModule,
    SummaryModule,
    SchedulerModule,
    AlertsModule,
    TelegramPollingModule,
  ],
})
export class AppModule {}
