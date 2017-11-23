// canvas.js

function data2array(data) {
  var array = [];
  for(var i = 0; i < data.length; i+=4){
    var hsl = rgb2hsl(data[i + 0], data[i + 1], data[i + 2]);
    var pixel = [hsl[0], hsl[1], hsl[2], data[i + 3]];
    array.push(pixel);
  }
  return array;
}

function array2data(array) {
  var data = [];
  for(var i = 0; i < array.length; i++){
    var pixel = array[i];
    var rgb = hsl2rgb(pixel[0], pixel[1], pixel[2]);
    data.push(rgb[0]);
    data.push(rgb[1]);
    data.push(rgb[2]);
    data.push(pixel[3]);
  }
  return Uint8ClampedArray.from(data);
}

var hue2rgb = function hue2rgb(p, q, t){
  if(t < 0) t += 1;
  if(t > 1) t -= 1;
  if(t < 1/6) return p + (q - p) * 6 * t;
  if(t < 1/2) return q;
  if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
  return p;
}

function hsl2rgb(h, s, l) {
  var r, g, b;

  // If the saturation is 0, the color is greyscale, r, g & b are the same.
  if(s == 0){
      r = g = b = l; 
  } else {
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function rgb2hsl(r, g, b) {
  r /= 255, 
  g /= 255, 
  b /= 255;
  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  // If RGB values are the same, the color is greyscale.
  if(max == min) {
    h = s = 0;
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch(max){
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h, s, l];
}

