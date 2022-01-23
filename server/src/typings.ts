
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

export interface ActivitySegment {
  startLocation: {};
  endLocation: {};
  duration: {};
}

type PlaceVisitLocation = {
  placeVisit: PlaceVisit;
};

type ActivitySegmentLocation = {
  activitySegment: ActivitySegment;
};

export type LocationInfo = PlaceVisitLocation | ActivitySegmentLocation;

export type SemanticLocationHistory = {
  timelineObjects: LocationInfo[];
};
