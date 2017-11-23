var base_img = new Image();
var options = {
  select_replace: "REPLACE",
  select_sort_criteria: 2, 
  select_orientation: "VERTICAL", 
  select_sort_order: "DESCENDING", 
  select_theshold_dir: "DESCENDING", 
  threshold_lower: 0,
  threshold_upper: 1,
  image_loaded: false
 };

// Canvas
var canvas_wrapper = document.getElementById('canvas-wrapper');
var canvas = document.getElementById('editor');
var ctx = canvas.getContext("2d");

$(".save-button").disabled = !options.image_loaded;
$(".clear-button").disabled = !options.image_loaded;

$("#load-button").on("click", handleButtonLoad);
$("#save-button").on("click", handleButtonSave);
$("#clear-button").on("click", handleButtonClear);
$("#image-input").on("change", handleImageInput);


$("#inputThresholdLower").on("change", function(e) { options.threshold_lower = e.target.value; });
$("#inputThresholdUpper").on("change", function(e) { options.threshold_upper= e.target.value; });

$("#selectOrientation").on("change", function(e) { options.select_orientation= e.target.value; });
$("#selectValueSortOrder").on("change", function(e) { options.select_sort_order = e.target.value; });
$("#selectThresholdDir").on("change", function(e) { options.select_theshold_dir= e.target.value; });
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

  // Isolate values of the mode (H, S, or L)
  var mode_slice = pixels.map(
    function(v) {
      return v[options.select_sort_criteria]; 
    });
  // console.log(mode_slice);

  if (options.select_sort_order == "DESCENDING") {
    bounds[0] = thresholdLessThan(mode_slice, .2);
    bounded_slice = mode_slice.slice(bounds[0], mode_slice.length);
    bounds[1] = bounds[0] + thresholdGreaterThan(bounded_slice, options.threshold_upper);
  } else if (options.select_sort_order == "ASCENDING") {
    bounds[0] = thresholdGreaterThan(mode_slice, options.threshold_upper);
    bounded_slice = mode_slice.slice(bounds[0], mode_slice.length);
    bounds[1] = bounds[0] + thresholdLessThan(bounded_slice, options.threshold_lower);
  }
  // console.log(bounds);
  return bounds;
}

function pixelsort(){
  console.log("Sorting image with the following options:");
  console.log("   select_sort_criteria: " + options.select_sort_criteria);
  console.log("   select_sort_order: " + options.select_sort_order);
  console.log("   select_theshold_dir: " + options.select_theshold_dir);
  console.log("   threshold_lower: " + options.threshold_lower);
  console.log("   threshold_upper: " + options.threshold_upper);
  for (var c = 0; c < canvas.width; c++) {
    var column_data = ctx.getImageData(c, 0, 1, canvas.height).data;
    var column_pixels = data2array(column_data);
    // console.log(column_pixels);

    // Hax
    if (options.select_theshold_dir == "ASCENDING") { 
      column_pixels.reverse();
    }

    // Find bounds
    var bounds = threshold(column_pixels);
    var min = Math.min.apply(null, bounds);
    // console.log("Bounds: " + bounds);
    if (min < 0 || isNaN(min) || bounds[0] >= bounds[1]) {
      // console.log("Could not find bounds for column " + c);
      // console.log("Bounds: " + bounds);
      continue;
    }
    

    // Sort pixels within bounds
    var slice_pixels = column_pixels.slice(bounds[0], bounds[1]);
    // console.log(slice_pixels);
    slice_pixels.sort(compare);
    // console.log(slice_pixels);

    // TODO(aelsen)
    // if (options.select_theshold_dir == "ASCENDING") { 
    //   console.log("Reversing");
    //   column_pixels.reverse();
    // }

    // Write pixels
    var slice_data = array2data(slice_pixels);
    
    var img = new ImageData(slice_data, 1, bounds[1] - bounds[0]);
    ctx.putImageData(img, c, bounds[0]);
  }
  
  console.log("done");
}


// GUI Callbacks
function handleButtonLoad() {
  $('#image-input').trigger("click");
}

function handleButtonSave() {
  // TODO(aelsen): This is hacky as fuuuuuuuuuuck
  var a  = document.createElement('a');
  var canvas_href = canvas.toDataURL('image/png');
  
  a.href = canvas_href;
  a.download = 'malfunction-output.png';

  a.click();
  a.remove();
}

function handleButtonClear() {
  // TODO(aelsen): potentially add callback / listener to toggle buttons
  base_img = new Image();
  options.image_loaded = false;
  toggleImageButtons(!options.image_loaded);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function handleInput(e){
  var id = e.target.id;
  console.log(" Handle input from " + id);
  loadImage(base_img);
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
      ctx.clearRect(0, 0, canvas.width, canvas.height);
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

function resizeCanvas(width, height){
  canvas.width = width;
  canvas.height = height;
}

function loadImage(img) {
  var cw = canvas_wrapper.offsetWidth;
  var ch = canvas_wrapper.offsetHeight;

  var scaling_factor =
    calculateScalingFactor(img.width, img.height, cw, ch);

  resizeCanvas(img.width * scaling_factor, img.height * scaling_factor);
  ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0,
    img.width * scaling_factor, img.height * scaling_factor);
}

function drawBorderShadow() {
  
  ctx.beginPath();
  ctx.globalCompositeOperation='source-atop';
  
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowBlur = 5;
  ctx.shadowColor = 'rgba(0, 0, 0, .66)';
  
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.stroke();
  
  ctx.globalCompositeOperation='source-over';
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
addEvent(window, "resize", loadImage);
// autoLoad();
