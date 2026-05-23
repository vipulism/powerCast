import { Injectable } from '@nestjs/common';
import { AlertsService } from '../alerts/alerts.service';
import { SummaryService } from '../summary/summary.service';
import { UsageService } from '../usage/usage.service';
import { WeatherService } from '../weather/weather.service';

@Injectable()
export class TelegramCommandService {
  constructor(
    private readonly summaryService: SummaryService,
    private readonly weatherService: WeatherService,
    private readonly usageService: UsageService,
    private readonly alertsService: AlertsService,
  ) {}

  async handleCommand(commandText: string): Promise<string> {
    const command = commandText.trim().split(' ')[0].toLowerCase();

    switch (command) {
      case '/summary':
        return this.getSummaryMessage();
      case '/weather':
        return this.getWeatherMessage();
      case '/usage':
        return this.getUsageMessage();
      case '/alerts':
        return this.getAlertsMessage();
      case '/help':
      case '/start':
        return this.getHelpMessage();
      default:
        return this.getUnknownCommandMessage();
    }
  }

  private async getSummaryMessage(): Promise<string> {
    const result = await this.summaryService.getTodaySummary();
    const alerts = result.alerts.hasAlerts
      ? result.alerts.alerts.map((alert) => `- [${alert.severity}] ${alert.title}`).join('\n')
      : '- No alerts for now.';

    return [
      'PowerCast Summary',
      '',
      `Location: ${result.weather.location}`,
      `Current Temp: ${this.formatValue(result.weather.currentTempC, 'C')}`,
      `Max Temp: ${this.formatValue(result.weather.maxTempC, 'C')}`,
      `Grid: ${this.formatValue(result.power.gridUnits, 'units')}`,
      `DG: ${this.formatValue(result.power.dgUnits, 'units')}`,
      `Total: ${this.formatValue(result.power.totalUnits, 'units')}`,
      `Date: ${result.power.date ?? 'unknown'}`,
      '',
      'Alerts:',
      alerts,
    ].join('\n');
  }

  private async getWeatherMessage(): Promise<string> {
    const weather = await this.weatherService.getTodayWeather();

    return [
      'PowerCast Weather',
      '',
      `Location: ${weather.location}`,
      `Current Temp: ${this.formatValue(weather.currentTempC, 'C')}`,
      `Max Temp: ${this.formatValue(weather.maxTempC, 'C')}`,
      `Min Temp: ${this.formatValue(weather.minTempC, 'C')}`,
      `Humidity: ${this.formatValue(weather.humidity, '%')}`,
      `Condition: ${weather.condition}`,
    ].join('\n');
  }

  private async getUsageMessage(): Promise<string> {
    const usage = await this.usageService.getTodayPowerUsage();

    return [
      'PowerCast Usage',
      '',
      `Date: ${usage.date ?? 'unknown'}`,
      `Grid: ${this.formatValue(usage.gridUnits, 'units')}`,
      `DG: ${this.formatValue(usage.dgUnits, 'units')}`,
      `Total: ${this.formatValue(usage.totalUnits, 'units')}`,
      `Flat: ${usage.flatNumber}`,
    ].join('\n');
  }

  private async getAlertsMessage(): Promise<string> {
    const summary = await this.summaryService.getTodaySummary();
    const alerts = this.alertsService.buildAlerts(summary);

    if (!alerts.hasAlerts) {
      return 'PowerCast Alerts\n\nNo alerts for now.';
    }

    return [
      'PowerCast Alerts',
      '',
      ...alerts.alerts.map((alert) => `- [${alert.severity}] ${alert.title}: ${alert.message}`),
    ].join('\n');
  }

  private getHelpMessage(): string {
    return [
      'PowerCast Commands',
      '',
      '/summary - Today summary',
      '/weather - Today weather',
      '/usage - Today Grid/DG usage',
      '/alerts - Today alerts',
      '/help - Show commands',
    ].join('\n');
  }

  private getUnknownCommandMessage(): string {
    return 'Unknown command. Send /help to see available PowerCast commands.';
  }

  private formatValue(value: number | null, suffix: string): string {
    return value === null ? 'unknown' : `${value} ${suffix}`;
  }
}
