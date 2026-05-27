import { Module } from '@nestjs/common';
import { SummaryModule } from '../summary/summary.module';
import { StatusController } from './status.controller';
import { StatusService } from './status.service';

@Module({
  imports: [SummaryModule],
  controllers: [StatusController],
  providers: [StatusService],
})
export class StatusModule {}
