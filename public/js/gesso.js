/*
 * Gesso
 * by Antonia Elsen - aelsen @ github
 * https://github.com/aelsen/gesso
 * 
 * Gesso is a wrapper for the HTML Canvas and its 2D Context, 
 * with the purpose of enabling easy zooming and panning.
 * 
 * Part of this solution was inspired by the work of Phrogz @ github.
 */

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
 * @returns {number}
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
 * Redraws the canvas with a provided image, 
 * or if null, the source image.
 * @param {Image} image
 */
Gesso.prototype.redraw = function(image) {
  this.clear();
  if (image) { 
    this.ctx.drawImage(image, 0, 0); 
  } else if (this.src) {
    this.ctx.drawImage(this.src, 0, 0);
  }
};

/**
 * Resizes the canvas.
 * @param {number} width 
 * @param {number} height 
 */
Gesso.prototype.resize = function (width, height) {
  this.canvas.width = width;
  this.canvas.height = height;
  this.width = width;
  this.height = height;
};

/**
 * Load data onto the canvas.
 * @param {ImageData} data 
 */
Gesso.prototype.putImageData = function (data) {
  this.ctx.putImageData(data, 0, 0);
};

/**
 * Pan the canvas.
 * @param {number} direction 
 * @param {number} x 
 * @param {number} y 
 */
Gesso.prototype.pan = function (image, start_x, start_y, end_x, end_y){
  var pt = this.ctx.transformedPoint(start_x, start_y);
  this.ctx.translate(pt.x-end_x,pt.y-end_y);
  this.redraw(image);
};

/**
 * Zoom the canvas.
 * @param {Image} image
 * @param {number} direction
 * @param {number} center_x
 * @param {number} center_y
 */
Gesso.prototype.zoom = function (image, direction, center_x, center_y) {
  var factor = Math.pow(this.zoomIncrement, direction);
  var pt = this.ctx.transformedPoint(center_x, center_y);
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
  };
};