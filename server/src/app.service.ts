import { Injectable } from '@nestjs/common';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { LOCATIONS_PATH } from './config';
import { LocationInfo, PlaceVisit, SemanticLocationHistory } from './typings';

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
    const visits = parsed.timelineObjects.reduce(
      // @ts-ignore
      (acc: PlaceVisit[], visit: LocationInfo) => {
        if ('placeVisit' in visit) {
          const { placeVisit } = visit;
          acc.push({
            ...placeVisit,
            centerLatE7: this.getCoordinate(placeVisit.centerLatE7),
            centerLngE7: this.getCoordinate(placeVisit.centerLngE7),
          });
        }
        return acc
      },
      [],
    );

    return { timelineObjects: visits };
  }

  getLocationsByInterval(startDate: string, endDate: string) {
    const [endMonth, endYear] = endDate.split('.');
    const [startMonth, startYear] = startDate.split('.');

    const locationsPath = join(LOCATIONS_PATH, startYear);

    const allMonths = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'Jule',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const files = readdirSync(locationsPath)

    return { timelineObjects: files };
  }
}
