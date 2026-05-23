import { Module } from '@nestjs/common';
import { SummaryModule } from '../summary/summary.module';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';

@Module({
  imports: [SummaryModule],
  controllers: [AlertsController],
  providers: [AlertsService],
})
export class AlertsModule {}
