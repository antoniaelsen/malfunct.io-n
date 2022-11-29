import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useMeasure from 'react-use-measure'
import { Stage, Image as KImage, Layer as KLayer } from 'react-konva';
import Box from '@mui/material/Box';

import type { Filter } from 'lib/filters';
import type { Pixel } from 'lib/image';
import { ImagesState, useImagesStore } from 'store/image';
import { LayersState, useLayersStore } from 'store/layers';


// - Resizing to parent https://github.com/konvajs/react-konva/issues/578
// - Zoom relative to pointer https://konvajs.org/docs/sandbox/Zooming_Relative_To_Pointer.html

// - Hue http://www.niwa.nu/2013/05/math-behind-colorspace-conversions-rgb-hsl/
// - Luminance and percieved brightness https://stackoverflow.com/a/56678483
// - TypedArrays and pixel manipulation performance https://hacks.mozilla.org/2011/12/faster-canvas-pixel-manipulation-with-typed-arrays/

// For layer in layers
//  look for algorithm
//    - pixel sort
// 

// TODO(antoniae): konva-react using filters prop (even if empty array) degrades performance, esp during zoom

const getPixelUint8 = (data: Uint8ClampedArray, i: number) => {
  return [
    data[i],
    data[i + 1],
    data[i + 2],
    data[i + 3],
  ];
};

const getPixelUint32 = (data: Uint32Array, i: number) => {
  const value = data[i];
  return [
    (value & 0xFF),
    (value & 0xFF00) >> 8,
    (value & 0xFF0000) >> 16,
    value >> 24,
  ];
};

const putPixelUint32 = (data: Uint32Array, i: number, pix: number[]) => {
  data[i] = 
    (pix[3] << 24) |
    (pix[2] << 16) |
    (pix[1] << 8) |
    (pix[0])
};

const getPixelData = (stage: any, position: { x: number, y: number}, size = 1) => {
  const offset = Math.floor(size / 2);
  return stage.toCanvas().getContext('2d').getImageData(position.x - offset, position.y - offset, size, size);
};

// interface GuideProps {
//   src: ImageData;
//   x?: number;
//   y?: number;
// }

// const Guide = (props: GuideProps) => {
//   const { src, x = 0, y = 0 } = props;
//   const ref = useRef<any>();

//   const canvas = useMemo(() => {
//     if (!src) return null;
//     const canvas = document.createElement('canvas');
//     canvas.width = src.width; 
//     canvas.height = src.height;
    
//     const ctx = canvas.getContext('2d');
//     if (!ctx) return null;

//     return canvas;
//   }, [src]);

//   useEffect(() => {
//     if (!canvas) return;
//     ref.current.cache();
//   }, [canvas]);

//   if (!canvas) return null;

//   return (
//     <KImage ref={ref} x={x} y={y} offsetX={src.width / 2} offsetY={src.height / 2} image={canvas} />
//   );
// }

interface BitmapImageProps {
  src: ImageBitmap;
  x?: number;
  y?: number;
  filters?: Filter[];
}

const BitmapImage = (props: BitmapImageProps) => {
  const { src, x = 0, y = 0, filters } = props;
  const ref = useRef<any>();

  const canvas = useMemo(() => {
    if (!src) return null;
    const canvas = document.createElement('canvas');
    canvas.width = src.width; 
    canvas.height = src.height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    ctx.fillRect(0, 0, src.width, src.height);
    ctx.drawImage(src, 0, 0);
    
    return canvas;
  }, [src]);

  useEffect(() => {
    const img = ref.current;
    if (!canvas || !img) return;
    img.filters(filters);
    img.cache();
  }, [canvas, filters]);

  console.log("BitmapImage | ref", ref.current, "canvas", canvas);

  if (!canvas) return null;

  return (
    <KImage ref={ref} x={x} y={y} offsetX={src.width / 2} offsetY={src.height / 2} image={canvas} />
  );
}

interface CanvasImageProps {
  src: HTMLCanvasElement;
  x?: number;
  y?: number;
  filters?: Filter[];
}
const CanvasImage = (props: CanvasImageProps) => {
  const { src, x = 0, y = 0, filters } = props;
  const ref = useRef<any>();

  useEffect(() => {
    const img = ref.current;
    if (!src || !img) return;
    img.filters(filters);
    img.cache();
  }, [src, filters]);

  if (!src) return null;

  console.log("CanvasImage | Rendering ref", ref, "canvas", src)

  return (
    <KImage ref={ref} x={x} y={y} offsetX={src.width / 2} offsetY={src.height / 2} image={src} />
  );
}

const pixelsorttmp = (imageData: ImageData) => {
  console.log("Sorting image data", imageData);
  const w = imageData.width; 
  const h = imageData.height;

  // const src_i32 = new Uint32Array(imageData.data);

  const buffer = new ArrayBuffer(imageData.data.length);
  const dst_i32 = new Uint32Array(buffer);
  // dst_i32.set(i1`6b5mageData.data);
  for (let x = 0; x < w; x++) {
    const div = w / 10;
    const c = Math.floor(x / div);
    const s = c % 2;
    if (s % 2 === 0) continue;
    for (let y = 0; y < h; y++) {
      const i = imageData.width * y + x;
      const j = imageData.width * (h - y - 1) + x;
      const pix = getPixelUint8(imageData.data, i * 4);
      // const pix = getPixelUint32(src_i32, j);

      putPixelUint32(dst_i32, j, pix);
      if (x !== w / 2) continue;
    }
  }
  
  imageData.data.set(new Uint8ClampedArray(buffer));
}

export interface CanvasProps {
};

export const Canvas: React.FC<CanvasProps> = (props: CanvasProps) => {
  const ref = useRef<any>(null);
  const [boundsRef, bounds] = useMeasure();
  const [mid, setMid] = useState({ x: 0, y: 0 });

  const { filter, src } = useImagesStore(({ filter, src }: ImagesState) => ({ filter, src }));
  const { layers } = useLayersStore(({ layers }: LayersState) => ({ layers }));
  const setColorPicker = useImagesStore((state: ImagesState) => state.setColorPicker);

  const filters: Filter[] = useMemo(() => {
    console.log("Canvas | Computing filters");
    const filters: Filter[] = [];
    if (filter) filters.push(filter.f);

    layers.forEach((layer) => {
      console.log("Adding layer", layer);
      if (layer.mode === "pixelsort") {
        filters.push(pixelsorttmp)
      }
    });
    return filters;
  }, [filter, layers]);
  

  // const renderedLayers = useMemo(() => {
  //   const stage = ref.current;
  //   if (!stage || !src) return null;
  
  //   const src_canvas = stage.toCanvas();
  //   const width = src.width;
  //   const height = src.height;
  //   const src_ctx = src_canvas.getContext('2d');
  //   console.log(
  //     "Canvas | Recomputing layers",
  //     "from stage", stage,
  //     "stage canvas", src_canvas,
  //     "and src", src
  //   );
    
  //   const dst_canvas = document.createElement('canvas');
  //   dst_canvas.width = src.width; 
  //   dst_canvas.height = src.height;
  //   const dst_ctx = dst_canvas.getContext('2d');
    
  //   if (!dst_ctx) return null;
  //   for (let x = 0; x < width; x++) {
  //     const col = src_ctx.getImageData(x, 0, 1, height).data;
  //     const div = width / 10;
  //     const i = Math.floor(x / div);
  //     const s = i % 2;
  //     const sorted = s ? col.slice().sort().reverse() : col.slice();
  //     dst_ctx.putImageData(new ImageData(sorted, 1, height), x, 0);
  //     // dst_ctx.rect(width/2, 0, width/2, height);
  //     // dst_ctx.fillStyle = "red";
  //     // dst_ctx.fill()
  //     if (x > 0) continue;
  //   }
  //   console.log("Dst", dst_canvas, dst_canvas.width, dst_canvas.height)

  //   return (
  //     <CanvasImage src={dst_canvas}/>
  //   );
  // }, [layers, src]);


  console.log(`Canvas | Rendering`,
    // ` with canvas (parent) dimensions ${bounds.width} x ${bounds.height}, midpoint ${mid.x} x ${mid.y}`, 
    // "src",
    // src,
    "stage",
    ref.current,
  );

  const zoom = useCallback((stage: any, target: number) => {
    const w = stage.width();
    const h = stage.height();
    const x = w / target / 2;
    const y = h / target / 2;

    stage.scale({ x: target, y: target });
  
    setMid({ x, y })
  }, []);

  // const zoomToCursor = useCallback((stage: any, target: number) => {
  //   const current = stage.scaleX();
  //   // console.log("Canvas | - zoom to cursor from", current, "to", target);
    
  //   const pointer = stage.getPointerPosition();
  //   const mcurrent = {
  //     x: (pointer.x - stage.x()) / current,
  //     y: (pointer.y - stage.y()) / current,
  //   };
    
  //   const mtarget = {
  //     x: pointer.x - mcurrent.x * target,
  //     y: pointer.y - mcurrent.y * target,
  //   };

  //   zoom(stage, target);

  //   stage.position(mtarget);
  // }, [zoom]);

  const scroll = useCallback((stage: any, direction: number) => {
    console.log("Scroll", direction)
    const SCALE_FACTOR = 1.05;
    const current = stage.scaleX();
    const target = direction > 0 ? current * SCALE_FACTOR : current / SCALE_FACTOR;
    
    zoom(stage, target);
  }, [zoom]);


  // Callbacks

  const handleMouseMove = useCallback((e: any) => {
    const stage = ref.current;
    if (!stage) return;

    const pos = stage.getPointerPosition();
    const ld = getPixelData(stage, pos);
    setColorPicker(ld);
    
  }, [setColorPicker]);

  const handleWheel = useCallback((e: any) => {
    e.evt.preventDefault();
    const stage = ref.current;
    if (!stage) return;

    let direction = e.evt.deltaY > 0 ? -1 : 1;
    if (e.evt.ctrlKey) {
      direction = -direction;
    }
    scroll(stage, direction);
  }, [scroll]);


  // Effects

  // On image load
  useEffect(() => {
    const stage = ref.current;
    if (!stage) return;
    if (!src) return;
    
    const rx = bounds.width / src.width;
    const ry = bounds.height / src.height;
    const ratio = Math.min(rx, ry);

    zoom(stage, ratio);
  }, [bounds, src, zoom]);

  // On mount
  useEffect(() => {
    const preventScroll = (e: WheelEvent) => e.preventDefault();

    const stage = ref.current;
    if (!stage) return;

    stage.addEventListener('wheel', preventScroll);
    
    return () => {
      stage.removeEventListener('wheel', preventScroll);
    };
  }, []);

  return (
    <Box
      ref={boundsRef}
      sx={({ palette }) => ({
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: palette.background.default
      })}
    >
      <Stage ref={ref} width={bounds.width} height={bounds.height} onWheel={handleWheel} onMouseMove={handleMouseMove}>
        <KLayer x={mid.x} y={mid.y}>
          {!!src && (<BitmapImage src={src} filters={filters}/>)}
        </KLayer>
        {/* <KLayer x={mid.x} y={mid.y}>
          {renderedLayers}
        </KLayer> */}
      </Stage>
    </Box>
  );
}
