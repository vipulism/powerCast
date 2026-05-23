import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WeatherSummary } from '../../types';

interface OpenMeteoDailyResponse {
  daily?: {
    time?: string[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    weather_code?: number[];
  };
  current?: {
    time?: string;
    temperature_2m?: number;
    relative_humidity_2m?: number;
    weather_code?: number;
  };
}

@Injectable()
export class WeatherService {
  constructor(private readonly configService: ConfigService) {}

  async getTodayWeather(): Promise<WeatherSummary> {
    const locationName = this.configService.get<string>('LOCATION_NAME', 'Ghaziabad');
    const provider = this.configService.get<string>('WEATHER_PROVIDER', 'open-meteo');
    const latitude = this.configService.get<string>('LOCATION_LAT');
    const longitude = this.configService.get<string>('LOCATION_LON');

    if (!latitude || !longitude) {
      return {
        location: locationName,
        maxTempC: null,
        minTempC: null,
        currentTempC: null,
        humidity: null,
        condition: 'LOCATION_LAT and LOCATION_LON are required',
        provider,
      };
    }

    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.searchParams.set('latitude', latitude);
    url.searchParams.set('longitude', longitude);
    url.searchParams.set('current', 'temperature_2m,relative_humidity_2m,weather_code');
    url.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min,weather_code');
    url.searchParams.set('timezone', 'Asia/Kolkata');
    url.searchParams.set('forecast_days', '1');

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Open-Meteo request failed with status ${response.status}`);
    }

    const data = (await response.json()) as OpenMeteoDailyResponse;
    const weatherCode = data.current?.weather_code ?? data.daily?.weather_code?.[0] ?? null;

    return {
      location: locationName,
      provider,
      currentTempC: data.current?.temperature_2m ?? null,
      maxTempC: data.daily?.temperature_2m_max?.[0] ?? null,
      minTempC: data.daily?.temperature_2m_min?.[0] ?? null,
      humidity: data.current?.relative_humidity_2m ?? null,
      condition: this.getConditionLabel(weatherCode),
    };
  }

  private getConditionLabel(code: number | null): string {
    if (code === null) {
      return 'unknown';
    }

    const labels: Record<number, string> = {
      0: 'clear sky',
      1: 'mainly clear',
      2: 'partly cloudy',
      3: 'overcast',
      45: 'fog',
      48: 'depositing rime fog',
      51: 'light drizzle',
      53: 'moderate drizzle',
      55: 'dense drizzle',
      61: 'slight rain',
      63: 'moderate rain',
      65: 'heavy rain',
      80: 'slight rain showers',
      81: 'moderate rain showers',
      82: 'violent rain showers',
      95: 'thunderstorm',
    };

    return labels[code] ?? `weather code ${code}`;
  }
}
