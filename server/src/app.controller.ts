import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/dateIntervals')
  getDateIntervals(@Req() request: Request) {
    return this.appService.getDateIntervals();
  }

  @Get('/date')
  getByDateInterval(
    @Req()
    request: Request<any, any, any, { startDate: string; endDate: string }>,
  ) {
    const { startDate, endDate } = request.query;
    return this.appService.getLocationsByInterval(startDate, endDate);
  }

  @Get('/month')
  getByMonth(
    @Req() request: Request<any, any, any, { month: string; year: string }>,
  ) {
    const { month, year } = request.query;
    return this.appService.getLocationByConcreteMonth(month, year);
  }
}
