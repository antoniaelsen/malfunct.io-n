import React, { useEffect } from 'react';

import List from '@mui/material/List';

import { LayerCard } from 'components/LayerCard';
import { useLayersStore } from 'store/layers';
import { Layer } from 'types/layers';

// FOR DEBUG AND DEMO
const DEBUG_LAYERS_A = Array.from(new Array(10)).map((x, i) => ({
  label: `Test Layer #${i}`,
  opacity: Math.round(Math.random() * 100),
  visible: false,
}));

const DEBUG_LAYERS_B = [{
  label: 'Layer Alpha',
  opacity: 100,
  visible: true,
},
{
  label: 'Layer B',
  opacity: 100,
  visible: true,
},
{
  label: 'Layer C',
  opacity: 100,
  visible: false,
},
{
  label: 'Layer D',
  opacity: 80,
  visible: true,
},
{
  label: 'Layer E',
  opacity: 100,
  visible: false,
}];
const DEBUG_LAYERS = [...DEBUG_LAYERS_B, ...DEBUG_LAYERS_A];


export interface LayerListProps {
  // move: (id: number, index:number) => void;
};

export const LayerList: React.FC<LayerListProps> = (props: LayerListProps) => {
  // const { move } = props;
  const { layers, addLayer, moveLayer, updateLayer } = useLayersStore(({ layers, addLayer, moveLayer, updateLayer }) => ({ layers, addLayer, moveLayer, updateLayer }));

  // FOR DEBUG AND DEMO
  useEffect(() => {
    if (layers.length !== 0) return;
    console.log("Populating layers...");

    DEBUG_LAYERS.forEach(addLayer);
  }, [addLayer, layers]);

  return (
    <List sx={{ width: "100%" }}>
      {layers.map((layer: Layer, i: number) => {
        return (
          <LayerCard
            key={layer.id}
            index={i}
            {...layer}
            move={moveLayer}
            update={updateLayer}
          />
        );
      })}
    </List>
  );
}
