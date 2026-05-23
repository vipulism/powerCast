import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MonthlyUsageSummary, PowerSummary } from '../../types';

interface PowerApiMonthlyResponse {
  date?: Array<number | string>;
  grid?: Array<number | string | null>;
  dg?: Array<number | string | null>;
}

@Injectable()
export class UsageService {
  constructor(private readonly configService: ConfigService) {}

  async getTodayPowerUsage(): Promise<PowerSummary> {
    const month = this.getCurrentMonth();
    const monthly = await this.getMonthlyUsage(month);
    const latest = [...monthly.days].reverse().find((day) => day.date);

    return {
      consumerId: monthly.consumerId,
      flatNumber: monthly.flatNumber,
      date: latest?.date ?? null,
      gridUnits: latest?.gridUnits ?? null,
      dgUnits: latest?.dgUnits ?? null,
      totalUnits: latest?.totalUnits ?? null,
    };
  }

  async getMonthlyUsage(month = this.getCurrentMonth()): Promise<MonthlyUsageSummary> {
    const consumerId = this.configService.get<string>('POWER_API_CONSUMER_ID', '');
    const flatNumber = this.configService.get<string>('POWER_API_FLAT_NUMBER', '');
    const baseUrl = this.configService.get<string>('POWER_API_BASE_URL', '');
    const monthlyPath = this.configService.get<string>('POWER_API_MONTHLY_CHART_PATH', '');

    if (!consumerId || !baseUrl || !monthlyPath) {
      throw new Error('Power API configuration is missing');
    }

    const url = `${baseUrl}${monthlyPath}/${consumerId}/${month}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Power API request failed with status ${response.status}`);
    }

    const data = (await response.json()) as PowerApiMonthlyResponse;
    const dates = data.date ?? [];
    const grid = data.grid ?? [];
    const dg = data.dg ?? [];

    const days = dates.map((date, index) => {
      const gridUnits = this.toNumberOrNull(grid[index]);
      const dgUnits = this.toNumberOrNull(dg[index]);

      return {
        date: this.normalizeDate(month, date),
        gridUnits,
        dgUnits,
        totalUnits: this.sumNullable(gridUnits, dgUnits),
      };
    });

    return {
      consumerId,
      flatNumber,
      month,
      days,
    };
  }

  private getCurrentMonth(): string {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
    }).format(new Date());
  }

  private normalizeDate(month: string, dayValue: number | string): string {
    const dayText = String(dayValue).trim();

    if (/^\d{4}-\d{2}-\d{2}$/.test(dayText)) {
      return dayText;
    }

    const dayNumber = Number(dayText);

    if (!Number.isFinite(dayNumber)) {
      return dayText;
    }

    return `${month}-${String(dayNumber).padStart(2, '0')}`;
  }

  private toNumberOrNull(value: number | string | null | undefined): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  private sumNullable(first: number | null, second: number | null): number | null {
    if (first === null && second === null) {
      return null;
    }

    return (first ?? 0) + (second ?? 0);
  }
}
