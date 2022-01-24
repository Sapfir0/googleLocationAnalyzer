import { PlaceVisit } from './typings';

export enum AllMonths {
  'january' = 1,
  'february' = 2,
  'march' = 3,
  'april' = 4,
  'may' = 5,
  'june' = 6,
  'jule' = 7,
  'august' = 8,
  'september' = 9,
  'october' = 10,
  'november' = 11,
  'december' = 12,
}

export const isLocationsNear = (locationA: PlaceVisit, locationB: PlaceVisit) => {
  const minDiff = 0.05;
  return (
    Math.abs(locationA.centerLatE7 - locationB.centerLngE7) < minDiff &&
    Math.abs(locationA.centerLngE7 - locationB.centerLngE7) < minDiff
  );
};

export const getCoordinate = (coordinate: number) => {
  const coord = coordinate.toString();
  return Number.parseFloat(`${coord.slice(0, 2)}.${coord.slice(2)}`);
}


export const getMonthFromFilename = (filename: string) => {
  return filename.match(/\d{4}_(\w*).json/)[1];
}
