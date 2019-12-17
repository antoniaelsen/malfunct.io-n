import {connect, ConnectedProps} from 'react-redux';
import { GlobalState } from 'store';


import React from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';


// Redux

const mapStateToProps = (state: GlobalState) => {
  return {};
};

const mapDispatchToProps = {
  toggleVisibility: () => ({ type: 'TOGGLE_VISIBLE' })
}

const connector = connect(mapStateToProps, mapDispatchToProps);
type ReduxProps = ConnectedProps<typeof connector>


// Component 

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


type DragListItemProps = ReduxProps & {
  id: number,
  label: string,
  onVisibilityToggle: () => void,
  visible: boolean
};

const DragListItem = (props: DragListItemProps) => {
  const classes = useStyles();
  const { id, label, onVisibilityToggle, visible } = props;
  const labelId = `checkbox-list-label-${id}`;

  const VisibilityIconOption = visible ? VisibilityIcon : VisibilityOffIcon;

  return (
    <ListItem key={id} role={undefined} dense disableGutters={true}>
      <ListItemIcon>
        <IconButton edge="end" aria-label="DragHandle">
          <DragHandleIcon />
        </IconButton>
      </ListItemIcon>
      <ListItemText id={labelId} primary={label} />
      <ListItemSecondaryAction>
        <IconButton
          className={classes.icon}
          edge="end"
          aria-label="visibility"
          disableRipple
          onClick={onVisibilityToggle}
          size="small"
        >
          <VisibilityIconOption fontSize="small" />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

// TODO(aelsen): remove
const defaultProps = {
  id: 0,
  label: 'Layer',
  onVisibilityToggle: () => {},
  visible: true,
};
DragListItem.defaultProps = defaultProps;


export default connector(DragListItem);
