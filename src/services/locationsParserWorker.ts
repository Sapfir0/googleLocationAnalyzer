import { scale } from 'chroma-js';

export default () => {
    const getColorList = (yearCount: number) => {
        const colorGradient = ['red', 'blue'];
        return scale(colorGradient).mode('lch').colors(yearCount);
    };

    const addColorProp = (colors: string[], years: string[], location) => {
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

    self.onmessage = (message) => {
        console.log(message.data);
        const colors = getColorList(message.data.years.length);
        console.time();
        const result = message.data.timelineObjects.map((loc) => addColorProp(colors, message.data.years, loc));
        console.timeEnd();
        postMessage(result);
    };
};
