var op = {
  toggle_mask: false,
  s_replace: "REPLACE",
  s_sort_criteria: 2,
  s_axis: "COLUMNS",
  s_sort_order: "ASCENDING",
  s_threshold_search_dir: "DOWNWARD",
  s_threshold_start_dir: "ABOVE",
  s_threshold_end_dir: "BELOW",
  i_threshold_start: 0,
  i_threshold_end: 1
};

var src_img = new Image();
var src_cvs = document.getElementById('src_cvs');
var src_ctx = src_cvs.getContext("2d");
var dst_cvs_wrapper = document.getElementById('dst_cvs_wrapper');
var dst_cvs = document.getElementById('dst_cvs');
var dst_ctx = dst_cvs.getContext("2d");
trackTransforms(dst_ctx);

var image_loaded = false;

function findThreshold(array, value, direction) {
  var i = -1;
  if (direction == "ABOVE") {
    for (i = 0; i < array.length; i++) {
      if (array[i] >= value) {  return i; }
    }
  } else if (direction == "BELOW") {
    for (i = 0; i < array.length; i++) {
      if (array[i] <= value) {  return i; }
    }
  } else {
    console.log("ERR: Invalid direction.");
    return -1;
  }
  return -1;
}


function findBounds(pixels) {
  var bounds = [-1, -1];

  // Look from the end to the front
  if (op.s_threshold_search_dir == "UPWARD") {
    pixels.reverse();
  }

  // Isolate values of the mode (H, S, or L)
  var mode_slice = pixels.map(
    function (v) { return v[op.s_sort_criteria]; });

  bounds[0] = findThreshold(
    mode_slice, op.i_threshold_start, op.s_threshold_start_dir);
  if (bounds[0] == -1) { return bounds; }

  bounded_slice = mode_slice.slice(bounds[0] + 1, mode_slice.length);
  bounds[1] = bounds[0] + findThreshold(
    bounded_slice, op.i_threshold_end, op.s_threshold_end_dir);

  if (op.s_threshold_search_dir == "UPWARD") {
    var swap = pixels.length - bounds[0]
    bounds[0] = pixels.length - bounds[1];
    bounds[1] = swap;
  }
  return bounds;
}

function sortSlice(slice) {
  // Show bounds
  slice.sort(compareElement(op.s_sort_criteria));

  if (op.s_threshold_search_dir == "UPWARD") {
    slice.reverse();
  }
  if (op.s_sort_order == "DESCENDING") {
    slice.reverse();
  }
  return slice;
}

function pixelsort(canvas, ctx) {
  if (!op.image_loaded) { return; }
  console.log("Sorting image with the following op:");
  console.log("   toggle_mask: " + op.toggle_mask);
  console.log("   s_sort_criteria: " + op.s_sort_criteria);
  console.log("   s_axis: " + op.s_axis);
  console.log("   s_sort_order: " + op.s_sort_order);
  console.log("   s_threshold_search_dir: " + op.s_threshold_search_dir);
  console.log("   s_threshold_start_dir: " + op.s_threshold_start_dir);
  console.log("   s_threshold_end_dir: " + op.s_threshold_end_dir);
  console.log("   i_threshold_start: " + op.i_threshold_start);
  console.log("   i_threshold_end: " + op.i_threshold_end);

  var start = Date.now();

  load(canvas, ctx, src_img);
  var width = canvas.width;
  var height = canvas.height;

  var length; var lines;
  var r = 0; var c = 0;
  var width = 1; var height = 1;

  if (op.s_axis == "COLUMNS") {
    length = canvas.height;
    lines = canvas.width;
    height = length;
  } else if (op.s_axis == "ROWS") {
    length = canvas.width;
    lines = canvas.height;
    width = length;
  }

  var completed = 0;
  for (var l = 0; l < lines; l++) {
    // Extract from canvas
    var line_data = ctx.getImageData(c, r, width, height).data;
    
    // Convert to sortable pixel values
    var line_pixels = data2HSLAArray(line_data);
    // console.log(line_data);
    // console.log(line_pixels);

    // Find bounds
    var bounds = findBounds(line_pixels);
    // console.log(bounds);
    var min = Math.min.apply(null, bounds);
    if (min >= 0 && bounds[0] < bounds[1]) {  
    
      // Isolate slice from bounds
      var slice = line_pixels.slice(bounds[0], bounds[1]);

      // Sort
      slice = sortSlice(slice);

      // Convert back to data
      slice_data = HSLAArray2Data(slice);

      
      // Determine coordinates
      var x = 0; var y = 0;
      var w = 1; var h = 1;
      if (op.s_axis == "COLUMNS") {
        x = c; y = bounds[0]; h = bounds[1] - bounds[0];
      } else if (op.s_axis == "ROWS") {
        x = bounds[0]; y = r; w = bounds[1] - bounds[0];
      } 

      if (op.toggle_mask) {
        ctx.fillStyle = "rgba(0, 255, 0, .33)";
        ctx.fillRect(x, y, w, h);
      } else {
        var img = new ImageData(slice_data, w, h);
        ctx.putImageData(img, x, y);
      }

      completed++;
    }
    if (op.s_axis == "COLUMNS") {c++;} else if (op.s_axis == "ROWS") {r++;} 
  }

  var elapsed = (Date.now() - start) / 1000.0;
  console.log("Sorting complete: " + completed + " / " + lines + " lines sorted in " + elapsed + " seconds.");
}

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

function toggleImageButtons(state) {
  $("#btn_save").prop("disabled", state);
  $("#btn_clear").prop("disabled", state);
}

// GUI Callbacks
function handleInput(e) {
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

function inputLoad(e) {
  var reader = new FileReader();
  reader.readAsDataURL(e.target.files[0]);
  reader.onload = function (event) {
    var img = new Image();
    img.src = event.target.result;

    img.onload = function () {
      src_img = this;

      load(src_cvs, src_ctx, src_img);

      resizeCanvas(dst_cvs, src_img.width, src_img.height);
      redraw(dst_cvs, dst_ctx, src_cvs);

      op.image_loaded = true;
      toggleImageButtons(!op.image_loaded);
    }
  }
}

function btnSave() {
  var a = document.createElement('a');

  function saveImage(blob) {
    a.download = 'malfunction-output.png';
    a.href = window.URL.createObjectURL(blob);
    a.click();
    a.remove();
  }

  var blob = src_cvs.toBlob(saveImage);
}

function btnClear() {
  op.image_loaded = false;
  src_ctx.clearRect(0, 0, src_cvs.width, src_cvs.height);
  dst_ctx.clearRect(0, 0, dst_cvs.width, dst_cvs.height);
  toggleImageButtons(!op.image_loaded);
}

var addEvent = function (object, type, callback) {
  if (object == null || typeof (object) == 'undefined') return;
  if (object.addEventListener) {
    object.addEventListener(type, callback, false);
  } else if (object.attachEvent) {
    object.attachEvent("on" + type, callback);
  } else {
    object["on" + type] = callback;
  }
};

// Bindings
addEvent(window, "resize", resize);
dst_cvs.addEventListener('mousemove', pickColor);

$("#btn_load").on("click", btnLoad);
$("#btn_save").on("click", btnSave);
$("#btn_clear").on("click", btnClear);
$("#input_image").on("change", inputLoad);

$("#i_threshold_start").on("change", function (e) { op.i_threshold_start = e.target.value; });
$("#i_threshold_end").on("change", function (e) { op.i_threshold_end = e.target.value; });

$("#s_axis").on("change", function (e) { op.s_axis = e.target.value; });
$("#s_value_order").on("change", function (e) { op.s_sort_order = e.target.value; });
$("#s_threshold_search_dir").on("change", function (e) { op.s_threshold_search_dir = e.target.value; });
$("#s_threshold_start_dir").on("change", function (e) { op.s_threshold_start_dir = e.target.value; });
$("#s_threshold_end_dir").on("change", function (e) { op.s_threshold_end_dir = e.target.value; });

$("#toggle-mask").on("click", function (e) {
  op.toggle_mask = (e.target.getAttribute("aria-pressed") === "false"); // TODO: what?
  var text = op.toggle_mask ? "ON" : "OFF";
  $("#toggle-mask").text(text);
});

$("#s_sort_criteria").on("change", function (e) {
  // TODO(aelsen): Dictionary.
  var mode = 2;
  switch (e.target.value) {
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
  op.s_sort_criteria = mode;

  // TODO(aelsen): Change inputs and their bounds as necessary.
});


$(".ctrl").on("change", handleInput);
$("#toggle-mask").on("click", handleInput);



