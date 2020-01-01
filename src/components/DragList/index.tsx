import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';

import DragListItem from 'components/DragListItem';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      // maxWidth: 360,
      // backgroundColor: theme.palette.background.paper,
    },
  }),
);

interface DragListProps {
};


const DragList: React.SFC<DragListProps> = (props) => {
  const classes = useStyles();

  return (
    <List className={classes.root}>
      {[0, 1, 2].map(value => {
        return (
          <DragListItem key={value} id={value}/>
        );
      })}
    </List>
  );
}

export default DragList;
