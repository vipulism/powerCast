import { Controller, Get } from '@nestjs/common';
import { SummaryService } from '../summary/summary.service';
import { AlertsService } from './alerts.service';

@Controller('alerts')
export class AlertsController {
  constructor(
    private readonly summaryService: SummaryService,
    private readonly alertsService: AlertsService,
  ) {}

  @Get('today')
  async getTodayAlerts() {
    const summary = await this.summaryService.getTodaySummary();
    return this.alertsService.buildAlerts(summary);
  }
}
