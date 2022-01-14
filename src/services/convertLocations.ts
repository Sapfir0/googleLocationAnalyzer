import { Location, LocationView } from 'typings/common';

const getCoordinate = (coordinate: string) => {
    const s = coordinate.slice(0, 2);
    const rest = coordinate.slice(2);
    return Number.parseFloat(`${s}.${rest}`);
};

export const parseLocationHistory = (locations: Location[]): LocationView[] => {
    return locations.map((loc) => ({
        lat: getCoordinate(loc.latitudeE7.toString()),
        lng: getCoordinate(loc.longitudeE7.toString()),
        timestamp: new Date(Number.parseInt(loc.timestampMs)),
    }));
};
