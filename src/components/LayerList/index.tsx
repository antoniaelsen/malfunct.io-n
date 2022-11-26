import React, { useCallback, useState } from 'react';

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
  const [selected, setSelected] = useState<number[]>([]);
  const {
    layers,
    addLayer,
    deleteLayers,
    moveLayer,
    updateLayer
  } = useLayersStore(({ layers, addLayer, deleteLayers, moveLayer, updateLayer }) => ({ layers, addLayer, deleteLayers, moveLayer, updateLayer }));

  const handleAdd = useCallback(() => {
    addLayer({ label: "New Layer" });
  }, [addLayer]);

  const handleClick = useCallback((e: any, id: number) => {
    setSelected(selected => {
      if (!e.shiftKey) {
        return selected.includes(id) ? [] : [id];
      }
      if (selected.includes(id)) {
        return selected.filter((existing) => existing !== id);
      }
      return [...selected, id];
    });
  }, []);

  const handleDelete = useCallback(() => {
    // TODO(antoniae) add confirmation
    deleteLayers(selected);
    setSelected([]);
  }, [selected, deleteLayers]);
  
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
        {layers.map((layer: Layer, i: number) => {
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
