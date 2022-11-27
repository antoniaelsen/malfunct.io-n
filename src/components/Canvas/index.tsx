import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useMeasure from 'react-use-measure'
import { Stage, Image as KImage, Layer as KLayer } from 'react-konva';
import Box from '@mui/material/Box';

import type { Filter } from 'lib/filter';
import { ImagesState, useImagesStore } from 'store/image';


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

interface CanvasImageProps {
  src: ImageBitmap;
  x?: number;
  y?: number;
  filters?: Filter[];
}
const CanvasImage = (props: CanvasImageProps) => {
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

  if (!canvas) return null;

  return (
    <KImage ref={ref} x={x} y={y} offsetX={src.width / 2} offsetY={src.height / 2} image={canvas} />
  );
}

export interface CanvasProps {
};

export const Canvas: React.FC<CanvasProps> = (props: CanvasProps) => {
  const ref = useRef<any>(null);
  const [boundsRef, bounds] = useMeasure();
  const [mid, setMid] = useState({ x: 0, y: 0 });
  const { images, filter } = useImagesStore(({ filter, images }: ImagesState) => ({ filter, images }));
  const setColorPicker = useImagesStore((state: ImagesState) => state.setColorPicker);

  const filters: Filter[] = useMemo(() => (filter ? [filter.f] : []), [filter]);
  
  let data = null;
  if (ref.current) {
    const cw = ref.current?.bufferCanvas.width;
    const ch = ref.current?.bufferCanvas.height;
    if (cw && ch) {
      data = ref.current?.bufferCanvas._canvas.getContext('2d').getImageData(0, 0, cw, ch)
    };
  }
  // console.log(`Canvas | Rendering, with canvas (parent) dimensions ${bounds.width} x ${bounds.height}, midpoint ${mid.x} x ${mid.y}, with images`,
  //   images,
  //   "stage",
  //   ref.current,
  //   "width:", ref.current?.width(),
  //   "scale:", ref.current?.scale(),
  //   ref.current?.bufferCanvas,
  //   data,
  // );

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
    if (images.length === 0) return;
    const src = images[0].src;
    
    const rx = bounds.width / src.width;
    const ry = bounds.height / src.height;
    const ratio = Math.min(rx, ry);

    zoom(stage, ratio);
  }, [bounds, images, zoom]);

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
        <KLayer>
          {images.length > 0 && (
            <CanvasImage src={images[0].src} x={mid.x} y={mid.y} filters={filters}/>
          )}
        </KLayer>
      </Stage>
    </Box>
  );
}
