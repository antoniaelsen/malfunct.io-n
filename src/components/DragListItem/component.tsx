import React from 'react';

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

import { Layer } from 'store/layer/types';


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


export type ComponentProps = Partial<Layer> & {
  id: number,
  update: any // TODO(aelsen): get rid of any
};

export const DragListItem: React.SFC<ComponentProps> = (props) => {
  const classes = useStyles();
  const { id, label, update, visible } = props;
  const labelId = `checkbox-list-label-${id}`;
  const onChangeLabel = React.useCallback((e) => {
    let label: string = e.target.value;
    update({ label });
  }, [update]);
  const onClickVisibility = React.useCallback((e) => {
    update({ visible: !visible });
  }, [update, visible]);

  const VisibilityIconOption = visible ? VisibilityIcon : VisibilityOffIcon;

  return (
    <ListItem key={id} role={undefined} dense disableGutters={true}>
      <ListItemIcon>
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