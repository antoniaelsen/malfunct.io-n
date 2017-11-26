// Math
function compare(a, b) {
  if (a[i] === b[i]) {
      return 0;
  }
  else {
    return (a[i] < b[i]) ? -1 : 1;
  }
}

function compareElement(i) {
  return function(a, b) {
    if (a[i] === b[i]) {
      return 0;
    }
    else {
      return (a[i] < b[i]) ? -1 : 1;
    }
  }
}

function scaleFactor(src_width, src_height, dest_width, dest_height){
  // Calculates a scaling factor to shrink the image.
  //  The factor is based on the orientation which
  //  is closest to the desired (dest) size.
  var factor = Math.min(
      (dest_width / src_width), 
      (dest_height / src_height));
  return factor;
}

// Color Operations
function data2HSLAArray(data) {
  var hsla = RGBAArray2HSLAArray( data2RGBAArray(data) );
  return hsla;
}

function HSLAArray2Data(hsla) {
  var data = RGBAArray2Data( HSLAArray2RGBAArray(hsla) );
  return Uint8ClampedArray.from(data);
}

function data2RGBAArray(data) {
  var array = [];
  for(var i = 0; i < data.length; i+=4){
    var pixel = [data[i + 0], data[i + 1], data[i + 2], data[i + 3]];
    array.push(pixel);
  }
  return array;
}

function RGBAArray2Data(rgba) {
  var data = [];
  for(var i = 0; i < rgba.length; i++){
    for (var j = 0; j < 4; j++) { 
      data.push(rgba[i][j]); 
    }
  }
  return Uint8ClampedArray.from(data);
}

function HSLAArray2RGBAArray(hsla) {
  var rgba = [];
  for(var i = 0; i < hsla.length; i++){
    rgba.push(HSLA2RGBA(hsla[i]));
  }
  return rgba;
}

function RGBAArray2HSLAArray(rgba) {
  var hsla = [];
  for(var i = 0; i < rgba.length; i++){
    hsla.push(RGBA2HSLA(rgba[i]));
  }
  return hsla;
}

var HUE2RGB = function HUE2RGB(p, q, h){
  if(h < 0) h += 1;
  if(h > 1) h -= 1;
  if(h < 1/6) return p + (q - p) * 6 * h;
  if(h < 1/2) return q;
  if(h < 2/3) return p + (q - p) * (2/3 - h) * 6;
  return p;
}

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
        case r: h = ((g - b) / d) % 6 ; break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  return [h, s, l, a];
}