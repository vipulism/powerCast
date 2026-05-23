import { Module } from '@nestjs/common';
import { AlertsService } from '../alerts/alerts.service';
import { AnalyzerModule } from '../analyzer/analyzer.module';
import { MessagingModule } from '../messaging/messaging.module';
import { UsageModule } from '../usage/usage.module';
import { WeatherModule } from '../weather/weather.module';
import { SummaryController } from './summary.controller';
import { SummaryService } from './summary.service';

@Module({
  imports: [WeatherModule, UsageModule, AnalyzerModule, MessagingModule],
  controllers: [SummaryController],
  providers: [SummaryService, AlertsService],
  exports: [SummaryService],
})
export class SummaryModule {}
