import {Dispatch, AnyAction} from 'redux';
import {connect} from 'react-redux';
import {moveLayer} from 'actions';
import {GlobalState} from 'store';
import {Layer} from 'store/layer/types';
import {DragList as Component} from './component';


const layersSelector = (state: GlobalState) => (state.layer.layers);

interface ContainerProps {
};

const mapStateToProps = (state: GlobalState, props: ContainerProps) =>  {
  const layers = layersSelector(state) || [];
  return {
    layers
  };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>, props: ContainerProps) => {
  return {
    move: (id: number, index: number) => (dispatch(moveLayer(id, index)))
  }
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export const DragList = connect<
  StateProps,
  DispatchProps,
  ContainerProps,
  GlobalState
>(mapStateToProps, mapDispatchToProps)(Component);
