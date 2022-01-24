import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get('/availableDate')
    getAvailableDateIntervals(
        @Req()
        request: Request<any, any, any, { startDate: string; endDate: string }>,
    ) {
        return this.appService.getDateIntervals();
    }

    @Get('/month')
    getByMonth(@Req() request: Request<any, any, any, { month: string; year: string }>) {
        const { month, year } = request.query;
        return this.appService.getLocationByConcreteMonth(month, year);
    }

    @Get('/interval')
    getByInterval(@Req() request: Request<any, any, any, { startDate: string; endDate: string }>) {
        const { startDate, endDate } = request.query;
        return this.appService.getAvailableDateIntervals(startDate, endDate);
    }
}
