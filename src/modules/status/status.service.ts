import { Injectable } from '@nestjs/common';
import { SummaryService } from '../summary/summary.service';
import { AlertSeverity, HomeAssistantStatus } from '../../types';

@Injectable()
export class StatusService {
  constructor(private readonly summaryService: SummaryService) {}

  async getHomeAssistantStatus(): Promise<HomeAssistantStatus> {
    const summary = await this.summaryService.getTodaySummary();
    const highestSeverity = this.getHighestSeverity(summary.alerts.alerts.map((alert) => alert.severity));

    return {
      date: summary.power.date,
      location: summary.weather.location,
      currentTempC: summary.weather.currentTempC,
      maxTempC: summary.weather.maxTempC,
      minTempC: summary.weather.minTempC,
      humidity: summary.weather.humidity,
      condition: summary.weather.condition,
      gridUnits: summary.power.gridUnits,
      dgUnits: summary.power.dgUnits,
      totalUnits: summary.power.totalUnits,
      hasAlerts: summary.alerts.hasAlerts,
      alertCount: summary.alerts.alerts.length,
      highestSeverity,
      analysisStatus: summary.analysis.status,
    };
  }

  private getHighestSeverity(severities: AlertSeverity[]): AlertSeverity | 'none' {
    if (severities.includes('critical')) {
      return 'critical';
    }

    if (severities.includes('warning')) {
      return 'warning';
    }

    if (severities.includes('info')) {
      return 'info';
    }

    return 'none';
  }
}
