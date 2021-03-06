import { ColoredPlaceVisit } from "components/Map";

export interface PlaceVisit {
    centerLatE7: number;
    centerLngE7: number;
    duration: { startTimestamp: Date; endTimestamp: Date };
    editConfirmationStatus: 'NOT_CONFIRMED';
    locationConfidence: number
    placeConfidence: 'HIGH_CONFIDENCE';
    placeVisitImportance: 'MAIN';
    placeVisitType: string;
    visitConfidence: number;
    location: {
      latitudeE7: number;
      longitudeE7: number;
      placeId: string;
      address: string;
      name: string;
      sourceInfo: {
        deviceTag: number;
      };
      locationConfidence: number;
      calibratedProbability: number;
    };
  }

export type LocationInfo = {
    timelineObjects: ColoredPlaceVisit[]
    years: string[]
    colors: string[]
}
