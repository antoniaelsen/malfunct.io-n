import Color from "color";

export interface Pixel {
  r: number;
  g: number;
  b: number;
  alpha: number;
}

export const pixel = (src: ImageData, x: number, y: number): Pixel => {
  const { data, width } = src;
  const i = width * y + x;
  return { r: data[i], g: data[i + 1], b: data[i + 2], alpha: data[i + 3] };
};


export const hue = ({ r, g, b }: Pixel) => {
  const cmin = Math.min(r, g, b);
  const cmax = Math.max(r, g, b);
  const delta = cmax - cmin;
  let h = 0;
  if (cmax === r) {
    h = (g - b) / delta;
  } else if (cmax === g) {
    h = 2 + (b - r) / delta;
  } else {
    h = 4 + (r - g) / delta;
  }
  h = h * 60;
  if (h < 0) h = 360 + h;
  return h;
}

export const rgbaToHue = (input: Pixel) => {
  const h = hue(input) / 360 * 255;
  return { r: h, g: h, b: h, alpha: input.alpha }
}

export const linearizeSRGB = (v: number) => {
  if (v <= 0.04045 ) {
    return v / 12.92;
  } else {
    return Math.pow((( v + 0.055) / 1.055), 2.4);
  }
};

export const luminance = ({ r, g, b }: Pixel) => {
  const lr = linearizeSRGB(r / 255);
  const lg = linearizeSRGB(g / 255);
  const lb = linearizeSRGB(b / 255);
  return (0.2126 * lr + 0.7152 * lg + 0.0722 * lb) * 255;
};

export const rgbaToLuminosity = (input: Pixel) => {
  const l = luminance(input);
  return { r: l, g: l, b: l, alpha: input.alpha };
};

export const rgbaToBlue = (input: Pixel) => {
  return { r: 0, g: 0, b: input.b, alpha: input.alpha };
};

export const rgbaToGreen = (input: Pixel) => {
  return { r: 0, g: input.g, b: 0, alpha: input.alpha };
};

export const rgbaToRed = (input: Pixel) => {
  return { r: input.r, g: 0, b: 0, alpha: input.alpha };
};

export const rgbaToSaturation = (input: Pixel) => {
  const s = saturation(input);
  return { r: s, g: s, b: s, alpha: input.alpha };
}

export const saturation = (input: Pixel) => {
  return new Color(input).hsl().object().s;
}
