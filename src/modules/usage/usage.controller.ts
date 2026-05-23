import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
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
    if (month && !/^\d{4}-\d{2}$/.test(month)) {
      throw new BadRequestException('month must be in YYYY-MM format');
    }

    return this.usageService.getMonthlyUsage(month);
  }
}
