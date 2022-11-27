import { cloneDeep } from 'lodash';
import produce from 'immer';
import create from 'zustand';
import { devtools, persist } from 'zustand/middleware'
import { Layer } from 'types/layers'

const STORE_KEY = "layers-store";

interface LayersState {
  // guide: boolean;
  layers: Layer[];
  layersNextId: number;
  selected: number[];
  addLayer: (layer?: Partial<Omit<Layer, "id">>) => void;
  deleteLayer: (id: number) => void;
  deleteLayers: (ids: number[]) => void;
  moveLayer: (id: number, index: number) => void;
  updateLayer: (id: number, layer: Partial<Omit<Layer, "id">>) => void;
  selectLayers: (selected: number[]) => void;
}

const newLayerDefaults = {
  opacity: 1,
  visible: true,
  label: ""
}

// TODO(antoniae): use Immer
export const useLayersStore = create<LayersState>()(
  devtools(
    persist(
      (set, get) => {
        const mutator = (cb: ((state: LayersState) => void)) => set(produce(cb));

        return {
          layers: [],
          layersNextId: 0,
          selected: [],

          addLayer: (layer = {}) => set((state: LayersState) => ({
            layersNextId: state.layersNextId + 1,
            layers: [
              ...state.layers, {
                ...newLayerDefaults,
                ...layer,
                id: state.layersNextId
              }
            ]})),
          deleteLayer: (id) => set({ layers: get().layers.filter((layer) => layer.id !== id) }),
          deleteLayers: (ids) => set((state: LayersState) => ({ layers: state.layers.filter((layer) => !ids.includes(layer.id)) })),
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

          selectLayers: (selected: number[]) => mutator((state: LayersState) => {
            state.selected = selected;
          }),
          updateLayer: (id, layer) => set((state: LayersState) => ({
            layers: state.layers.map((existing) => existing.id === id ? { ...existing, ...layer } : existing )
          })),
        }
      },
      {
        name: STORE_KEY
      }
    ),
    {
      name: STORE_KEY
    }
  ),
)
