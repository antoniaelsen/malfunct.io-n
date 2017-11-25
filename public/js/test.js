var test_pixels = [
  [-1, 2, -1, 255],
  [80, 80, 80, 255], 
  [125, 150, 175, 255], 
  [255, 20, 60, 255], 
  [255, 255, 255, 255],
  [300, 300, 300, 300] 
];

var test_arrays = [
  [[76, 102, 85, 255]],
  [[80, 80, 80, 255], [125, 150, 175, 255], [255, 20, 60, 255]],
  [[23, 234, 10, 23], [75, 43, 63, 12], [23, 255, 255, 255], [255, 255, 0, 255]]
];


function test_compare(a, b) {
  if (a.length != b.length) { return false; }

  for (var i = 0; i < a.length; i++) {
    if (a[i] instanceof Array && b[i] instanceof Array) {
      compare(a[i], b[i]);

    } else if (a[i] != b[i]) {
      console.log("MISMATCH: " + a + " != " + b);
      return false;
    }
  }
  return true;
}

function test_color_conversion(trials) {
  var total = 0, failed = 0, succeeded = 0;

  for (var t = 0; t < trials.length; t++) {
    total++;
    test_rgba = trials[t]
    test_hsla = RGBA2HSLA(test_rgba);
    test_res = HSLA2RGBA(test_hsla);
  
    console.log("Test " + t);
    console.log("   RGBA: " + test_rgba);
    console.log("   HSLA: " + test_hsla);
    console.log("   RGBA: " + test_res);
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
    total++;
    test_rgba = trials[t]
    test_hsla = RGBAArray2HSLAArray(test_rgba);
    test_res = HSLAArray2RGBAArray(test_hsla);
  
    console.log("Test " + t);
    console.log("   RGBA: " + test_rgba);
    console.log("   HSLA: " + test_hsla);
    console.log("   RGBA: " + test_res);
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
    total++;
    test_rgba = trials[t]
    test_data = RGBAArray2Data(test_rgba);
    test_res = data2RGBAArray(test_data);
  
    console.log("Test " + t);
    console.log("   RGBA: " + test_rgba);
    console.log("   DATA: " + test_data);
    console.log("   RGBA: " + test_res);
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