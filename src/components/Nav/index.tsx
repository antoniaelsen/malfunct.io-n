import React from 'react';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Fab from '@mui/material/Fab';
import Grow from '@mui/material/Grow';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';

import { LayerList } from 'components/LayerList';
import NavAccordion from 'components/NavAccordion';


const drawerWidth = 360;


interface NavProps {
  open: boolean,
  setOpen: (open: boolean) => void,
}

export const Nav: React.FC<NavProps> = (props: NavProps) => {
  const { open, setOpen } = props;

  const handleDrawerOpen = React.useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  const handleDrawerClose = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);


  return (
    <Box component="nav" sx={{ position: "absolute", zIndex: 100 }}>
      {/* FAB to toggle Nav Drawer */}
      <Grow in={!open} {...(!open ? { timeout: 1000 } : {})}>
        <Fab
          color="primary"
          aria-label="open menu"
          onClick={handleDrawerOpen}
          sx={{ ml: 2, mt: 2, ...(open && { display: "none" })}}
        >
          <MenuIcon />
        </Fab>
      </Grow>

      {/* Nav Drawer */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
          },
        }}
        anchor="left"
        open={open}
        variant="persistent"
      >
        <Box sx={(theme) => ({
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'flex-end',
          padding: theme.spacing(0, 1),
          ...theme.mixins.toolbar,
        })}>
          <IconButton color="primary" onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </Box>
        <Divider />
        <NavAccordion
          details={(
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
              sit amet blandit leo lobortis eget.
            </Typography>
          )}
          title='Image'
        />
        <NavAccordion
          details={(
            <LayerList/>
          )}
          title='Layers'
        />
      </Drawer>
    </Box>
  );
}

