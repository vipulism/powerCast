import { Injectable } from '@nestjs/common';
import { AlertsSummary, DailySummary, PowerCastAlert } from '../../types';

@Injectable()
export class AlertsService {
  buildAlerts(summary: DailySummary): AlertsSummary {
    const alerts: PowerCastAlert[] = [];
    const { weather, power } = summary;

    if (weather.maxTempC !== null && weather.maxTempC >= 38) {
      alerts.push({
        code: 'hot-day',
        severity: 'warning',
        title: 'Hot day detected',
        message: `Max temperature is ${weather.maxTempC} C. AC usage may be higher than usual.`,
      });
    }

    if (power.gridUnits !== null && power.gridUnits >= 20) {
      alerts.push({
        code: 'high-grid-usage',
        severity: 'warning',
        title: 'High Grid usage',
        message: `Grid usage is ${power.gridUnits} units.`,
      });
    }

    if (power.totalUnits !== null && power.totalUnits >= 25) {
      alerts.push({
        code: 'high-total-usage',
        severity: 'critical',
        title: 'High total usage',
        message: `Total usage is ${power.totalUnits} units.`,
      });
    }

    if (power.dgUnits !== null && power.dgUnits > 0) {
      const highDg = power.dgUnits >= 1;

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
}
