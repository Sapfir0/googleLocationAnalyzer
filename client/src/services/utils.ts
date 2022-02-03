import { scale } from "chroma-js";

export const getColorList = (yearCount: number) => {
    const colorGradient = ['red', 'blue'];
    return scale(colorGradient).mode('lch').colors(yearCount);
};