var options = {
  toggle_mask: false,
  s_replace: "REPLACE",
  s_sort_criteria: 2, 
  s_orientation: "VERTICAL", 
  s_sort_order: "DESCENDING", 
  s_threshold_dir: "TOP TO BOT", 
  s_threshold_grad_dir: "HIGH TO LOW", 
  threshold_lower: 0,
  threshold_upper: 1
};

var src_img = new Image();
var src_cvs = document.getElementById('src_cvs');
var src_ctx = src_cvs.getContext("2d");
var dst_cvs_wrapper = document.getElementById('dst_cvs_wrapper');
var dst_cvs = document.getElementById('dst_cvs');
var dst_ctx = dst_cvs.getContext("2d");
trackTransforms(dst_ctx);

var image_loaded = false;

function threshold(pixels) {
  var bounds = [-1, -1];

  // Hax
  if (options.s_threshold_dir == "BOT TO TOP") { 
    pixels.reverse();
  }

  // Isolate values of the mode (H, S, or L)
  var mode_slice = pixels.map(
    function(v) {
      return v[options.s_sort_criteria]; 
    });

  if (options.s_threshold_grad_dir == "LOW TO HIGH") {
    bounds[0] = thresholdLessThan(mode_slice, options.threshold_lower);
    bounded_slice = mode_slice.slice(bounds[0], mode_slice.length);
    bounds[1] = bounds[0] + thresholdGreaterThan(bounded_slice, options.threshold_upper);
  } else if (options.s_threshold_grad_dir == "HIGH TO LOW") {
    bounds[0] = thresholdGreaterThan(mode_slice, options.threshold_upper);
    bounded_slice = mode_slice.slice(bounds[0], mode_slice.length);
    bounds[1] = bounds[0] + thresholdLessThan(bounded_slice, options.threshold_lower);
  }
  // console.log(bounds);

  var leading_axis = options.s_orientation == "VERTICAL" ? dst_cvs.height : dst_cvs.width;
  if (options.s_threshold_dir == "BOT TO TOP") { 
    var temp = leading_axis - bounds[0]
    bounds[0] = leading_axis - bounds[1];
    bounds[1] = temp;
  }

  return bounds;
}

function pixelsort(canvas, ctx) {
  if (!options.image_loaded) { return; }
  console.log("Sorting image with the following options:");
  console.log("   toggle_mask: " + options.toggle_mask);
  console.log("   s_sort_criteria: " + options.s_sort_criteria);
  console.log("   s_orientation: " + options.s_orientation);
  console.log("   s_sort_order: " + options.s_sort_order);
  console.log("   s_threshold_dir: " + options.s_threshold_dir);
  console.log("   s_threshold_grad_dir: " + options.s_threshold_grad_dir);
  console.log("   threshold_lower: " + options.threshold_lower);
  console.log("   threshold_upper: " + options.threshold_upper);

  load(canvas, ctx, src_img);
  var width = canvas.width;
  var height = canvas.height;
  var lines = 0;

  for (var c = 0; c < canvas.width; c++) {
    var line_data = ctx.getImageData(c, 0, 1, canvas.height).data;
    var line_hsla = data2HSLAArray(line_data);

    // Find bounds
    var bounds = threshold(line_hsla);
    var min = Math.min.apply(null, bounds);
    // console.log("Bounds: " + bounds);
    if (min < 0 || isNaN(min) || bounds[0] >= bounds[1]) {
      // console.log("Could not find bounds for column " + c);
      // console.log("Bounds: " + bounds);
      continue;
    }
    lines++;

    // Retrieve pixels within bounds
    var slice_hsla = line_hsla.slice(bounds[0], bounds[1]);
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
    ctx.putImageData(img, c, bounds[0]);
  }

  console.log("Done: " + lines + " lines applied.");
}

$(".dropdown-toggle").dropdown();


function toggleImageButtons(state){
  $("btn_save").disabled = state;
  $("btn_clear").disabled = state;
}

// GUI Callbacks
function handleInput(e){
  var id = e.target.id;
  console.log(" Handle input from " + id); 
  pixelsort(src_cvs, src_ctx);
  redraw(dst_cvs, dst_ctx, src_cvs);
}

function resize() {
  // var cw = dst_cvs_wrapper.offsetWidth;
  // var ch = dst_cvs_wrapper.offsetHeight;

  // resizeCanvas(dst_cvs, cw, ch);
  // redraw(dst_cvs, dst_ctx, src_cvs);
}

function btnLoad() {
  $('#input_image').trigger("click");
}

function inputLoad(e){
  var reader = new FileReader();
  reader.readAsDataURL(e.target.files[0]);
  reader.onload = function(event){
    var img = new Image();
    img.src = event.target.result;

    img.onload = function(){
      src_img = this;
      
      load(src_cvs, src_ctx, src_img);

      resizeCanvas(dst_cvs, src_img.width, src_img.height);
      redraw(dst_cvs, dst_ctx, src_cvs);

      options.image_loaded = true;
      toggleImageButtons(!options.image_loaded);
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

// Bindings
addEvent(window, "resize", resize);


$("#btn_load").on("click", btnLoad);
$("#btn_save").on("click", btnSave);
$("#btn_clear").on("click", btnClear);
$("#input_image").on("change", inputLoad);

$("#i_threshold_lower").on("change", function(e) { options.threshold_lower = e.target.value; });
$("#i_threshold_upper").on("change", function(e) { options.threshold_upper= e.target.value; });

$("#s_sort_orientation").on("change", function(e) { options.s_orientation= e.target.value; });
$("#s_value_order").on("change", function(e) { options.s_sort_order = e.target.value; });
$("#s_threshold_search_dir").on("change", function(e) { options.s_threshold_dir= e.target.value; });
$("#s_threshold_bound_order").on("change", function(e) { options.s_threshold_grad_dir= e.target.value; });

$("#toggle-mask").on("click", function(e) { 
  options.toggle_mask = (e.target.getAttribute("aria-pressed") === "false"); // TODO: what?
});

$("#s_sort_criteria").on("change", function(e) { 
  // TODO(aelsen): Dictionary.
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
  options.s_sort_criteria = mode; 
});

$(".ctrl").on("change", handleInput);