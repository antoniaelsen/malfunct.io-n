var op = {
  toggle_stage_mask: false,
  s_replace: "REPLACE",
  s_sort_criteria: 2,
  s_axis: "COLUMNS",
  s_sort_order: "ASCENDING",
  s_threshold_search_dir: "DOWNWARD",
  s_threshold_start_dir: "ABOVE",
  s_threshold_start_mode: 2,
  s_threshold_end_dir: "BELOW",
  s_threshold_end_mode: 2,
  i_threshold_start: 0,
  i_threshold_end: 1
};

var crs_x = 0, crs_y = 0;
var crs_drag, dragged;

var canvas_wrapper = document.getElementById('canvas_wrapper');
var canvas_container = document.getElementById('canvas_container');

var stage_editor = new Gesso();
var stage_mask = new Gesso();
var offscreen_editor = new Gesso();
var offscreen_mask = new Gesso();
stage_editor.canvas.setAttribute("id", "stage_editor");
stage_mask.canvas.setAttribute("id", "stage_mask");
stage_mask.canvas.setAttribute("class", "col col-auto");
stage_mask.canvas.setAttribute("style", "display: none; pointer-events: none; position: absolute; left: 0px; z-index: 2000;");
// offscreen_editor.canvas.setAttribute("style", "display: none;");
// offscreen_mask.canvas.setAttribute("style", "display: none;");
canvas_container.appendChild(stage_editor.canvas);
canvas_container.appendChild(stage_mask.canvas);
// document.body.appendChild(offscreen_editor.canvas);
// document.body.appendChild(offscreen_mask.canvas);

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
  } 
  return -1;
}

function findBounds(pixels) {
  var bounds = [-1, -1];
  var line = pixels.slice();

  // Look from the end to the front
  if (op.s_threshold_search_dir == "UPWARD") {
    line.reverse();
  }

  // Isolate values of the mode (H, S, or L)
  var start_line = line.map(
    function (v) { return v[op.s_threshold_start_mode]; });
  
  // Find the first pixel location that meets the threshold
  bounds[0] = findThreshold(
    start_line, op.i_threshold_start, op.s_threshold_start_dir);
  if (bounds[0] == -1 || bounds[0] == (line.length - 1)) { return bounds; }

  // Isolate the remaining portion of the line
  bounded_line = line.slice(bounds[0] + 1, line.length);

  // Isolate the values of the end mode
  var end_line = bounded_line.map(
    function (v) { return v[op.s_threshold_end_mode]; });

  // Find the first pixel location that meets the threshold
  bounds[1] = bounds[0] + findThreshold(
    end_line, op.i_threshold_end, op.s_threshold_end_dir);

  if (op.s_threshold_search_dir == "UPWARD") {
    bounds[0] = line.length - bounds[0];
    bounds[1] = line.length - bounds[1];
    bounds.reverse();
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

function pixelsort() {
  if (!op.image_loaded) { return; }
  console.log("Sorting image with the following op:");
  console.log("   toggle_stage_mask: " + op.toggle_stage_mask);
  console.log("   s_sort_criteria: " + op.s_sort_criteria);
  console.log("   s_axis: " + op.s_axis);
  console.log("   s_sort_order: " + op.s_sort_order);
  console.log("   s_threshold_search_dir: " + op.s_threshold_search_dir);
  console.log("   s_threshold_start_dir: " + op.s_threshold_start_dir);
  console.log("   s_threshold_start_mode: " + op.s_threshold_start_mode);
  console.log("   s_threshold_end_dir: " + op.s_threshold_end_dir);
  console.log("   s_threshold_end_mode: " + op.s_threshold_end_mode);
  console.log("   i_threshold_start: " + op.i_threshold_start);
  console.log("   i_threshold_end: " + op.i_threshold_end);
  var start = Date.now();

  stage_editor.clear();
  stage_mask.clear();
  offscreen_mask.clear();
  offscreen_editor.redraw();

  var cwidth = offscreen_editor.width;
  var cheight = offscreen_editor.height;
  var length; var lines;
  var r = 0; var c = 0;
  var lwidth = 1; var lheight = 1;
  var completed = 0;

  if (op.s_axis == "COLUMNS") {
    length = cheight; lines = cwidth; lheight = length;
  } else if (op.s_axis == "ROWS") {
    length = cwidth; lines = cheight; lwidth = length;
  }
  
  for (var l = 0; l < lines; l++) {
    // Extract from canvas
    var line_data = offscreen_editor.ctx.getImageData(c, r, lwidth, lheight).data;
    
    // Convert to sortable pixel values
    var line_pixels = data2HSLAArray(line_data);

    // Find bounds
    var bounds = findBounds(line_pixels);
    
    var min = Math.min.apply(null, bounds);
    if (min >= 0 && bounds[0] < bounds[1]) {  
    
      // Isolate slice from bounds
      var slice_pixels = line_pixels.slice(bounds[0], bounds[1]);

      // Sort
      slice_pixels = sortSlice(slice_pixels);

      // Convert back to data
      slice_data = HSLAArray2Data(slice_pixels);
      
      // Determine coordinates
      var x = 0; var y = 0;
      var w = 1; var h = 1;
      if (op.s_axis == "COLUMNS") {
        x = c; y = bounds[0]; h = bounds[1] - bounds[0];
      } else if (op.s_axis == "ROWS") {
        x = bounds[0]; y = r; w = bounds[1] - bounds[0];
      } 

      offscreen_mask.ctx.fillStyle = "rgba(0, 255, 0, .33)";
      offscreen_mask.ctx.fillRect(x, y, w, h);
      var img = new ImageData(slice_data, w, h);
      offscreen_editor.ctx.putImageData(img, x, y);

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
  var data = stage_editor.ctx.getImageData(x, y, 1, 1).data;
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

// GUI Callbacks
function btnClear() {
  op.image_loaded = false;
  stage_editor.clear();
  stage_mask.clear();
  offscreen_editor.clear();
  offscreen_mask.clear();
  toggleImageButtons(!op.image_loaded);
}

function btnLoad() {
  $('#input_image').trigger("click");
}

function btnSave() {
  var a = document.createElement('a');
  function saveImage(blob) {
    a.download = 'malfunction-output.png';
    a.href = window.URL.createObjectURL(blob);
    a.click();
    a.remove();
  }
  var blob = offscreen_editor.canvas.toBlob(saveImage);
}

function handleInput(e) {
  pixelsort();
  stage_editor.redraw(offscreen_editor.canvas);
  stage_mask.redraw(offscreen_mask.canvas);
}

function handleLoad(e) {
  var reader = new FileReader();
  reader.readAsDataURL(e.target.files[0]);
  reader.onload = function (event) {
    var img = new Image();
    img.src = event.target.result;

    img.onload = function () {
      src_img = this;

      stage_mask.resize(src_img.width, src_img.height);
      stage_editor.resize(src_img.width, src_img.height);
      offscreen_editor.resize(src_img.width, src_img.height);
      offscreen_mask.resize(src_img.width, src_img.height);
      stage_editor.load(src_img);
      offscreen_editor.load(src_img);

      op.image_loaded = true;
      toggleImageButtons(!op.image_loaded);
    }
  }
}

var handleScroll = function(evt){
  var delta = evt.wheelDelta ? evt.wheelDelta/40 : evt.detail ? -evt.detail : 0;
  if (delta) {
    stage_editor.zoom(null, delta, crs_x, crs_y);
    stage_mask.zoom(null, delta, crs_x, crs_y);
  }
  return evt.preventDefault() && false;
};

function toggleImageButtons(state) {
  $("#btn_save").prop("disabled", state);
  $("#btn_clear").prop("disabled", state);
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
stage_editor.canvas.addEventListener('mousemove', pickColor);

$("#input_image").on("change", handleLoad);
$("#btn_load").on("click", btnLoad);
$("#btn_save").on("click", btnSave);
$("#btn_clear").on("click", btnClear);
$("#btn_sort").on("click", handleInput);


$("#i_threshold_start").on("change", function (e) { op.i_threshold_start = e.target.value; });
$("#i_threshold_end").on("change", function (e) { op.i_threshold_end = e.target.value; });

$("#s_axis").on("change", function (e) { op.s_axis = e.target.value; });
$("#s_value_order").on("change", function (e) { op.s_sort_order = e.target.value; });
$("#s_threshold_search_dir").on("change", function (e) { op.s_threshold_search_dir = e.target.value; });
$("#s_threshold_start_dir").on("change", function (e) { op.s_threshold_start_dir = e.target.value; });
$("#s_threshold_end_dir").on("change", function (e) { op.s_threshold_end_dir = e.target.value; });

$("#toggle_mask").on("click", function (e) {
  op.toggle_stage_mask = (e.target.getAttribute("aria-pressed") === "false"); // TODO: what?
  var text = op.toggle_stage_mask ? "ON" : "OFF";
  $("#toggle_mask").text(text);
  $("#stage_mask").toggle();
});

$("#s_sort_criteria").on("change", function (e) {
  console.log("On sort criteria change: " + e.target.value);
  op.s_sort_criteria = e.target.value;
});

$("#s_threshold_start_mode").on("change", function (e) {
  op.s_threshold_target_mode = e.target.value;
});

$("#s_threshold_end_mode").on("change", function (e) {
  op.s_threshold_end_mode = e.target.value;
});

stage_editor.canvas.addEventListener('mousedown', function(evt) {
  document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
  crs_x = evt.offsetX || (evt.pageX - stage_editor.canvas.offsetLeft);
  crs_y = evt.offsetY || (evt.pageY - stage_editor.canvas.offsetTop);
  crs_drag = stage_editor.ctx.transformedPoint(crs_x, crs_y);
  dragged = false;
}, false);

stage_editor.canvas.addEventListener('mousemove', function(evt) {
  crs_x = evt.offsetX || (evt.pageX - stage_editor.canvas.offsetLeft);
  crs_y = evt.offsetY || (evt.pageY - stage_editor.canvas.offsetTop);
  dragged = true;
  if (crs_drag){
    stage_editor.pan(offscreen_editor.canvas, crs_x, crs_y, crs_drag.x, crs_drag.y);
    stage_mask.pan(offscreen_mask.canvas, crs_x, crs_y, crs_drag.x, crs_drag.y)
  }
}, false);

stage_editor.canvas.addEventListener('mouseup', function(evt) {
  crs_drag = null;
  if (!dragged) {
    stage_editor.zoom(offscreen_editor.canvas, evt.shiftKey ? -1 : 1, crs_x, crs_y );
    stage_mask.zoom(offscreen_mask.canvas, evt.shiftKey ? -1 : 1, crs_x, crs_y );
  }
}, false);


