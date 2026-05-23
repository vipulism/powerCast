import { Injectable } from '@nestjs/common';
import { AnalyzerService } from '../analyzer/analyzer.service';
import { TelegramService } from '../telegram/telegram.service';
import { UsageService } from '../usage/usage.service';
import { WeatherService } from '../weather/weather.service';
import { DailySummary } from '../../types';

@Injectable()
export class SummaryService {
  constructor(
    private readonly weatherService: WeatherService,
    private readonly usageService: UsageService,
    private readonly analyzerService: AnalyzerService,
    private readonly telegramService: TelegramService,
  ) {}

  async getTodaySummary(): Promise<DailySummary> {
    const weather = await this.weatherService.getTodayWeather();
    const power = await this.usageService.getTodayPowerUsage();
    const analysis = this.analyzerService.analyze(weather, power);

    return { weather, power, analysis };
  }

  async sendTodaySummary() {
    const summary = await this.getTodaySummary();
    const message = this.formatTelegramMessage(summary);
    const telegram = await this.telegramService.sendMessage(message);

    return { telegram, summary };
  }

  private formatTelegramMessage(summary: DailySummary): string {
    const { weather, power, analysis } = summary;
    const observations = analysis.observations.map((item) => `- ${item}`).join('\n');

    return [
      'PowerCast Daily Summary',
      '',
      `Location: ${weather.location}`,
      `Current Temp: ${this.formatValue(weather.currentTempC, 'C')}`,
      `Max Temp: ${this.formatValue(weather.maxTempC, 'C')}`,
      `Humidity: ${this.formatValue(weather.humidity, '%')}`,
      `Condition: ${weather.condition}`,
      '',
      `Grid: ${this.formatValue(power.gridUnits, 'units')}`,
      `DG: ${this.formatValue(power.dgUnits, 'units')}`,
      `Total: ${this.formatValue(power.totalUnits, 'units')}`,
      `Date: ${power.date ?? 'unknown'}`,
      '',
      'Observation:',
      observations,
    ].join('\n');
  }

  private formatValue(value: number | null, suffix: string): string {
    return value === null ? 'unknown' : `${value} ${suffix}`;
  }
}
