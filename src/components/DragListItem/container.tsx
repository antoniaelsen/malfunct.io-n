import { Dispatch, AnyAction } from 'redux';
import { connect, ConnectedProps } from 'react-redux';
import { updateLayer } from 'actions';
import { GlobalState } from 'store';
import { Layer } from 'store/layer/types';
import { DragListItem as Component, OwnProps } from './component';


const layerSelector = (state: GlobalState, props: ContainerProps) => (state.layer.layers.find(layer => layer.id === props.id));

interface ContainerProps {
  id: number;
};

const mapStateToProps = (state: GlobalState, props: ContainerProps) =>  {
  const layer = layerSelector(state, props);
  return {
    ...layer
  };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>, props: ContainerProps) => {
  return {
    update: (data: Partial<Layer>) => (dispatch(updateLayer(props.id, data)))
  }
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export const DragListItem = connect<
  StateProps,
  DispatchProps,
  ContainerProps,
  GlobalState
>(mapStateToProps, mapDispatchToProps)(Component);
