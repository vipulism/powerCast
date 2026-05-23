import { Injectable } from '@nestjs/common';
import { AnalyzerService } from '../analyzer/analyzer.service';
import { UsageService } from '../usage/usage.service';
import { WeatherService } from '../weather/weather.service';
import { DailySummary } from '../../types';

@Injectable()
export class SummaryService {
  constructor(
    private readonly weatherService: WeatherService,
    private readonly usageService: UsageService,
    private readonly analyzerService: AnalyzerService,
  ) {}

  async getTodaySummary(): Promise<DailySummary> {
    const weather = await this.weatherService.getTodayWeather();
    const power = await this.usageService.getTodayPowerUsage();
    const analysis = this.analyzerService.analyze(weather, power);

    return {
      weather,
      power,
      analysis,
    };
  }
}
