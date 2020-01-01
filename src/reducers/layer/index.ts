import _ from 'lodash';
import { AnyAction } from 'redux';
import {
  CREATE_LAYER,
  DESTROY_LAYER,
  UPDATE_LAYER,
} from 'actions';
import { LayerState } from 'store/layer/types';


export const initialState : LayerState = {
  layers: [
    {
      id: 0,
      label: 'Layer A',
      opacity: 100,
      visible: true,
    },
    {
      id: 1,
      label: 'Layer B',
      opacity: 100,
      visible: true,
    },
    {
      id: 2,
      label: 'Layer C',
      opacity: 100,
      visible: true,
    },
  ],
};

const reducers: {[key: string]: (state: LayerState, data: any) => LayerState} = {
  [CREATE_LAYER]: (state, action) => {
    const layers = [...state.layers, action.payload];
    return { ...state, layers };
  },

  [DESTROY_LAYER]: (state, action) => {
    const id = action.payload;
    const layers = state.layers.filter(layer => layer.id !== id);
    return { ...state, layers };
  },

  [UPDATE_LAYER]: (state, action) => {
    const { id, layer: payload } = action.payload;
    const layers = state.layers.map(layer => {
      if (layer.id !== id) return layer;

      return _.merge(layer, payload);
    });
    return { ...state, layers };
  },
};

export default (state = initialState, action: AnyAction) => {
  const reducer = reducers[action.type];
  return reducer ? reducer(state, action) : state;
};
