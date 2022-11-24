import React, { useCallback, useRef } from 'react';

import { XYCoord } from 'dnd-core';
import { DropTargetMonitor, useDrag, useDrop } from 'react-dnd';
import { DnDTypes } from 'lib/dndTypes';

import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';

import DragHandleIcon from '@mui/icons-material/DragHandle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import { Layer } from 'types/layers';

interface DragItem {
  id: number,
  index: number,
  type: string,
};

export interface LayerCardProps extends Partial<Layer> {
  id: number;
  index: number,
  move: (id: number, index: number) => void;
  update: (id: number, layer: Partial<Omit<Layer, "id">>) => void;
};

export const LayerCard: React.FC<LayerCardProps> = (props: LayerCardProps) => {
  const { id, index, label, move, update, visible } = props;
  const ref = useRef<HTMLLIElement>(null);
  const labelId = `checkbox-list-label-${id}`;

  const onChangeLabel = useCallback((e: any) => {
    let label: string = e.target.value;
    update(id, { label });
  }, [id, update]);

  const onClickVisibility = useCallback(() => {
    update(id, { visible: !visible });
  }, [id, update, visible]);

  const VisibilityIconOption = visible ? VisibilityIcon : VisibilityOffIcon;

  // React DnD drag implementation
  const [{isDragging}, drag, preview] = useDrag({
    type: DnDTypes.LAYER,               
    item: { id },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: DnDTypes.LAYER,
    hover(item: any, monitor: DropTargetMonitor) {
      console.log(`LayerCard | useDrop item`, item)
      if (!ref.current || !item) return;
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
  });
  console.log("LayerCard | ", id, label, visible)

  // This component is both a drop target and drag item. However, it is dragged by handle.
  // A child icon button acts as the handle, while the outermost element is only a drag preview,
  // as well as the drop target.
  drop(preview(ref));
  return (
    <ListItem key={id} ref={ref} role={undefined} dense disableGutters={true}>
      <ListItemIcon ref={drag}>
        <IconButton edge="end" aria-label="DragHandle" color="primary">
          <DragHandleIcon />
        </IconButton>
      </ListItemIcon>
      <ListItemText
        sx={{ ...(!visible && { opacity: "50%" })}}
        id={labelId}
        primary={<TextField onChange={onChangeLabel} value={label} variant="standard"/>}
     />
      <ListItemSecondaryAction>
        <IconButton
          sx={{ m: 1, ...(!visible && { opacity: "50%" })}}
          edge="end"
          aria-label="visibility"
          disableRipple
          onClick={onClickVisibility}
          color="primary"
          size="small"
        >
          <VisibilityIconOption fontSize="small" />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}