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
console.log(dst_ctx);

 var image_loaded = false;


$(".dropdown-toggle").dropdown();

function toggleImageButtons(state){
  $("btn_save").disabled = state;
  $("btn_clear").disabled = state;
}


// GUI Callbacks
function resize() {
  var cw = dst_cvs_wrapper.offsetWidth;
  var ch = dst_cvs_wrapper.offsetHeight;

  // resizeCtx(dst_ctx, cw, ch);
  // resizeCanvas(dst_ctx, cw, ch);
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
      load(this); 
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