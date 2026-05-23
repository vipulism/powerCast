import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AlertsSummary, DailySummary, PowerCastAlert } from '../../types';

@Injectable()
export class AlertsService {
  constructor(private readonly configService: ConfigService) {}

  buildAlerts(summary: DailySummary): AlertsSummary {
    const alerts: PowerCastAlert[] = [];
    const { weather, power } = summary;
    const thresholds = this.getThresholds();

    if (weather.maxTempC !== null && weather.maxTempC >= thresholds.hotDayTempC) {
      alerts.push({
        code: 'hot-day',
        severity: 'warning',
        title: 'Hot day detected',
        message: `Max temperature is ${weather.maxTempC} C. AC usage may be higher than usual.`,
      });
    }

    if (power.gridUnits !== null && power.gridUnits >= thresholds.highGridUnits) {
      alerts.push({
        code: 'high-grid-usage',
        severity: 'warning',
        title: 'High Grid usage',
        message: `Grid usage is ${power.gridUnits} units.`,
      });
    }

    if (power.totalUnits !== null && power.totalUnits >= thresholds.highTotalUnits) {
      alerts.push({
        code: 'high-total-usage',
        severity: 'critical',
        title: 'High total usage',
        message: `Total usage is ${power.totalUnits} units.`,
      });
    }

    if (power.dgUnits !== null && power.dgUnits > 0) {
      const highDg = power.dgUnits >= thresholds.highDgUnits;

      alerts.push({
        code: highDg ? 'high-dg-usage' : 'dg-used',
        severity: highDg ? 'critical' : 'info',
        title: highDg ? 'High DG usage' : 'DG usage detected',
        message: `DG usage is ${power.dgUnits} units.`,
      });
    }

    return {
      date: power.date,
      alerts,
      hasAlerts: alerts.length > 0,
    };
  }

  private getThresholds() {
    return {
      hotDayTempC: this.getNumberConfig('ALERT_HOT_DAY_TEMP_C', 38),
      highGridUnits: this.getNumberConfig('ALERT_HIGH_GRID_UNITS', 20),
      highTotalUnits: this.getNumberConfig('ALERT_HIGH_TOTAL_UNITS', 25),
      highDgUnits: this.getNumberConfig('ALERT_HIGH_DG_UNITS', 1),
    };
  }

  private getNumberConfig(key: string, fallback: number): number {
    const rawValue = this.configService.get<string>(key);

    if (rawValue === undefined || rawValue === '') {
      return fallback;
    }

    const parsed = Number(rawValue);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
}
