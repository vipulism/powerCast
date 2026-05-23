import { Controller, Get } from '@nestjs/common';
import { SummaryService } from './summary.service';

@Controller('summary')
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  @Get('today')
  getTodaySummary() {
    return this.summaryService.getTodaySummary();
  }
}
