import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WeatherSummary } from '../../types';

@Injectable()
export class WeatherService {
  constructor(private readonly configService: ConfigService) {}

  async getTodayWeather(): Promise<WeatherSummary> {
    const locationName = this.configService.get<string>('LOCATION_NAME', 'Ghaziabad');
    const provider = this.configService.get<string>('WEATHER_PROVIDER', 'open-meteo');

    return {
      location: locationName,
      maxTempC: null,
      minTempC: null,
      currentTempC: null,
      humidity: null,
      condition: 'not implemented',
      provider,
    };
  }
}
