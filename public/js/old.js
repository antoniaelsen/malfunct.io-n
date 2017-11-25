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

var src_img = new Image();
var src_cvs = document.getElementById('src_cvs');
var src_ctx = src_cvs.getContext("2d");
var dst_cvs_wrapper = document.getElementById('dst_cvs_wrapper');
var dst_cvs = document.getElementById('dst_cvs');
var dst_ctx = dst_cvs.getContext("2d");

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

  var leading_axis = options.select_orientation == "VERTICAL" ? dst_cvs.height : dst_cvs.width;
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

  var width = dst_cvs.width;
  var height = dst_cvs.height;
  var lines = 0;

  dst_ctx.putImageData(
    src_ctx.getImageData(0, 0, width, height), 0, 0
  );
  
  // TODO(aelsen): Handle horizontal sort
  for (var c = 0; c < width; c++) {
    var column_data = src_ctx.getImageData(c, 0, 1, dst_cvs.height).data;
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

    // TODO(aelsen): Identify loss of accuracy
    slice_data = HSLAArray2Data(slice_hsla);

    var img = new ImageData(slice_data, 1, bounds[1] - bounds[0]);
    dst_ctx.putImageData(img, c, bounds[0]);
  }
  
  console.log("Done: " + lines + " lines applied.");
}





function handleInput(e){
  var id = e.target.id;
  console.log(" Handle input from " + id);
}


// GUI Callbacks
function btnLoad() {
  $('#image-input').trigger("click");
}


function inputLoad(e){
  var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = function(event){
      var img = new Image();
      img.src = event.target.result;
  
      img.onload = function(){
        loadSrc(this); 
      }
    }
}

function btnSave() {
  // TODO(aelsen): This is hacky as fuuuuuuuuuuck
  var a  = document.createElement('a');
  var dst_cvs_href = dst_cvs.toDataURL('image/png');
  
  a.href = dst_cvs_href;
  a.download = 'malfunction-output.png';

  a.click();
  a.remove();
}

function btnClear() {
  base_img = new Image();
  options.image_loaded = false;
  src_ctx.clearRect(0, 0, src_cvs.width, src_cvs.height);
  dst_ctx.clearRect(0, 0, dst_cvs.width, dst_cvs.height);
  toggleImageButtons(!options.image_loaded);
}

function loadSrc(img){
  src_img = img;

  resizeCanvas(src_cvs, src_img.width, src_img.height);
  src_ctx.clearRect(0, 0, src_cvs.width, src_cvs.height);

  // try {
    src_ctx.drawImage(img, 0, 0);
    loadDst(img);

    options.image_loaded = true;
    toggleImageButtons(!options.image_loaded)

  // } catch (INVALID_STATE_ERR){
  //   console.log("ERROR: Image has no data.");
  // }
}

function loadDst(img) {
  var cw = dst_cvs_wrapper.offsetWidth;
  var ch = dst_cvs_wrapper.offsetHeight;

  var scaling_factor =
    calculateScalingFactor(img.width, img.height, cw, ch);

  resizeCanvas(dst_cvs, img.width * scaling_factor, img.height * scaling_factor);
  dst_ctx.putImageData(data, 0, 0);
  dst_ctx.drawImage(img, 0, 0);
}

function toggleImageButtons(state){
  document.getElementById("save-button").disabled = state;
  document.getElementById("clear-button").disabled = state;
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

// TODO(aelsen): redraw canvas, appropriately sized

// Bindings
$(".save-button").disabled = !options.image_loaded;
$(".clear-button").disabled = !options.image_loaded;

$("#load-button").on("click", btnLoad);
$("#save-button").on("click", btnSave);
$("#clear-button").on("click", btnClear);
$("#image-input").on("change", inputLoad);

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
