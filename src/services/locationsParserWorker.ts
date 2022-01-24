import { Location, LocationView } from 'typings/common';


export default () => {

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
