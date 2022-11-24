import { Layer } from "types/layers";

export const CREATE_LAYER = 'CREATE_LAYER';
export const DESTROY_LAYER = 'DESTROY_LAYER';
export const MOVE_LAYER = 'MOVE_LAYER';
export const UPDATE_LAYER = 'UPDATE_LAYER';


// interface CreateLayerAction {
//   type: typeof CREATE_LAYER,
//   payload: Layer
// };

// interface DestroyLayerAction {
//   type: typeof DESTROY_LAYER,
//   payload: number
// };

// interface UpdateLayerAction {
//   type: typeof UPDATE_LAYER,
//   payload: { id: number, data: Layer }
// };

// export type LayerActionTypes = CreateLayerAction | DestroyLayerAction | UpdateLayerAction;



export const createLayer = (layer: Partial<Layer>) => ({
  type: CREATE_LAYER,
  payload: layer,
});

export const destroyLayer = (id: number) => ({
  type: DESTROY_LAYER,
  payload: id,
});

export const moveLayer = (id: number, index: number) => ({
  type: MOVE_LAYER,
  payload: {id, index}
});

export const updateLayer = (id: number, layer: Partial<Layer>) => ({
  type: UPDATE_LAYER,
  payload: { id, layer },
});