import React, {useRef} from 'react';

import {XYCoord} from 'dnd-core';
import {DropTargetMonitor, useDrag, useDrop} from 'react-dnd';
import {DnDTypes} from 'lib/dndTypes';


import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

import {Layer} from 'store/layer/types';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      // maxWidth: 360,
      // backgroundColor: theme.palette.background.paper,
    },
    icon: {
      margin: theme.spacing(1),
    },
  }),
);

interface DragItem {
  id: number,
  index: number,
  type: string,
};

export interface OwnProps extends Partial<Layer> {
  id: number;
  index: number,
  move: (id: number, index: number) => void;
  update: (layer: Partial<Layer>) => void;
};

export const DragListItem: React.SFC<OwnProps> = (props) => {
  const { id, index, label, move, update, visible } = props;
  const classes = useStyles();
  const ref = useRef<HTMLDivElement>(null);
  const labelId = `checkbox-list-label-${id}`;
  const onChangeLabel = React.useCallback((e) => {
    let label: string = e.target.value;
    update({ label });
  }, [update]);
  const onClickVisibility = React.useCallback((e) => {
    update({ visible: !visible });
  }, [update, visible]);

  const VisibilityIconOption = visible ? VisibilityIcon : VisibilityOffIcon;

  // React DnD drag implementation
  const [{isDragging}, drag, preview] = useDrag({
    item: { id, type: DnDTypes.LAYER },  // Spec, available to drop targets
    collect: monitor => ({               // Props collected from drag monitor
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: DnDTypes.LAYER,
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) return;
      const dragIndex = item.index
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current!.getBoundingClientRect()
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const mousePosition = monitor.getClientOffset()
      const fromTopPosition = (mousePosition as XYCoord).y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && fromTopPosition < hoverMiddleY) return;
      if (dragIndex > hoverIndex && fromTopPosition > hoverMiddleY) return;

      move(item.id, hoverIndex);

      // TODO(aelsen)
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  })

  // This component is both a drop target and drag item. However, it is dragged by handle.
  // A child icon button acts as the handle, while the outermost element is only a drag preview,
  // as well as the drop target.
  drop(preview(ref));
  return (
    <ListItem key={id} innerRef={ref} role={undefined} dense disableGutters={true}>
      <ListItemIcon ref={drag}>
        <IconButton edge="end" aria-label="DragHandle">
          <DragHandleIcon />
        </IconButton>
      </ListItemIcon>
      <ListItemText
        id={labelId}
        primary={<TextField onChange={onChangeLabel} value={label}/>}
     />
      <ListItemSecondaryAction>
        <IconButton
          className={classes.icon}
          edge="end"
          aria-label="visibility"
          disableRipple
          onClick={onClickVisibility}
          size="small"
        >
          <VisibilityIconOption fontSize="small" />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}