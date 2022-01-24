import { Injectable } from '@nestjs/common';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { LOCATIONS_PATH } from './config';
import { LocationInfo, PlaceVisit, SemanticLocationHistory } from './typings';
import { AllMonths } from './utils';

@Injectable()
export class AppService {
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

  getCoordinate(coordinate: number) {
    const coord = coordinate.toString();
    return Number.parseFloat(`${coord.slice(0, 2)}.${coord.slice(2)}`);
  }

  convertGoogleLocationToSimpleView(locations: LocationInfo[]) {
    return locations.reduce((acc: PlaceVisit[], visit: LocationInfo) => {
      if (
        'placeVisit' in visit &&
        visit.placeVisit.location.latitudeE7 &&
        visit.placeVisit.location.longitudeE7
      ) {
        const { placeVisit } = visit;

        acc.push({
          ...placeVisit,
          centerLatE7: this.getCoordinate(placeVisit.location.latitudeE7),
          centerLngE7: this.getCoordinate(placeVisit.location.longitudeE7),
        });
      }
      return acc;
    }, []);
  }

  getLocationByConcreteMonth(month: string, year: string) {
    // идем по папкам с годами и считаем число файлов с мепсяцами
    // генерим градиент с таким количеством переходов
    const locationsPath = join(
      LOCATIONS_PATH,
      year,
      `${year}_${month.toUpperCase()}.json`,
    );
    const file = readFileSync(locationsPath, 'utf-8');

    const parsed: SemanticLocationHistory = JSON.parse(file);
    const visits = this.convertGoogleLocationToSimpleView(
      parsed.timelineObjects,
    );

    return { timelineObjects: visits };
  }

  getMonthFromFilename(filename: string) {
    return filename.match(/\d{4}_(\w*).json/)[1];
  }

  getAvailableDateIntervals(startDate: string, endDate: string) {
    const [endMonth, endYear] = endDate.split('.').map(Number);
    const [startMonth, startYear] = startDate.split('.').map(Number);

    const locationsInStartYear = readdirSync(
      join(LOCATIONS_PATH, startYear.toString()),
    ).filter(
      (month) =>
        startMonth <= AllMonths[this.getMonthFromFilename(month).toLowerCase()],
    );

    const innerYears = [];
    for (let i = startYear + 1; i < endYear; i++) {
      innerYears.push(i);
    }

    const locationInInnerYear = innerYears.flatMap((year) =>
      readdirSync(join(LOCATIONS_PATH, year.toString())),
    );

    const locationsInEndYear = readdirSync(
      join(LOCATIONS_PATH, endYear.toString()),
    ).filter(
      (month) =>
        endMonth >= AllMonths[this.getMonthFromFilename(month).toLowerCase()],
    );

    const locations = [
      ...locationsInStartYear,
      ...locationInInnerYear,
      ...locationsInEndYear,
    ];

    return {
      timelineObjects: locations.flatMap((filename) => {
        const [year, any] = filename.split('_');
        const monthVisit = JSON.parse(
          readFileSync(join(LOCATIONS_PATH, year, filename), 'utf-8'),
        );
        return this.convertGoogleLocationToSimpleView(
          monthVisit.timelineObjects,
        );
      }),
    };
  }
}
