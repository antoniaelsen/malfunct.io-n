
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
