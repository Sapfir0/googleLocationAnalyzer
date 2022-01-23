import chroma from 'chroma-js';
import { Location, LocationView } from 'typings/common';

const colorGradient = ['red', 'blue'];

export default () => {


    const getColorList = (yearCount: number) => {
        return chroma.scale(colorGradient).mode('lch').colors(yearCount);
    };

    const getUniqueMonths = (locations: { timestamp: Date }[]) => {
        return new Set<string>(
            locations.reduce((months: string[], loc) => {
                months.push(`${loc.timestamp.getFullYear()}.${loc.timestamp.getMonth()}`);
                return months;
            }, []),
        );
    };

    const getMonthToColorMap = (locations: Omit<LocationView, 'color'>[]) => {
        const uniqueMonts = getUniqueMonths(locations.map((loc) => ({ timestamp: loc.timestamp })));
        const colorList = getColorList(uniqueMonts.size);
        const monthsToColor = new Map();

        let i = 0;
        for (const month of uniqueMonts.keys()) {
            monthsToColor.set(month, colorList[i]);
            i++;
        }
        return monthsToColor;
    };

    const parseLocationHistory = (locations: Location[]): LocationView[] => {
        const minDiff = 0.005;
        const newLocations = locations.reduce((resultedLocations, currentLoc, i, arr) => {
            if (i !== 0) {
                const previousLoc = arr[i - 1];
                const isNear =
                    Math.abs(currentLoc.latitudeE7 - previousLoc.latitudeE7) < minDiff &&
                    Math.abs(currentLoc.longitudeE7 - previousLoc.longitudeE7) < minDiff;
                if (!isNear) {
                    resultedLocations.push({
                        lat: getCoordinate(currentLoc.latitudeE7.toString()),
                        lng: getCoordinate(currentLoc.longitudeE7.toString()),
                        timestamp: new Date(Number.parseInt(currentLoc.timestampMs)),
                    });
                }
            }
            return resultedLocations;
        }, [] as Omit<LocationView, 'color'>[]);

        const monthsToColor = getMonthToColorMap(newLocations);

        return newLocations.map((loc) => ({
            ...loc,
            color: monthsToColor.get(`${loc.timestamp.getFullYear()}.${loc.timestamp.getMonth()}`),
        }));
    };

    self.onmessage = (message) => {
        console.log(message.data);

        const data = JSON.parse(message.data, (key: string, value: any) => {
            console.log(key, value);
        });
        console.time();
        const result = parseLocationHistory(data.locations);
        console.timeEnd();
        postMessage(result);
    };
};
