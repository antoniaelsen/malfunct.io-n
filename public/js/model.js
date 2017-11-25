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

var src = [];
var dst = [];
