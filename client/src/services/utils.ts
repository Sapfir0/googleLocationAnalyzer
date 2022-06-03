import { scale } from 'chroma-js';

export const getColorList = (yearCount: number) => {
    const colorGradient = ['#800026', '#afdafc'];
    return scale(colorGradient).mode('lch').colors(yearCount);
};
