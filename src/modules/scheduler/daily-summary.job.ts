import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SummaryService } from '../summary/summary.service';

@Injectable()
export class DailySummaryJob {
  private readonly logger = new Logger(DailySummaryJob.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly summaryService: SummaryService,
  ) {}

  @Cron(process.env.DAILY_SUMMARY_CRON || CronExpression.EVERY_DAY_AT_9PM, {
    timeZone: process.env.DAILY_SUMMARY_TIMEZONE || 'Asia/Kolkata',
  })
  async sendDailySummary() {
    const enabled = this.configService.get<string>('DAILY_SUMMARY_ENABLED', 'true') === 'true';

    if (!enabled) {
      this.logger.log('Daily summary job skipped because it is disabled.');
      return;
    }

    this.logger.log('Sending scheduled PowerCast daily summary.');
    await this.summaryService.sendTodaySummary();
    this.logger.log('Scheduled PowerCast daily summary sent.');
  }
}
