import { Module } from '@nestjs/common';
import { SummaryModule } from '../summary/summary.module';
import { DailySummaryJob } from './daily-summary.job';

@Module({
  imports: [SummaryModule],
  providers: [DailySummaryJob],
})
export class SchedulerModule {}
