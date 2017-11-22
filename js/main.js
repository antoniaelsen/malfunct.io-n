var imageLoaded = false;

var canvas_wrapper = document.getElementById('canvas-wrapper');
var canvas = document.getElementById('editor');
var ctx = canvas.getContext("2d");

var canvas_img = new Image();

document.getElementById("save-button").disabled = !imageLoaded;
document.getElementById("clear-button").disabled = !imageLoaded;

document.getElementById("load-button").addEventListener("click", handleButtonLoad);
document.getElementById("clear-button").addEventListener("click", handleButtonClear);
document.getElementById("image-input").addEventListener("change", handleImageInput);

$(document).ready(function() {
  $(".dropdown-toggle").dropdown();
});

function handleButtonLoad() {
  document.getElementById('image-input').click();
}

function handleButtonClear() {
  // TODO(aelsen): potentially add callback / listener to toggle buttons
  imageLoaded = false;
  toggleImageButtons(!imageLoaded);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function toggleImageButtons(state){
  document.getElementById("save-button").disabled = state;
  document.getElementById("clear-button").disabled = state;
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
      redrawCanvas();
    }

    imageLoaded = true;
    toggleImageButtons(!imageLoaded)
  }
}

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

function resizeCanvas(width, height){
  canvas.width = width;
  canvas.height = height;
}

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
