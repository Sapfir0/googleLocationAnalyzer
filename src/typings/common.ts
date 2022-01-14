import { number } from "fp-ts";

type L1 = {
    timestampMs: string;
    activity: [
        {
            type: string;
            confidence: number;
        },
    ];
    source?: string;
    deviceTag?: number;
};

export type Location = {
    accuracy: number;
    activity?: L1[];
    deviceTag: number;
    latitudeE7: number;
    longitudeE7: number;
    source: string;
    timestampMs: string;
};

export type LocationView = {
    lat: number;
    lng: number;
    timestamp: Date
};
