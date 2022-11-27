import React, { useMemo, useRef } from "react";
import { pick } from "lodash";
import Box, { BoxProps } from "@mui/material/Box";
import Color from "color";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { pixel } from "lib/image";
import { ImagesState, useImagesStore } from "store/image";


// TODO(antoniae): display mini canvas in ColorPickerCard

export const ColorLabel = (props: { label: string, value: number | null }) => {
  const { label, value } = props;
  return (
    <Box sx={{ display: "flex" }}>
      <Typography display="inline" sx={{ mr: 1 }}>{`${label}: `}</Typography>
      <Typography display="inline" color="secondary">{value === null ? "-" : Math.round(value * 100) / 100}</Typography>
    </Box>
  )
}

type ColorMap = { [key: string]: number | null };

interface ColorPickerCardProps extends BoxProps {
};

export const ColorPickerCard = (props: ColorPickerCardProps) => {
  const { ...etc } = props;
  const ref = useRef<HTMLCanvasElement>(null);
  const src = useImagesStore((state: ImagesState) => state.colorPicker);


  const legend = useMemo(() => {
    let rgb: ColorMap = ['r', 'g', 'b'].reduce((acc, k) => ({ ...acc, [k]: null }), {});
    let hsl: ColorMap = ['h', 's', 'l'].reduce((acc, k) => ({ ...acc, [k]: null }), {});

    if (src) {
      const cx = Math.floor(src.width / 2);
      const cy = Math.floor(src.height / 2);
      const pix = pixel(src, cx, cy);
      const color = Color( pick(pix, ["r", "g", "b"])).alpha(pix.alpha);
      rgb = color.rgb().object();
      hsl = color.hsl().object();
    }  

    return (
      <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
        {/* RGB */}
        <Box sx={{ display: "flex", flexFlow: "column", m: 1 }}>
          {Object.entries(rgb).map(([k, v]) => (
            <ColorLabel key={k} label={k} value={v} />
          ))}
        </Box>

        {/* HSL */}
        <Box sx={{ display: "flex", flexFlow: "column", m: 1 }}>
          {Object.entries(hsl).map(([k, v]) => (
            <ColorLabel key={k} label={k} value={v} />
          ))}
        </Box>
      </Box>
    );
  }, [src]);

  return (
    <Box {...etc}>
      <Card sx={(theme) => ({
          display: "flex",
          flexFlow: "column",
          p: 1,
          width: theme.spacing(24),
        })}>

        {legend}
      </Card>
    </Box>
  );
}