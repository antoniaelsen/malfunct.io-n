import React from 'react';
import { Provider } from 'react-redux';
import clsx from 'clsx';

import './App.css';
import store from 'store/createStore';

import { DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'

import CssBaseline from '@material-ui/core/CssBaseline';
import { createStyles, makeStyles, MuiThemeProvider, Theme } from '@material-ui/core/styles';

import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Grow from '@material-ui/core/Grow';
import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import { theme } from 'theme';

import DragList from 'components/DragList';
import NavExpansionPanel from 'components/NavExpansionPanel';


const drawerWidth = 360;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    '@global': {
      'html, body, #root': {
        height: '100%',
        // overflow: 'hidden',
      },
      // h2: {
      //   'font-size': '1.5rem',
      // },
      // h3: {
      //   'font-size': '1.2rem',
      // },
      // h4: {
      //   'font-size': '0.9rem',
      // },
      // 'html': {
      //   fontSize: '16px',
      // },
      '::-webkit-scrollbar': {
          width: '0px',
          background: 'transparent',
      }
    },
    app: {
      // height: '100%',
      // 'max-height': '100%',
      // overflow: 'hidden',
      // position: 'relative',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerHeader: {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'flex-end',
      padding: theme.spacing(0, 1),
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
    heading: {
      fontSize: theme.typography.pxToRem(24),
      // fontWeight: theme.typography.fontWeightRegular,
    },
    hide: {
      display: 'none',
    },
    menuButton: {
      marginLeft: theme.spacing(2),
      marginTop: theme.spacing(2),
    },
    root: {
      display: 'flex',
    },
  })
);




interface LayersProps {
}
const Layers: React.SFC<Props> = (props) => {
  return (
    <DragList>
    </DragList>
  );
};



interface Props {
}

const App: React.SFC<Props> = (props) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = React.useCallback(() => {
    setOpen(true);
  }, []);

  const handleDrawerClose = React.useCallback(() => {
    setOpen(false);
  }, []);


  return (
    <DndProvider backend={Backend}>
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
          <CssBaseline />

          <div className={classes.root}>
            <Grow in={!open} {...(!open ? { timeout: 1000 } : {})}>
              <Fab
                color="primary"
                aria-label="open menu"
                onClick={handleDrawerOpen}
                className={clsx(classes.menuButton, open && classes.hide)}
              >
                <MenuIcon />
              </Fab>
            </Grow>
            <Drawer
              classes={{ paper: classes.drawerPaper }}
              className={classes.drawer}
              anchor="left"
              open={open}
              variant="persistent"
            >
              <div className={classes.drawerHeader}>
                <IconButton color="primary" onClick={handleDrawerClose}>
                  {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
              </div>
              <Divider />
              <NavExpansionPanel
                details={(
                  <Typography>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                    sit amet blandit leo lobortis eget.
                  </Typography>
                )}
                title='Image'
              />
              <NavExpansionPanel
                details={(
                  <Layers>
                  </Layers>
                )}
                title='Layers'
              />

              

              {/* <List>
                {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                  <ListItem button key={text}>
                    <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItem>
                ))}
              </List> */}
              {/* <Divider />
              <List>
                {['All mail', 'Trash', 'Spam'].map((text, index) => (
                  <ListItem button key={text}>
                    <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItem>
                ))}
              </List> */}

            </Drawer>

            <main
              className={clsx(classes.content, {
                [classes.contentShift]: open,
              })}
            >
              <div className={classes.drawerHeader} />
            </main>
          </div>

        </Provider>
      </MuiThemeProvider>
    </DndProvider>
  );
}

export default App;
