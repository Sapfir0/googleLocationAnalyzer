import { PlaceVisit } from "../typings/common";

export default () => {
    const addColorProp = (colors: string[], years: string[], location: PlaceVisit) => {
        const map = new Map();

        for (let i = 0; i < colors.length; i++) {
            map.set(years[i], colors[i]);
        }
        const d = new Date(location.duration.startTimestamp);

        return {
            ...location,
            color: map.get(d.getFullYear()),
        };
    };

    self.onmessage = (message: {data: {years: string[], colors: string[], timelineObjects: PlaceVisit[]}}) => {
        const {years, colors, timelineObjects} = message.data
        console.log(message.data);
        console.time();
        const result = timelineObjects.map((loc) => addColorProp(colors, years, loc));
        console.timeEnd();
        postMessage({timelineObjects: result, colors, years});
    };
};
