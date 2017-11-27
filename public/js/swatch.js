/*
 * Swatch
 * A collection of tools for color operations.
 * 
 * RGB x HSL conversion formulae taken from:
 * https://stackoverflow.com/a/2353265
 * https://gist.github.com/mjackson/5311256 
 * https://en.wikipedia.org/wiki/HSL_and_HSV 
 */

/**
 * Picker Class
 * @param {CanvasRenderingContext2D} ctx
 */
var Picker = function (ctx) {
  this.ctx = ctx;
};

/**
 * Returns the pixel at the coordinates x, y.
 * @param {number} x 
 * @param {number} y 
 */
Picker.prototype.pick = function(x, y) {
  return this.ctx.getImageData(x, y, 1, 1).data;
};

// Color Operations

/**
 * Converts hue, saturation, and luminance to r, g, and b values.
 *  q = l < 0.5 ? l * (1 + s) : l + s - l * s;
 *  p = 2 * l - q;
 *  h = h / 360;
 * @param {number} p 
 * @param {number} q 
 * @param {number} h 
 * @returns {number}
 */
function HUE2RGB(p, q, h){
  if(h < 0) h += 1;
  if(h > 1) h -= 1;
  if(h < 1/6) return p + (q - p) * 6 * h;
  if(h < 1/2) return q;
  if(h < 2/3) return p + (q - p) * (2/3 - h) * 6;
  return p;
}

/**
 * Converts an [H, S, L, A] pixel to [R, G, B, A].
 * @param {number[]} hsla 
 * @returns {number[]}
 */
function HSLA2RGBA(hsla) {
  var h = hsla[0], s = hsla[1], l = hsla[2], a = hsla[3]; 
  var r, g, b;
  
  if(s == 0){
    // If the saturation is 0, the color is greyscale, r, g & b are equal to 
    //  the luminance.
    r = g = b = l; 
  } else {
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      var h = h / 360;
      r = HUE2RGB(p, q, h + 1/3);
      g = HUE2RGB(p, q, h);
      b = HUE2RGB(p, q, h - 1/3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), a];
}

/**
 * Converts an [R, G, B, A] pixel to [H, S, L, A].
 * @param {number[]} rgba 
 * @returns {number[]}
 */
function RGBA2HSLA(rgba) {
  var r = rgba[0], g = rgba[1], b = rgba[2], a = rgba[3];
  r /= 255, g /= 255, b /= 255;

  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var d = max - min;
  var h, s, l = (max + min) / 2;

  // If RGB values are the same, the color is greyscale.
  if(d == 0) {
    h = s = 0;
  } else {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch(max){
        case r: 
          h = ((g - b) / d) + (g < b ? 6 : 0); 
          break;
        case g: 
          h = (b - r) / d + 2; 
          break;
        case b: 
          h = (r - g) / d + 4; 
          break;
    }
    h *= 60;
  }
  return [h, s, l, a];
}

/**
 * Iterates over an ImageData array to conver the pixels to [H, S, L, A] pixels.
 * @param {ImageData[]} data 
 */
function data2HSLAArray(data) {
  var rgba = data2RGBAArray(data);
  var hsla = RGBAArray2HSLAArray(rgba);
  return hsla;
}

/**
 * Iterates over an ImageData array to conver the pixels to [R, G, B, A] pixels.
 * @param {ImageData[]} data 
 * @returns {number[]}
 */
function data2RGBAArray(data) {
  var array = [];
  for(var i = 0; i < data.length; i+=4){
    var pixel = [data[i + 0], data[i + 1], data[i + 2], data[i + 3]];
    array.push(pixel);
  }
  return array;
}

/**
 * Iterates over an array of [H, S, L, A] pixels to convert the pixels to 
 * an ImageData-ready Uint8ClampedArray array.
 * @param {number[]} hsla 
 * @returns {Uint8ClampedArray}
 */
function HSLAArray2Data(hsla) {
  var data = RGBAArray2Data( HSLAArray2RGBAArray(hsla) );
  return Uint8ClampedArray.from(data);
}

/**
 * Converts an array of [H, S, L, A] pixels to [R, G, B, A] pixels.
 * @param {number[]} hsla 
 * @returns {number[]}
 */
function HSLAArray2RGBAArray(hsla) {
  var rgba = [];
  for(var i = 0; i < hsla.length; i++){
    rgba.push(HSLA2RGBA(hsla[i]));
  }
  return rgba;
}

/**
 * Iterates over an array of [R, G, B, A] pixels to convert the pixels to 
 * an ImageData-ready Uint8ClampedArray array.
 * @param {number[]} rgba 
 * @returns {Uint8ClampedArray}
 */
function RGBAArray2Data(rgba) {
  var data = [];
  for(var i = 0; i < rgba.length; i++){
    for (var j = 0; j < 4; j++) { 
      data.push(rgba[i][j]); 
    }
  }
  return Uint8ClampedArray.from(data);
}

/**
 * Converts an array of [R, G, B, A] pixels to [H, S, L, A] pixels.
 * @param {number[]} rgba 
 * @returns {number[]}
 */
function RGBAArray2HSLAArray(rgba) {
  var hsla = [];
  for(var i = 0; i < rgba.length; i++){
    hsla.push(RGBA2HSLA(rgba[i]));
  }
  return hsla;
}