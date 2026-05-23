import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { HealthModule } from './modules/health/health.module';
import { WeatherModule } from './modules/weather/weather.module';
import { UsageModule } from './modules/usage/usage.module';
import { AnalyzerModule } from './modules/analyzer/analyzer.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { JobsModule } from './modules/jobs/jobs.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    HealthModule,
    WeatherModule,
    UsageModule,
    AnalyzerModule,
    NotificationsModule,
    JobsModule,
  ],
})
export class AppModule {}
