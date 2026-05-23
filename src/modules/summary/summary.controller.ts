import { Controller, Get, Post } from '@nestjs/common';
import { SummaryService } from './summary.service';

@Controller('summary')
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  @Get('today')
  getTodaySummary() {
    return this.summaryService.getTodaySummary();
  }

  @Post('today/send')
  sendTodaySummary() {
    return this.summaryService.sendTodaySummary();
  }
}
