import { Dispatch, AnyAction } from 'redux';
import { connect, ConnectedProps } from 'react-redux';
import { updateLayer } from 'actions';
import { GlobalState } from 'store';
import { Layer } from 'store/layer/types';
import { DragListItem as Component, ComponentProps } from './component';

// Container

const layerSelector = (state: GlobalState, props: ComponentProps) => (state.layer.layers.find(layer => layer.id === props.id));
const mapStateToProps = (state: GlobalState, props: ComponentProps) => {
  const layer = layerSelector(state, props);
  return {
    ...layer
  };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>, props: ComponentProps) => ({
  update: (data: Partial<Layer>) => (dispatch(updateLayer(props.id, data)))
});

const connector = connect(mapStateToProps, mapDispatchToProps);
// type ReduxProps = ConnectedProps<typeof connector>;


export const DragListItem = connector(Component);
