import { Inject } from '@nestjs/common';
import chroma from 'chroma-js';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { LOCATIONS_PATH } from './config';
import { LocationService } from './services/LocationService';
import { SemanticLocationHistory } from './typings';
import { AllMonths, getMonthFromFilename } from './utils';

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

    getColorList(yearCount: number) {
        const colorGradient = ['red', 'blue'];
        return chroma.scale(colorGradient).mode('lch').colors(yearCount);
    }

    getLocationByConcreteMonth(month: string, year: string) {
        // идем по папкам с годами и считаем число файлов с мепсяцами
        // генерим градиент с таким количеством переходов
        const locationsPath = join(LOCATIONS_PATH, year, `${year}_${month.toUpperCase()}.json`);
        const file = readFileSync(locationsPath, 'utf-8');

        const parsed: SemanticLocationHistory = JSON.parse(file);
        const visits = this.locationService.convertGoogleLocationToSimpleView(parsed.timelineObjects);

        return { timelineObjects: visits };
    }

    getAvailableLocationByInterval(startDate: string, endDate: string) {
        const [endMonth, endYear] = endDate.split('.').map(Number);
        const [startMonth, startYear] = startDate.split('.').map(Number);

        const locationsInStartYear = readdirSync(join(LOCATIONS_PATH, startYear.toString())).filter(
            (month) => startMonth <= AllMonths[getMonthFromFilename(month).toLowerCase()],
        );
        const innerYears = [];
        for (let i = startYear + 1; i < endYear; i++) {
            innerYears.push(i);
        }

        const locationInInnerYear = innerYears.flatMap((year) => readdirSync(join(LOCATIONS_PATH, year.toString())));

        const locationsInEndYear = readdirSync(join(LOCATIONS_PATH, endYear.toString())).filter(
            (month) => endMonth >= AllMonths[getMonthFromFilename(month).toLowerCase()],
        );

        const locations = [...locationsInStartYear, ...locationInInnerYear, ...locationsInEndYear];
        return locations;
    }

    getAvailableDateIntervals(startDate: string, endDate: string) {
        const locations = this.getAvailableLocationByInterval(startDate, endDate);
        return {
            timelineObjects: locations.flatMap((filename) => {
                const [year, any] = filename.split('_');
                const monthVisit = JSON.parse(readFileSync(join(LOCATIONS_PATH, year, filename), 'utf-8'));
                return this.locationService.convertGoogleLocationToSimpleView(monthVisit.timelineObjects);
            }),
        };
    }
}
