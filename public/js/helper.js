// Math
function compare(a, b) {
  if (a === b) {
      return 0;
  }
  else {
    return (a < b) ? -1 : 1;
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