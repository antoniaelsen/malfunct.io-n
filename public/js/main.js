var options = {
  toggle_mask: false,
  select_replace: "REPLACE",
  select_sort_criteria: 2, 
  select_orientation: "VERTICAL", 
  select_sort_order: "DESCENDING", 
  select_threshold_dir: "TOP TO BOT", 
  select_threshold_grad_dir: "HIGH TO LOW", 
  threshold_lower: 0,
  threshold_upper: 1,
  image_loaded: false
 };

// editor_canvas
var base_img = new Image();
var base_canvas = document.getElementById('base-canvas');
var bctx = base_canvas.getContext("2d");
var editor_canvas_wrapper = document.getElementById('editor-canvas-wrapper');
var editor_canvas = document.getElementById('editor-canvas');
var ectx = editor_canvas.getContext("2d");

$(".save-button").disabled = !options.image_loaded;
$(".clear-button").disabled = !options.image_loaded;

$("#load-button").on("click", handleButtonLoad);
$("#save-button").on("click", handleButtonSave);
$("#clear-button").on("click", handleButtonClear);
$("#image-input").on("change", handleImageInput);

$("#toggle-mask").on("click", function(e) { 
  options.toggle_mask = (e.target.getAttribute("aria-pressed") === "false"); // TODO: what?
  pixelsort();
});
$("#inputThresholdLower").on("change", function(e) { options.threshold_lower = e.target.value; });
$("#inputThresholdUpper").on("change", function(e) { options.threshold_upper= e.target.value; });

$("#selectOrientation").on("change", function(e) { options.select_orientation= e.target.value; });
$("#selectValueSortOrder").on("change", function(e) { options.select_sort_order = e.target.value; });
$("#selectThresholdDir").on("change", function(e) { options.select_threshold_dir= e.target.value; });
$("#selectThresholdGradientDir").on("change", function(e) { options.select_threshold_grad_dir= e.target.value; });
$("#selectMode").on("change", function(e) { 
  var mode = 2;
  switch(e.target.value) {
    case "HUE":
      mode = 0;
      break;
    case "SATURATION":
      mode = 1;
      break;
    case "LUMINOSITY":
      mode = 2;
      break;
  }
  options.select_sort_criteria = mode; 
});

$(".ctrl").on("change", handleInput);

$(document).ready(function() {
  $(".dropdown-toggle").dropdown();
});

function compare(a, b) {
  var i = options.select_sort_criteria;
  if (a[i] === b[i]) {
      return 0;
  }
  else {
    if (options.select_sort_order == "DESCENDING") {
      return (a[i] < b[i]) ? -1 : 1;
    } else if (options.select_sort_order == "ASCENDING") {
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

function threshold(pixels) {
  var bounds = [-1, -1];

  // Hax
  if (options.select_threshold_dir == "BOT TO TOP") { 
    pixels.reverse();
  }

  // Isolate values of the mode (H, S, or L)
  var mode_slice = pixels.map(
    function(v) {
      return v[options.select_sort_criteria]; 
    });

  if (options.select_threshold_grad_dir == "LOW TO HIGH") {
    bounds[0] = thresholdLessThan(mode_slice, options.threshold_lower);
    bounded_slice = mode_slice.slice(bounds[0], mode_slice.length);
    bounds[1] = bounds[0] + thresholdGreaterThan(bounded_slice, options.threshold_upper);
  } else if (options.select_threshold_grad_dir == "HIGH TO LOW") {
    bounds[0] = thresholdGreaterThan(mode_slice, options.threshold_upper);
    bounded_slice = mode_slice.slice(bounds[0], mode_slice.length);
    bounds[1] = bounds[0] + thresholdLessThan(bounded_slice, options.threshold_lower);
  }
  // console.log(bounds);

  var leading_axis = options.select_orientation == "VERTICAL" ? editor_canvas.height : editor_canvas.width;
  if (options.select_threshold_dir == "BOT TO TOP") { 
    var temp = leading_axis - bounds[0]
    bounds[0] = leading_axis - bounds[1];
    bounds[1] = temp;
  }

  return bounds;
}

function pixelsort(){
  if (!options.image_loaded) { return; }
  console.log("Sorting image with the following options:");
  console.log("   toggle_mask: " + options.toggle_mask);
  console.log("   select_sort_criteria: " + options.select_sort_criteria);
  console.log("   select_orientation: " + options.select_orientation);
  console.log("   select_sort_order: " + options.select_sort_order);
  console.log("   select_threshold_dir: " + options.select_threshold_dir);
  console.log("   select_threshold_grad_dir: " + options.select_threshold_grad_dir);
  console.log("   threshold_lower: " + options.threshold_lower);
  console.log("   threshold_upper: " + options.threshold_upper);

  var width = editor_canvas.width;
  var height = editor_canvas.height;
  var lines = 0;

  ectx.putImageData(
    bctx.getImageData(0, 0, width, height), 0, 0
  );
  
  for (var c = 0; c < width; c++) {
    var column_data = bctx.getImageData(c, 0, 1, editor_canvas.height).data;
    var column_hsl = data2HSLAArray(column_data);

    // Find bounds
    var bounds = threshold(column_hsl);
    var min = Math.min.apply(null, bounds);
    // console.log("Bounds: " + bounds);
    if (min < 0 || isNaN(min) || bounds[0] >= bounds[1]) {
      // console.log("Could not find bounds for column " + c);
      // console.log("Bounds: " + bounds);
      continue;
    }
    lines++;

    // Retrieve pixels within bounds
    var slice_hsla = column_hsl.slice(bounds[0], bounds[1]);
    slice_hsla.sort(compare);

    // Show bounds
    if (options.toggle_mask) {
      for (var i = 0; i < slice_hsla.length; i++) {
        slice_hsla[i][0] = 100;
      }
    }

    slice_data = HSLAArray2Data(slice_hsla);

    var img = new ImageData(slice_data, 1, bounds[1] - bounds[0]);
    ectx.putImageData(img, c, bounds[0]);
  }
  
  console.log("Done: " + lines + " lines applied.");
}


// GUI Callbacks
function handleButtonLoad() {
  $('#image-input').trigger("click");
}

function handleButtonSave() {
  // TODO(aelsen): This is hacky as fuuuuuuuuuuck
  var a  = document.createElement('a');
  var editor_canvas_href = editor_canvas.toDataURL('image/png');
  
  a.href = editor_canvas_href;
  a.download = 'malfunction-output.png';

  a.click();
  a.remove();
}

function handleButtonClear() {
  // TODO(aelsen): potentially add callback / listener to toggle buttons
  base_img = new Image();
  options.image_loaded = false;
  toggleImageButtons(!options.image_loaded);
  bctx.clearRect(0, 0, base_canvas.width, base_canvas.height);
  ectx.clearRect(0, 0, editor_canvas.width, editor_canvas.height);
}

function handleInput(e){
  var id = e.target.id;
  console.log(" Handle input from " + id);
  pixelsort();
}

function handleImageInput(e){
  var reader = new FileReader();

  reader.readAsDataURL(e.target.files[0]);
  reader.onload = function(event){
    var img = new Image();
    img.src = event.target.result;
    base_img = img;

    img.onload = function(){
      bctx.clearRect(0, 0, base_canvas.width, base_canvas.height);
      ectx.clearRect(0, 0, editor_canvas.width, editor_canvas.height);
      loadImage(this);
      options.image_loaded = true;
      toggleImageButtons(!options.image_loaded)
    }
  }
}

function toggleImageButtons(state){
  document.getElementById("save-button").disabled = state;
  document.getElementById("clear-button").disabled = state;
}

function resizeCanvas(canvas, width, height){
  canvas.width = width;
  canvas.height = height;
}

function loadImage(img) {
  var cw = editor_canvas_wrapper.offsetWidth;
  var ch = editor_canvas_wrapper.offsetHeight;

  var scaling_factor =
    calculateScalingFactor(img.width, img.height, cw, ch);

  resizeCanvas(editor_canvas, img.width * scaling_factor, img.height * scaling_factor);
  resizeCanvas(base_canvas, img.width * scaling_factor, img.height * scaling_factor);
  bctx.drawImage(img, 0, 0, img.width, img.height, 0, 0,
    img.width * scaling_factor, img.height * scaling_factor);
  ectx.drawImage(img, 0, 0, img.width, img.height, 0, 0,
    img.width * scaling_factor, img.height * scaling_factor);
}

function calculateScalingFactor(src_width, src_height, dest_width, dest_height){
  // Calculates a scaling factor to shrink the image.
  //  The factor is based on the orientation which
  //  is closest to the desired (dest) size.
  //  If the image is already smaller than the dest size, the factor is 1.
    return scale_factor = Math.min(
      Math.min(
        (dest_width / src_width), 
        (dest_height / src_height)), 
      1);
}

var addEvent = function(object, type, callback) {
    if (object == null || typeof(object) == 'undefined') return;
    if (object.addEventListener) {
        object.addEventListener(type, callback, false);
    } else if (object.attachEvent) {
        object.attachEvent("on" + type, callback);
    } else {
        object["on"+type] = callback;
    }
};
addEvent(window, "resize", pixelsort());
// autoLoad();
