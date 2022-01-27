import { Inject } from '@nestjs/common';
import chroma from 'chroma-js';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { LOCATIONS_PATH } from './config';
import { LocationService } from './services/LocationService';
import { SemanticLocationHistory } from './typings';
import { AllMonths, getMonthFromFilename, getYearsBetween } from './utils';

export class AppService {
    constructor(
        @Inject(LocationService)
        private readonly locationService: LocationService,
    ) {}

    getDateIntervals() {
        const availableYears = readdirSync(LOCATIONS_PATH);
        const availableMonths = availableYears.map((year) => {
            const filenames = readdirSync(join(LOCATIONS_PATH, year));
            const parsed = filenames.map((filename) => {
                const [year, month] = filename.replace('.json', '').split('_');
                return {
                    year,
                    month,
                };
            });
            return parsed;
        });

        return { availableDates: availableMonths.flat(2) };
    }


    getLocationByConcreteMonth(month: string, year: string) {
        const locationsPath = join(LOCATIONS_PATH, year, `${year}_${month.toUpperCase()}.json`);
        const file = readFileSync(locationsPath, 'utf-8');

        const parsed: SemanticLocationHistory = JSON.parse(file);
        const visits = this.locationService.convertGoogleLocationToSimpleView(parsed.timelineObjects);

        return { timelineObjects: visits };
    }

    getAvailableLocationByInterval(startDate: string, endDate: string) {
        const [endMonth, endYear] = endDate.split('.');
        const [startMonth, startYear] = startDate.split('.');

        const locationsInStartYear = readdirSync(join(LOCATIONS_PATH, startYear)).filter((filename) => {
            return startMonth <= AllMonths[getMonthFromFilename(filename).toLowerCase()];
        });

        const innerYears = getYearsBetween(Number.parseInt(startYear), Number.parseInt(endYear))

        const locationInInnerYear = innerYears.flatMap((year) => readdirSync(join(LOCATIONS_PATH, year)));

        const locationsInEndYear = readdirSync(join(LOCATIONS_PATH, endYear)).filter(
            (month) => endMonth >= AllMonths[getMonthFromFilename(month).toLowerCase()],
        );

        const locations = [...locationsInStartYear, ...locationInInnerYear, ...locationsInEndYear];
        return {locations, years: [startYear, ...innerYears, endYear]};
    }

    getAvailableDateIntervals(startDate: string, endDate: string) {
        const {locations, years} = this.getAvailableLocationByInterval(startDate, endDate);
        return {
            years,
            timelineObjects: locations.flatMap((filename) => {
                const [year, any] = filename.split('_');
                const monthVisit = JSON.parse(readFileSync(join(LOCATIONS_PATH, year, filename), 'utf-8'));
                return this.locationService.convertGoogleLocationToSimpleView(monthVisit.timelineObjects);
            }),
        };
    }
}
