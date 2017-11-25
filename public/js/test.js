var results = {
  total: 0, 
  failed: 0
}

var test_rgba_trials = [
  [-1, 2, -1, 255],
  [80, 80, 80, 255], 
  [125, 150, 175, 255], 
  [255, 20, 60, 255], 
  [255, 255, 255, 255],
  [300, 300, 300, 300] 
];


function compare(a, b) {
  if (a.length != b.length) { return false; }

  for (var i = 0; i < a.length; i++) {
    if (a[i] != b[i]) {
      console.log("MISMATCH: " + a + " != " + b);
      return false;
    }
  }
  return true;
}

function test_rgba(trials) {
  for (var t = 0; t < trials.length; t++) {
    results.total++;
    test_rgba = trials[t]
    test_hsla = RGBA2HSLA(test_rgba);
    test_res = HSLA2RGBA(test_hsla);
  
    console.log("Test " + t);
    console.log("   RGBA: " + test_rgba);
    console.log("   HSLA: " + test_hsla);
    console.log("   RGBA: " + test_res);
    if (!compare(test_rgba, test_res)) {
      console.log("   Expected " + test_rgba + ", got " + test_res);
      results.failed++;
    }
  }
  var s = results.total - results.failed;
  console.log(results.total + " TESTS: " + s + " PASSED, " + results.failed + " FAILED.");
}

test_rgba(test_rgba_trials);