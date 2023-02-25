import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CalendarController } from './calendar.controller';

@Module({
  imports: [HttpModule],
  controllers: [CalendarController],
  providers: [],
  exports: [],
})
export class CalendarModule {}
