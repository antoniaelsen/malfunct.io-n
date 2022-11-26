import React, { useCallback, useMemo } from "react";
import { cloneDeep, merge, omit, set } from "lodash";
import { Box, Typography } from "@mui/material";
import { ControlSelect } from "components/ControlSelect";
import { useLayersStore } from "store/layers";
import { PixelSort } from "./components/PixelSort";


const componentMap: { [key: string]: any } = {
  "pixelsort": PixelSort
}

export interface ControlsProps {
}

export const Controls = (props: ControlsProps) => {
  const layers = useLayersStore((state) => state.layers);
  const selected = useLayersStore((state) => state.selected);
  const updateLayer = useLayersStore((state) => state.updateLayer);

  
  const slayer = useMemo(() => {
    const slayers = layers.filter(({ id }) => selected.includes(id));
    if (slayers.length !== 1) return null;
    return slayers[0];
  }, [layers, selected]);

  const handleModeChange = useCallback((value: string | null) => {
    if (!slayer) return;
    updateLayer(slayer.id, { mode: value })
  }, [slayer, updateLayer]);

  const handleConfigChange = useCallback((key: string, value: string | null) => {
    if (!slayer) return;
    const config = set(cloneDeep(slayer.config || {}), key, value);
    console.log("Setting", key, value, config);
    updateLayer(slayer.id, merge(omit(slayer, ["id"]), { config }));
  }, [slayer, updateLayer]);

  
  if (!slayer) return (
    <Typography>Please select one layer.</Typography>
  );
  console.log("Controls |", slayer.config);

  const Component = slayer.mode ? componentMap[slayer.mode] || null : null;

  return (
    <Box>
      <ControlSelect
        label="Algorithm"
        options={[
          "pixelsort",
          "test",
        ]}
        onChange={handleModeChange}
        value={slayer.mode || null}
        sx={{ mb: 2 }}
      />
    
      {Component && <Component config={slayer.config} onChange={handleConfigChange}/>}
    </Box>
  );
}