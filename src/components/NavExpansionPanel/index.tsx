import React from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';



const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      fontSize: theme.typography.pxToRem(24),
    },
  })
);

// Expansion panel 'expanded' pseudoclass
//  https://github.com/mui-org/material-ui/issues/16051
const useStylesPanel = makeStyles((theme: Theme) =>
  createStyles({
    expanded: {},
    root: {
      '&$expanded': {
        margin: 0
      },
    },
  })
);


interface NavExpansionPanelProps {
  details: React.ReactNode,
  title: string,
};


const NavExpansionPanel: React.SFC<NavExpansionPanelProps> = (props) => {
  const classes = useStyles();
  const classesPanel = useStylesPanel();
  const { details, title } = props;
  const aria = `panel${title ? '_' + title : ''}`;

  return (
    <ExpansionPanel classes={classesPanel} defaultExpanded={true} >
      <ExpansionPanelSummary
        aria-controls={`${aria}-content`}
        expandIcon={<ExpandMoreIcon color='primary' />}
        id={`${aria}-header`}
      >
        <Typography
          className={classes.title}
          color='primary'
          variant='button'
        >
          {title}
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        {details}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}

export default NavExpansionPanel;
