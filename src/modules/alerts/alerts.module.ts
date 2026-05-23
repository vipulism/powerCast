import { forwardRef, Module } from '@nestjs/common';
import { SummaryModule } from '../summary/summary.module';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';

@Module({
  imports: [forwardRef(() => SummaryModule)],
  controllers: [AlertsController],
  providers: [AlertsService],
  exports: [AlertsService],
})
export class AlertsModule {}
