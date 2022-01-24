import { Injectable } from '@nestjs/common';
import { LocationInfo, PlaceVisit } from 'src/typings';
import { getCoordinate, isLocationsNear } from 'src/utils';

@Injectable()
export class LocationService {
    filterNearLocations(locations: PlaceVisit[]) {
        // @ts-ignore
        return locations.reduce((acc: PlaceVisit[], visit: PlaceVisit, i, arr) => {
            if (i !== 0) {
                const previousVisit = arr[i - 1];
                const isNear = isLocationsNear(visit.location as any, previousVisit.location as any);

                if (!isNear) {
                    acc.push(visit);
                }
            }
            return acc;
        }, []);
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
                    centerLatE7: getCoordinate(placeVisit.location.latitudeE7),
                    centerLngE7: getCoordinate(placeVisit.location.longitudeE7),
                });
            }
            return acc;
        }, []);
    }
}
