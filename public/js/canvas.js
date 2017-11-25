
var crs_x = 0, crs_y = 0;
var crs_drag, dragged;

var scaleFactor = 1.1;

function load(canvas, ctx, img){
  resizeCanvas(canvas, img.width, img.height);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);
}

function resizeCanvas(canvas, width, height) {
  canvas.width = width;
  canvas.height = height;
}

function resizeCtx(ctx, width, height) {
  var scaling_factor = calculateScalingFactor(ctx.width, ctx.height, width, height);
  console.log("outer width, height: " + width + ", " + height);
  console.log("inner width, height: " + ctx.width + ", " + ctx.height);
  console.log("Scaling factor: " + scaling_factor);
  console.log("scaled width, height: " + ctx.width*scaleFactor + ", " + ctx.height*scaleFactor);
  ctx.scale(scaling_factor, scaling_factor);
}

function redraw(canvas, ctx, img){
  // Clear current dst_cvs
  var p1 = ctx.transformedPoint(0,0);
  var p2 = ctx.transformedPoint(canvas.width, canvas.height);
  ctx.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);

  ctx.save();

  // Clear nominal dst_cvs
  ctx.setTransform(1,0,0,1,0,0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.restore();

  src = src_ctx.getImageData(0, 0, src_cvs.width, src_cvs.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}

// dst_cvs Transforms
// Adds ctx.getTransform() - returns an SVGMatrix
// Adds ctx.transformedPoint(x,y) - returns an SVGPoint
function trackTransforms(ctx){
  console.log("track:" + ctx);
  var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
  var xform = svg.createSVGMatrix();
  ctx.getTransform = function(){ return xform; };

  var savedTransforms = [];
  var save = ctx.save;
  ctx.save = function(){
      savedTransforms.push(xform.translate(0,0));
      return save.call(ctx);
  };

  var restore = ctx.restore;
  ctx.restore = function(){
    xform = savedTransforms.pop();
    return restore.call(ctx);
      };

  var scale = ctx.scale;
  ctx.scale = function(sx,sy){
    xform = xform.scaleNonUniform(sx,sy);
    return scale.call(ctx,sx,sy);
      };

  var rotate = ctx.rotate;
  ctx.rotate = function(radians){
      xform = xform.rotate(radians*180/Math.PI);
      return rotate.call(ctx,radians);
  };

  var translate = ctx.translate;
  ctx.translate = function(dx,dy){
      xform = xform.translate(dx,dy);
      return translate.call(ctx,dx,dy);
  };

  var transform = ctx.transform;
  ctx.transform = function(a,b,c,d,e,f){
      var m2 = svg.createSVGMatrix();
      m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
      xform = xform.multiply(m2);
      return transform.call(ctx,a,b,c,d,e,f);
  };

  var setTransform = ctx.setTransform;
  ctx.setTransform = function(a,b,c,d,e,f){
      xform.a = a;
      xform.b = b;
      xform.c = c;
      xform.d = d;
      xform.e = e;
      xform.f = f;
      return setTransform.call(ctx,a,b,c,d,e,f);
  };

  var pt  = svg.createSVGPoint();
  ctx.transformedPoint = function(x,y){
      pt.x=x; pt.y=y;
      return pt.matrixTransform(xform.inverse());
  }
}

// dst_cvs Zoom Listeners
var zoom = function(clicks){
  var pt = dst_ctx.transformedPoint(crs_x,crs_y);
  dst_ctx.translate(pt.x,pt.y);
  var factor = Math.pow(scaleFactor,clicks);
  dst_ctx.scale(factor,factor);
  dst_ctx.translate(-pt.x,-pt.y);
  redraw(dst_cvs, dst_ctx, src_cvs);
}

var handleScroll = function(evt){
  var delta = evt.wheelDelta ? evt.wheelDelta/40 : evt.detail ? -evt.detail : 0;
  if (delta) zoom(delta);
  return evt.preventDefault() && false;
};

// dst_cvs.addEventListener('DOMMouseScroll',handleScroll,false);
// dst_cvs.addEventListener('mousewheel',handleScroll,false);

// dst_cvs Pan Listeners
dst_cvs.addEventListener('mousedown', function(evt) {
  document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
  crs_x = evt.offsetX || (evt.pageX - dst_cvs.offsetLeft);
  crs_y = evt.offsetY || (evt.pageY - dst_cvs.offsetTop);
  crs_drag = dst_ctx.transformedPoint(crs_x,crs_y);
  dragged = false;
}, false);

dst_cvs.addEventListener('mousemove', function(evt) {
  crs_x = evt.offsetX || (evt.pageX - dst_cvs.offsetLeft);
  crs_y = evt.offsetY || (evt.pageY - dst_cvs.offsetTop);
  dragged = true;
  if (crs_drag){
    var pt = dst_ctx.transformedPoint(crs_x,crs_y);
    dst_ctx.translate(pt.x-crs_drag.x,pt.y-crs_drag.y);
    redraw(dst_cvs, dst_ctx, src_cvs);
        }
}, false);

dst_cvs.addEventListener('mouseup', function(evt) {
  crs_drag = null;
  if (!dragged) zoom(evt.shiftKey ? -1 : 1 );
}, false);
        