import { Injectable } from '@nestjs/common';
import { SummaryService } from '../summary/summary.service';
import { AlertSeverity, HomeAssistantStatus, PowerCastAlert } from '../../types';

@Injectable()
export class StatusService {
  constructor(private readonly summaryService: SummaryService) {}

  async getHomeAssistantStatus(): Promise<HomeAssistantStatus> {
    const summary = await this.summaryService.getTodaySummary();
    const alerts = summary.alerts.alerts;
    const highestSeverity = this.getHighestSeverity(alerts.map((alert) => alert.severity));

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
      alertCount: alerts.length,
      highestSeverity,
      analysisStatus: summary.analysis.status,
      isHotDay: alerts.some((alert) => alert.code === 'hot-day'),
      isHighUsage: alerts.some((alert) => alert.code === 'high-grid-usage' || alert.code === 'high-total-usage'),
      isDgUsed: alerts.some((alert) => alert.code === 'dg-used' || alert.code === 'high-dg-usage'),
      isCriticalAlert: highestSeverity === 'critical',
      alertSummary: this.buildAlertSummary(alerts),
    };
  }

  private buildAlertSummary(alerts: PowerCastAlert[]): string {
    if (alerts.length === 0) {
      return 'No alerts for now';
    }

    return alerts.map((alert) => alert.title).join(', ');
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
