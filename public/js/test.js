var debug = true;

var test_pixels = [
  [-1, 2, -1, 255],
  [80, 80, 80, 255], 
  [125, 150, 175, 255], 
  [255, 20, 60, 255], 
  [255, 255, 255, 255],
  [300, 300, 300, 300],
  [8, 1, 2, 255]
];

var test_arrays = [
  [[76, 102, 85, 255]],
  [[80, 80, 80, 255], [125, 150, 175, 255], [255, 20, 60, 255]],
  [[23, 234, 10, 23], [75, 43, 63, 12], [23, 255, 255, 255], [255, 255, 0, 255]],
  [[8, 1, 2, 255],[8, 1, 2, 255]]
];

function debug_log(str) {
  if (debug) {
    console.log(str);
  }
}

function test_compare(a, b) {
  if (a.length != b.length) { return false; }

  for (var i = 0; i < a.length; i++) {
    if (a[i] instanceof Array && b[i] instanceof Array) {
      if (!compare(a[i], b[i])) { return false; }

    } else if (a[i] != b[i]) {
      debug_log("MISMATCH: " + a.toString() + " != " + b.toString());
      return false;
    }
  }
  return true;
}

function test_color_conversion(trials) {
  var total = 0, failed = 0, succeeded = 0;

  for (var t = 0; t < trials.length; t++) {
    debug_log("Test " + t.toString());
    total++;
    test_rgba = trials[t]
    test_hsla = RGBA2HSLA(test_rgba);
    test_res = HSLA2RGBA(test_hsla);

    
    debug_log("   RGBA: " + test_rgba.toString());
    debug_log("   HSLA: " + test_hsla.toString());
    debug_log("   RGBA: " + test_res.toString());
    if (!test_compare(test_rgba, test_res)) {
      console.log("   Expected " + test_rgba + ", got " + test_res);
      failed++;
    }
  }
  succeeded = total - failed;
  console.log(total + " TESTS: " + succeeded + " PASSED, " + failed + " FAILED.");
}

function test_color_array_conversion(trials) {
  var total = 0, failed = 0, succeeded = 0;

  for (var t = 0; t < trials.length; t++) {
    debug_log("Test " + t.toString());
    total++;
    test_rgba = trials[t]
    test_hsla = RGBAArray2HSLAArray(test_rgba);
    test_res = HSLAArray2RGBAArray(test_hsla);
  
    debug_log("   RGBA: " + test_rgba.toString());
    debug_log("   HSLA: " + test_hsla.toString());
    debug_log("   RGBA: " + test_res.toString());
    if (!test_compare(test_rgba, test_res)) {
      console.log("   Expected " + test_rgba + ", got " + test_res);
      failed++;
    }
  }
  succeeded = total - failed;
  console.log(total + " TESTS: " + succeeded + " PASSED, " + failed + " FAILED.");
}

function test_data_conversion(trials) {
  var total = 0, failed = 0, succeeded = 0;

  for (var t = 0; t < trials.length; t++) {
    debug_log("Test " + t.toString());
    total++;
    test_rgba = trials[t]
    test_data = RGBAArray2Data(test_rgba);
    test_hsla = data2HSLAArray(test_data);
    test_res = HSLAArray2RGBAArray(test_hsla);
  
    debug_log("   RGBA: " + test_rgba.toString());
    debug_log("   DATA: " + test_data.toString());
    debug_log("   HSLA: " + test_hsla.toString());
    debug_log("   RGBA: " + test_res.toString());
    if (!test_compare(test_rgba, test_res)) {
      console.log("   Expected " + test_rgba + ", got " + test_res);
      failed++;
    }
  }
  succeeded = total - failed;
  console.log(total + " TESTS: " + succeeded + " PASSED, " + failed + " FAILED.");
}

test_color_conversion(test_pixels);
test_color_array_conversion(test_arrays);
test_data_conversion(test_arrays);