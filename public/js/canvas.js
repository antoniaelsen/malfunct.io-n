/*
 * Canvas
 * written by Antonia Elsen | aelsen @ github
 */

var crs_x = 0, crs_y = 0;
var crs_drag, dragged;

// TODO: Either store another canvas / ctx to draw from on redraw();
//    OR, allow redraw to take an image.

/**
 * Gesso Class
 */
var Gesso = function () {
  this.canvas  = document.createElement('canvas');
  this.ctx = this.canvas.getContext('2d');
  this.trackTransforms(this.ctx);
  this.zoomIncrement = 1.25;
  this.src = null;
};

/**
 * Clears the current canvas.
 */
Gesso.prototype.clear = function() {
  // var p1 = this.ctx.transformedPoint(0,0); // TODO watch this
  // var p2 = this.ctx.transformedPoint(this.width, this.height);
  // ctx.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);
  this.ctx.save();
  this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  this.ctx.clearRect(0, 0, this.width, this.height);
  this.ctx.restore();
};

/**
 * Returns the context's current data.
 * @return {ImageData} 
 */
Gesso.prototype.getImageData = function() {
  return this.ctx.getImageData(0, 0, this.width, this.height);
};

/**
 * Returns the number of pixels in the canvas.
 * @returns {Number}
 */
Gesso.prototype.getPixelCount = function() {
  return this.width * this.height;
};

/**
 * Loads an Image onto the canvas.
 * @param {Image} image 
 */
Gesso.prototype.load = function(image) {
  this.src = image;
  this.clear();
  this.ctx.drawImage(image, 0, 0);
};

/**
 * Redraws the canvas with its source image.
 */
Gesso.prototype.redraw = function() {
  if (this.src) { 
    this.clear();
    this.ctx.drawImage(this.src, 0, 0); 
  }
}

/**
 * Redraws the canvas with a provided image.
 * @param {Image} image
 */
Gesso.prototype.redraw = function(image) {
  this.clear();
  if (image) { 
    this.ctx.drawImage(image, 0, 0); 
  } else if (this.src) {
    this.ctx.drawImage(this.src, 0, 0);
  } else {
    console.log("Cannot redraw canvas. No image provided.");
  }
}

/**
 * Resizes the canvas.
 * @param {Number} width 
 * @param {Number} height 
 */
Gesso.prototype.resize = function (width, height) {
  this.canvas.width = width;
  this.canvas.height = height;
  this.width = width;
  this.height = height;
};

/**
 * Loads data onto the canvas.
 * @param {ImageData} data 
 */
Gesso.prototype.putImageData = function (data) {
  this.ctx.putImageData(data, 0, 0);
};

/**
 * Pans the canvas.
 * @param {Number} direction 
 * @param {Number} x 
 * @param {Number} y 
 */
Gesso.prototype.pan = function (image, start_x, start_y, end_x, end_y){
  var pt = this.ctx.transformedPoint(start_x, start_y);
  this.ctx.translate(pt.x-end_x,pt.y-end_y);
  this.redraw(image);
}

/**
 * Zooms the canvas.
 * @param {Number} direction
 * @param {Number} x
 * @param {Number} y
 */
Gesso.prototype.zoom = function (image, direction, x, y) {
  var factor = Math.pow(this.zoomIncrement, direction);
  var pt = this.ctx.transformedPoint(x, y);
  this.ctx.translate(pt.x, pt.y);
  this.ctx.scale(factor, factor);
  this.ctx.translate(-pt.x, -pt.y);
  this.redraw(image);
};

/**
 * ctx.getTransform() and ctx.currentTransform are not supported on every browser.
 * Thus, it is necessary to track transforms manually.
 * The following function overrides the CanvasRenderingContext2D class's methods
 * in order to store all transforms as SVGMatrices in an array while performing them.
 * This solution was taken from Gavin Kistner (Phrogz)'s stackoverflow answer:
 * https://stackoverflow.com/questions/5189968/zoom-canvas-to-mouse-cursor/5526721#5526721
 * @param {CanvasRenderingContext2D} ctx 
 */
Gesso.prototype.trackTransforms = function (ctx) {
  var svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
  var xform = svg.createSVGMatrix();
  var transforms = [];

  ctx.getTransform = function () { return xform; };

  var save = ctx.save;
  ctx.save = function () {
      transforms.push(xform.translate(0, 0));
      return save.call(ctx);
  };

  var restore = ctx.restore;
  ctx.restore = function () {
      xform = transforms.pop();
      return restore.call(ctx);
  };

  var scale = ctx.scale;
  ctx.scale = function (sx, sy) {
      xform = xform.scaleNonUniform(sx, sy);
      return scale.call(ctx, sx, sy);
  };

  var rotate = ctx.rotate;
  ctx.rotate = function (radians) {
      xform = xform.rotate(radians * 180 / Math.PI);
      return rotate.call(ctx, radians);
  };

  var translate = ctx.translate;
  ctx.translate = function (dx, dy) {
      xform = xform.translate(dx, dy);
      return translate.call(ctx, dx, dy);
  };

  var transform = ctx.transform;
  ctx.transform = function (a, b, c, d, e, f) {
      var m2 = svg.createSVGMatrix();
      m2.a = a; m2.b = b; m2.c = c; m2.d = d; m2.e = e; m2.f = f;
      xform = xform.multiply(m2);
      return transform.call(ctx, a, b, c, d, e, f);
  };

  var setTransform = ctx.setTransform;
  ctx.setTransform = function (a, b, c, d, e, f) {
      xform.a = a;
      xform.b = b;
      xform.c = c;
      xform.d = d;
      xform.e = e;
      xform.f = f;
      return setTransform.call(ctx, a, b, c, d, e, f);
  };

  var pt = svg.createSVGPoint();
  ctx.transformedPoint = function (x, y) {
      pt.x = x; pt.y = y;
      return pt.matrixTransform(xform.inverse());
  }
};

var handleScroll = function(evt){
  var delta = evt.wheelDelta ? evt.wheelDelta/40 : evt.detail ? -evt.detail : 0;
  if (delta) gesso.zoom(null, delta, crs_x, crs_y);
  return evt.preventDefault() && false;
};

// Canvas Pan Listeners
function addZoomPanListeners(gesso) {
  gesso.canvas.addEventListener('mousedown', function(evt) {
    document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
    crs_x = evt.offsetX || (evt.pageX - gesso.canvas.offsetLeft);
    crs_y = evt.offsetY || (evt.pageY - gesso.canvas.offsetTop);
    crs_drag = gesso.ctx.transformedPoint(crs_x, crs_y);
    dragged = false;
  }, false);

  gesso.canvas.addEventListener('mousemove', function(evt) {
    crs_x = evt.offsetX || (evt.pageX - gesso.canvas.offsetLeft);
    crs_y = evt.offsetY || (evt.pageY - gesso.canvas.offsetTop);
    dragged = true;
    if (crs_drag){
      gesso.pan(null, crs_x, crs_y, crs_drag.x, crs_drag.y);
    }
  }, false);
  gesso.canvas.addEventListener('mouseup', function(evt) {
    crs_drag = null;
    if (!dragged) gesso.zoom(null, evt.shiftKey ? -1 : 1, crs_x, crs_y );
  }, false);
};


        

