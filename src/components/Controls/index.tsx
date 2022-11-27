import React, { useCallback, useMemo, useState } from "react";
import { cloneDeep, merge, omit, set } from "lodash";
import { Box, Button, Typography } from "@mui/material";
import { ControlSelect } from "components/ControlSelect";
import { useLayersStore } from "store/layers";
import { PixelSort } from "./components/PixelSort";


// TODO(antoniae): validate fields for apply bttn, chang ebehavior to kick off algo?

const componentMap: { [key: string]: any } = {
  "pixelsort": PixelSort
}

export interface ControlsProps {
}

export const Controls = (props: ControlsProps) => {
  const layers = useLayersStore((state) => state.layers);
  const selected = useLayersStore((state) => state.selected);
  const updateLayer = useLayersStore((state) => state.updateLayer);
  
  const [mode, setMode] = useState<string | null>("");
  const [config, setConfig] = useState<any>({});

  const slayer = useMemo(() => {
    const slayers = layers.filter(({ id }) => selected.includes(id));
    if (slayers.length !== 1) return null;

    setMode(slayers[0].mode || "")
    setConfig(slayers[0].config || {})
    return slayers[0];
  }, [layers, selected]);


  // Callbacks

  const handleApply = useCallback(() => {
    if (!slayer) return;

    const update = merge(omit(slayer, ["id", "mode"]), { config, mode })
    updateLayer(slayer.id, update);
  }, [config, mode, slayer, updateLayer]);
  
  const handleConfigChange = useCallback((key: string, value: string | null) => {
    const update = set(cloneDeep(config || {}), key, value);
    setConfig(update);
  }, [config]);

  const handleModeChange = useCallback((value: string | null) => {
    setMode(value);
  }, []);

  if (!slayer) return (
    <Typography>Please select one layer.</Typography>
  );
  console.log("Controls | layer", slayer, mode, "config", config);

  const Component = mode ? componentMap[mode] || null : null;

  return (
    <Box>
      <ControlSelect
        label="Algorithm"
        options={[
          "pixelsort",
          "test",
        ]}
        onChange={handleModeChange}
        value={mode || null}
        sx={{ mb: 2 }}
      />
    
      {Component && <Component config={config} onChange={handleConfigChange}/>}

      <Button
        sx={{ mt: 4 }}
        fullWidth={true}
        variant="contained"
        onClick={handleApply}
      >
        {`Apply`}
      </Button>
    </Box>
  );
}