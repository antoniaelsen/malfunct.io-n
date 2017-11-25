// canvas.js

function compare(a, b) {
  var i = options.s_sort_criteria;
  if (a[i] === b[i]) {
      return 0;
  }
  else {
    if (options.s_sort_order == "DESCENDING") {
      return (a[i] < b[i]) ? -1 : 1;
    } else if (options.s_sort_order == "ASCENDING") {
      return (a[i] < b[i]) ? 1 : -1;
    }
  }
}

// TODO(aelsen): Works, but so clunky.
function thresholdGreaterThan(array, threshold){
  for (var i = 0; i < array.length; i++) {
    if (array[i] >= threshold) {return i;}
  }
  return -1;
}
function thresholdLessThan(array, threshold){
  for (var i = 0; i < array.length; i++) {
    if (array[i] <= threshold) {return i;}
  }
  return -1;
}


// Color Operations
function data2HSLAArray(data) {
  var array = [];
  for(var i = 0; i < data.length; i+=4){
    var hsl = RGB2HSL(data[i + 0], data[i + 1], data[i + 2]);
    var pixel = [hsl[0], hsl[1], hsl[2], data[i + 3]];
    array.push(pixel);
  }
  return array;
}

function data2RGBAArray(data) {
  var array = [];
  for(var i = 0; i < data.length; i+=4){
    var pixel = [data[i + 0], data[i + 1], data[i + 2], data[i + 3]];
    array.push(pixel);
  }
  return array;
}

function HSLAArray2Data(array) {
  var data = [];
  for(var i = 0; i < array.length; i++){
    var hsla = array[i];
    var rgb = HSL2RGB(hsla[0], hsla[1], hsla[2]);
    data.push(rgb[0]);
    data.push(rgb[1]);
    data.push(rgb[2]);
    data.push(hsla[3]);
  }
  return Uint8ClampedArray.from(data);
}

function RGBAArray2Data(array) {
  var data = [];
  for(var i = 0; i < array.length; i++){
    var pixel = array[i];
    data.push(pixel[0]);
    data.push(pixel[1]);
    data.push(pixel[2]);
    data.push(pixel[3]);
  }
  return Uint8ClampedArray.from(data);
}


var HUE2RGB = function HUE2RGB(p, q, h){
  if(h < 0) h += 1;
  if(h > 1) h -= 1;
  if(h < 1/6) return p + (q - p) * 6 * h;
  if(h < 1/2) return q;
  if(h < 2/3) return p + (q - p) * (2/3 - h) * 6;
  return p;
}

function HSL2RGB(h, s, l) {
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
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function HSLAArray2RGBAArray(hsla) {
  var rgba = [];
  for(var i = 0; i < hsla.length; i++){
    var rgb = HSL2RGB(hsla[i][0], hsla[i][1], hsla[i][2]);
    rgba.push([rgb[0], rgb[1], rgb[2], hsla[i][3]]);
  }
  return rgba;
}

function RGB2HSL(r, g, b) {
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

// Canvas Operations
function resizeCanvas(canvas, width, height){
  canvas.width = width;
  canvas.height = height;
}

function calculateScalingFactor(src_width, src_height, dest_width, dest_height){
  // Calculates a scaling factor to shrink the image.
  //  The factor is based on the orientation which
  //  is closest to the desired (dest) size.
  //  Does not expand.
  var factor = Math.min(
      (dest_width / src_width), 
      (dest_height / src_height));
  console.log("Width: " + (dest_width / src_width));
  console.log("Height: " + (dest_height / src_height));
  console.log("Factor: " + factor);
  return factor;
}