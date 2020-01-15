import React, {useCallback} from 'react';
import _ from 'lodash';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';

import {DragListItem} from 'components/DragListItem';
import {Layer} from 'store/layer/types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      // maxWidth: 360,
      // backgroundColor: theme.palette.background.paper,
    },
  }),
);


export interface OwnProps {
  layers: Layer[];
  move: (id: number, index:number) => void;
};

export const DragList: React.SFC<OwnProps> = (props) => {
  const {layers, move} = props;
  const classes = useStyles();

  console.log("Drag List |");

  return (
    <List className={classes.root}>
      {layers.map((layer, i) => {
        return (
          <DragListItem key={layer.id} id={layer.id} index={i} move={move}/>
        );
      })}
    </List>
  );
}

