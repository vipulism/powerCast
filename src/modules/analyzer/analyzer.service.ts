import { Injectable } from '@nestjs/common';
import { AnalysisResult, PowerSummary, WeatherSummary } from '../../types';

@Injectable()
export class AnalyzerService {
  analyze(weather: WeatherSummary, power: PowerSummary): AnalysisResult {
    const observations: string[] = [];
    let status: AnalysisResult['status'] = 'unknown';

    if (weather.maxTempC !== null && weather.maxTempC >= 38) {
      observations.push('Hot day detected. AC usage may be higher than usual.');
      status = 'hot-day';
    }

    if (power.dgUnits !== null && power.dgUnits > 0) {
      observations.push('DG usage detected. Check if there was a grid outage.');
      status = 'dg-used';
    }

    if (observations.length === 0) {
      observations.push('No major observation available yet.');
      status = 'normal';
    }

    return { status, observations };
  }
}
