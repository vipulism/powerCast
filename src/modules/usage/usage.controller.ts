import { Controller, Get, Query } from '@nestjs/common';
import { UsageService } from './usage.service';

@Controller('usage')
export class UsageController {
  constructor(private readonly usageService: UsageService) {}

  @Get('today')
  getTodayPowerUsage() {
    return this.usageService.getTodayPowerUsage();
  }

  @Get('monthly')
  getMonthlyUsage(@Query('month') month?: string) {
    return this.usageService.getMonthlyUsage(month);
  }
}
