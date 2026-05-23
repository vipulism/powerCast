import { Module } from '@nestjs/common';
import { MessagingModule } from '../messaging/messaging.module';
import { SummaryModule } from '../summary/summary.module';
import { TelegramCommandPollingService } from './telegram-command-polling.service';

@Module({
  imports: [MessagingModule, SummaryModule],
  providers: [TelegramCommandPollingService],
})
export class TelegramPollingModule {}
