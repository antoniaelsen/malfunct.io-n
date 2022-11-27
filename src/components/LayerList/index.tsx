import React, { useCallback } from 'react';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { LayerCard } from 'components/LayerCard';
import { useLayersStore } from 'store/layers';
import { Layer } from 'types/layers';


export interface LayerListProps {
};

export const LayerList: React.FC<LayerListProps> = (props: LayerListProps) => {
  const {
    layers,
    addLayer,
    deleteLayers,
    moveLayer,
    selectLayers,
    updateLayer
  } = useLayersStore(({ layers, addLayer, deleteLayers, moveLayer, selectLayers, updateLayer }) => ({
    layers,
    addLayer,
    deleteLayers,
    moveLayer,
    selectLayers,
    updateLayer
  }));
  const selected = useLayersStore((state) => state.selected);

  const handleAdd = useCallback(() => {
    addLayer({ label: "New Layer" });
  }, [addLayer]);

  const handleClick = useCallback((e: any, id: number) => {
    let toSelect = [];
    if (!e.shiftKey) {
      toSelect = selected.includes(id) ? [] : [id];
    } else if (selected.includes(id)) {
      toSelect = selected.filter((existing) => existing !== id);
    } else {
      toSelect = [...selected, id];
    }
    selectLayers(toSelect);
  }, [selected, selectLayers]);

  const handleDelete = useCallback(() => {
    // TODO(antoniae) add confirmation
    deleteLayers(selected);
    selectLayers([]);
  }, [selected, deleteLayers, selectLayers]);
  
  const handleVisibility = useCallback(() => {
    const isVisible = layers
      .filter(({ id }) => selected.includes(id))
      .every(({ visible }) => visible);
    selected.forEach((id) => updateLayer(id, { visible: !isVisible }))
  }, [layers, selected, updateLayer]);

  return (
    <Box sx={{ display: "flex", flexFlow: "column" }}>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <IconButton aria-label="Trash" color="primary" size="small" onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
        <IconButton aria-label="Add" color="primary" size="small" onClick={handleAdd} sx={{ alignSelf: "start" }}>
          <AddIcon />
        </IconButton>
        <Box sx={{ flex: "1 0" }} />
        <IconButton aria-label="Visibility" color="primary" size="small" onClick={handleVisibility}>
          <VisibilityIcon />
        </IconButton>
      </Box>

      <List sx={{ width: "100%" }}>
        {layers.slice().reverse().map((layer: Layer, ri: number) => {
          const i = layers.length - ri - 1;
          return (
            <LayerCard
              key={layer.id}
              selected={selected.includes(layer.id)}
              index={i}
              {...layer}
              move={moveLayer}
              update={updateLayer}
              onClick={(e: any) => handleClick(e, layer.id)}
            />
          );
        })}
      </List>
    </Box>
  );
}
