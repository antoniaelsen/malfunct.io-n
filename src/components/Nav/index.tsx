import React, { useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Fab from '@mui/material/Fab';
import Grow from '@mui/material/Grow';
import IconButton from '@mui/material/IconButton';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';

import { Controls } from 'components/Controls';
import { LayerList } from 'components/LayerList';
import NavAccordion from 'components/NavAccordion';
import { useImagesStore } from 'store/image';


const NAV_WIDTH = 360;

interface NavProps {
  open: boolean,
  setOpen: (open: boolean) => void,
}

export const Nav: React.FC<NavProps> = (props: NavProps) => {
  const { open, setOpen } = props;
  const addImage = useImagesStore(({ addImage }) => addImage);

  const handleUpload = useCallback(async (e: any) => {
    const files = e.target.files;
    for (const file of files) {
      addImage(await createImageBitmap(file));
    }
  }, [addImage]);

  const handleDrawerOpen = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  const handleDrawerClose = useCallback(() => {
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
          width: NAV_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: NAV_WIDTH,
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
            <>
              <Button
                component="label"
                fullWidth={true}
                variant="contained"
                sx={{ mb: 1 }}
              >
                Upload
                <input
                  type="file"
                  hidden
                  onChange={handleUpload}
                />
              </Button>
              <Button
                component="label"
                fullWidth={true}
                variant="contained"
                color="secondary"
                sx={{ mb: 1 }}
              >
                {`${true ? "Show" : "Hide"} guides`}
              </Button>
            </>
          )}
          title='Image'
        />
        <NavAccordion
          details={(
            <Controls/>
          )}
          title='Controls'
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

