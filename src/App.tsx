import React, { useState } from 'react';

import './App.css';

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';

import { Canvas } from 'components/Canvas';
import { ColorPickerCard } from 'components/ColorPickerCard';
import { ViewsCard } from 'components/ViewsCard';
import { Nav } from 'components/Nav';
import { theme } from 'theme';


const drawerWidth = 360;
console.log("Theme", theme)

const App: React.FC = () => {
  const [open, setOpen] = useState(true);

  return (
    <DndProvider backend={HTML5Backend}>
      <ThemeProvider theme={theme}>
        <Box sx={{ display: "flex", height: "100%", width: "100%" }}>
          {/* Nav */}
          <Nav open={open} setOpen={setOpen}/>

          {/* Canvas */}
          <Box component="main" sx={(theme) => ({
            position: "absolute",
            height: "100%",
            width: "100%",
            transition: theme.transitions.create('left', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            left: 0,
            ...(open && {
              transition: theme.transitions.create('left', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
              }),
              left: drawerWidth,
              width: `calc(100% - ${drawerWidth}px)`,
            })
          })}
          >
            <Canvas />
          </Box>

          <ColorPickerCard sx={{ position: "absolute", zIndex: 100, bottom: 5, right: 5 }}/>
          <ViewsCard sx={{ position: "absolute", zIndex: 100, bottom: 5, left: "50%" }}/>
        </Box>
      </ThemeProvider>
    </DndProvider>
  );
}

export default App;
