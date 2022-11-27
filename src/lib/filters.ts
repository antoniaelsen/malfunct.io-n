import { pixel, rgbaToBlue, rgbaToGreen, rgbaToHue, rgbaToLuminosity, rgbaToRed, rgbaToSaturation } from "./image";
import type { Pixel } from "./image";

export type Filter = (src: ImageData) => void;

export type PixelTransform = (input: Pixel) => Pixel;

export const filterFactory = (transform: PixelTransform): Filter => (imageData: ImageData): void => {
  const buf = new ArrayBuffer(imageData.data.length);
  const buf8 = new Uint8ClampedArray(buf);
  const data = new Uint32Array(buf);  
  
  for (let x = 0; x < imageData.width; x++) {
    for (let y = 0; y < imageData.height; y++) {
      const i = y * imageData.width + x;
      const input =  pixel(imageData, x * 4, y * 4);
      const output = transform(input);
      data[i] =
        (output.alpha << 24) |	// alpha
        (output.b << 16) |	    // blue
        (output.g <<  8) |	    // green
        output.r;		            // red
    }
  }
  imageData.data.set(buf8);
};

export type FilterMap = { [key: string]: Filter };

export const filters: FilterMap = {
  "b": filterFactory(rgbaToBlue),
  "g": filterFactory(rgbaToGreen),
  "h": filterFactory(rgbaToHue),
  "l": filterFactory(rgbaToLuminosity),
  "r": filterFactory(rgbaToRed),
  "s": filterFactory(rgbaToSaturation),
};
