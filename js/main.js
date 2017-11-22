// State vars
var select_mode = "LUMINOSITY";
var select_orientation = "VERTICAL";
var select_sort_order = "DESCENDING";
var threshold_min = 0;
var threshold_max = 0;
var image_loaded = false;

// Canvas
var canvas_wrapper = document.getElementById('canvas-wrapper');
var canvas = document.getElementById('editor');
var ctx = canvas.getContext("2d");
var canvas_img = new Image();

$(".save-button").disabled = !image_loaded;
$(".clear-button").disabled = !image_loaded;

$("#load-button").on("click", handleButtonLoad);
$("#save-button").on("click", handleButtonSave);
$("#clear-button").on("click", handleButtonClear);
$("#image-input").on("change", handleImageInput);


$("select").on("change", handleInput);
$("input").on("change", handleInput);

$(document).ready(function() {
  $(".dropdown-toggle").dropdown();
});

function handleButtonLoad() {
  $('#image-input').trigger("click");
}

function handleButtonSave() {
  // TODO(aelsen): This is hacky as fuuuuuuuuuuck
  resizeCanvas(canvas_img.width, canvas_img.height);
  ctx.drawImage(canvas_img, 
    0, 0, canvas_img.width, canvas_img.height, 
    0, 0, canvas_img.width, canvas_img.height);

  var a  = document.createElement('a');
  var canvas_href = canvas.toDataURL('image/png');
  
  a.href = canvas_href;
  a.download = 'malfunction-output.png';

  a.click();
  a.remove();
  redrawCanvas();
}

function handleButtonClear() {
  // TODO(aelsen): potentially add callback / listener to toggle buttons
  image_loaded = false;
  toggleImageButtons(!image_loaded);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function handleInput(e){
  console.log(" Handle input. ")
  // Switch dropdown button text to selection
}

function handleImageInput(e){
  var reader = new FileReader();

  reader.readAsDataURL(e.target.files[0]);
  reader.onload = function(event){
    var img = new Image();
    img.src = event.target.result;
    
    img.onload = function(){
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas_img = img;
      onImageLoad();
    }
  }
}

function onImageLoad(){
  redrawCanvas();
  image_loaded = true;
  toggleImageButtons(!image_loaded)
}

function toggleImageButtons(state){
  document.getElementById("save-button").disabled = state;
  document.getElementById("clear-button").disabled = state;
}



// view
function redrawCanvas(){
  var img = canvas_img;
  var cw = canvas_wrapper.offsetWidth;
  var ch = canvas_wrapper.offsetHeight;

  var scaling_factor =
    scaleWithAspect(img.width, img.height, cw, ch);

  resizeCanvas(img.width * scaling_factor, img.height * scaling_factor);
  ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0,
    img.width * scaling_factor, img.height * scaling_factor);
}

// view
function resizeCanvas(width, height){
  canvas.width = width;
  canvas.height = height;
}

// helper
function scaleWithAspect(src_width, src_height, dest_width, dest_height){
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
addEvent(window, "resize", redrawCanvas);
