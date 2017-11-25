var options = {
  toggle_mask: false,
  s_replace: "REPLACE",
  s_sort_criteria: 2, 
  s_orientation: "COLUMNS", 
  s_sort_order: "DESCENDING", 
  s_threshold_search_dir: "DOWNWARD", 
  s_threshold_start_dir: "ABOVE", 
  s_threshold_end_dir: "BELOW", 
  threshold_start: 0,
  threshold_end: 1
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
  if (options.s_threshold_search_dir == "UPWARD") { 
    pixels.reverse();
  }

  // Isolate values of the mode (H, S, or L)
  var mode_slice = pixels.map(
    function(v) {
      return v[options.s_sort_criteria]; 
    });

  // TODO(aelsen): this could be way more elegant
  if (options.s_threshold_start_dir == "ABOVE") {
    bounds[0] = thresholdGreaterThan(mode_slice, options.threshold_start);
  } else if (options.s_threshold_start_dir == "BELOW") {
    bounds[0] = thresholdLessThan(mode_slice, options.threshold_start);
  }

  if (bounds[0] == -1) { return bounds; }
  bounded_slice = mode_slice.slice(bounds[0], mode_slice.length);

  if (options.s_threshold_end_dir == "ABOVE") {
    bounds[1] = thresholdGreaterThan(bounded_slice, options.threshold_end);
  } else if (options.s_threshold_end_dir == "BELOW") {
    bounds[1] = thresholdLessThan(bounded_slice, options.threshold_end);
  }

  // console.log(bounds);

  var leading_axis = options.s_orientation == "COLUMNS" ? dst_cvs.height : dst_cvs.width;
  if (options.s_threshold_search_dir == "UPWARD") { 
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
  console.log("   s_threshold_search_dir: " + options.s_threshold_search_dir);
  console.log("   s_threshold_start_dir: " + options.s_threshold_start_dir);
  console.log("   s_threshold_end_dir: " + options.s_threshold_end_dir);
  console.log("   threshold_start: " + options.threshold_start);
  console.log("   threshold_end: " + options.threshold_end);

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
    
    // Show bounds
    if (options.toggle_mask) {
      for (var i = 0; i < slice_hsla.length; i++) {
        slice_hsla[i][0] = 100;
      }
    } else {
      slice_hsla.sort(compare);
    }

    slice_data = HSLAArray2Data(slice_hsla);

    var img = new ImageData(slice_data, 1, bounds[1] - bounds[0]);
    ctx.putImageData(img, c, bounds[0]);
  }

  console.log("Done: " + lines + " lines applied.");
}

// $(".dropdown-toggle").dropdown();

function pickColor(e) {
  var x = event.layerX;
  var y = event.layerY;
  var data = dst_ctx.getImageData(x, y, 1, 1).data;
  var rgba = data2RGBAArray(data)[0];
  var hsla = RGBA2HSLA(rgba);

  var str_rgba = "RGBA(" + 
    rgba[0] + ", " + rgba[1] + ", " + rgba[2] + ", " + rgba[3] + ")"; // Ugh.

  $('#color_sample').css("background-color", str_rgba);
  $('#p_picker_r').text(rgba[0]);
  $('#p_picker_g').text(rgba[1]);
  $('#p_picker_b').text(rgba[2]);
  $('#p_picker_h').text(hsla[0].toFixed(2));
  $('#p_picker_s').text(hsla[1].toFixed(2));
  $('#p_picker_l').text(hsla[2].toFixed(2));
};

function toggleImageButtons(state){
  $("#btn_save").prop("disabled", state);
  $("#btn_clear").prop("disabled", state);
}

// GUI Callbacks
function handleInput(e){
  var id = e.target.id;
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
  var a  = document.createElement('a');
  var src_cvs_href = src_cvs.toDataURL('image/png');
  
  a.href = src_cvs_href;
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
dst_cvs.addEventListener('mousemove', pickColor);

$("#btn_load").on("click", btnLoad);
$("#btn_save").on("click", btnSave);
$("#btn_clear").on("click", btnClear);
$("#input_image").on("change", inputLoad);

$("#i_threshold_start").on("change", function(e) { options.threshold_start = e.target.value; });
$("#i_threshold_end").on("change", function(e) { options.threshold_end= e.target.value; });

$("#s_sort_orientation").on("change", function(e) { options.s_orientation= e.target.value; });
$("#s_value_order").on("change", function(e) { options.s_sort_order = e.target.value; });
$("#s_threshold_search_dir").on("change", function(e) { options.s_threshold_search_dir= e.target.value; });
$("#s_threshold_start_dir").on("change", function(e) { options.s_threshold_start_dir= e.target.value; });
$("#s_threshold_end_dir").on("change", function(e) { options.s_threshold_end_dir= e.target.value; });

$("#toggle-mask").on("click", function(e) { 
  options.toggle_mask = (e.target.getAttribute("aria-pressed") === "false"); // TODO: what?
  var text = options.toggle_mask ? "ON" : "OFF";
  $("#toggle-mask").text(text);
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
$("#toggle-mask").on("click", handleInput);