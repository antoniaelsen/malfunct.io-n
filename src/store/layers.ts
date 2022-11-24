import { cloneDeep } from 'lodash';
import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Layer } from 'types/layers'

const STORE_KEY = "layers-store";

interface LayersState {
  layers: Layer[];
  layersNextId: number;
  addLayer: (layer: Partial<Omit<Layer, "id">>) => void;
  deleteLayer: (id: number) => void;
  moveLayer: (id: number, index: number) => void;
  updateLayer: (id: number, layer: Partial<Omit<Layer, "id">>) => void;
}

const newLayerDefaults = {
  opacity: 1,
  visible: true,
  label: ""
}

export const useLayersStore = create<LayersState>()(
  devtools(
    persist(
      (set, get) => ({
        layers: [],
        layersNextId: 0,
        addLayer: (layer) => set((state: LayersState) => ({
          layersNextId: state.layersNextId + 1,
          layers: [
            ...state.layers, {
              ...newLayerDefaults,
              ...layer,
              id: state.layersNextId
            }
          ]})),
        deleteLayer: (id) => set({ layers: get().layers.filter((id) => id !== id) }),
        moveLayer: (id, index) => set((state: LayersState) => {
          console.log(`LayersState | Moving ${id} to index ${index}`);
          const src = state.layers.findIndex((layer) => layer.id === id)
          if (!src) return state;
          console.log(`LayersState | - Found ${id}`);
          
          const layers = cloneDeep(state.layers);
          console.log(`LayersState | - From`, state.layers);
          layers.splice(src, 1);
          layers.splice(index, 0, cloneDeep(state.layers[src]));
          console.log(`LayersState | - To`, layers);
          return { layers };
        }),
        updateLayer: (id, layer) => set((state: LayersState) => ({
          layers: state.layers.map((existing) => existing.id === id ? { ...existing, ...layer } : existing )
        })),
      }),
      {
        name: STORE_KEY
      }
    ),
    {
      name: STORE_KEY
    }
  ),
)
