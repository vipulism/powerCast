import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PowerSummary } from '../../types';

@Injectable()
export class UsageService {
  constructor(private readonly configService: ConfigService) {}

  async getTodayPowerUsage(): Promise<PowerSummary> {
    const consumerId = this.configService.get<string>('POWER_API_CONSUMER_ID', '');
    const flatNumber = this.configService.get<string>('POWER_API_FLAT_NUMBER', '');

    return {
      consumerId,
      flatNumber,
      date: null,
      gridUnits: null,
      dgUnits: null,
      totalUnits: null,
    };
  }
}
