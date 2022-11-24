import React, { useState } from 'react';

import './App.css';

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';

import { Nav } from 'components/Nav';
import { theme } from 'theme';


const drawerWidth = 360;

console.log("Theme", theme)

// const useStyles = makeStyles((theme: Theme) =>
//   createStyles({
//     '@global': {
//       'html, body, #root': {
//         height: '100%',
//         // overflow: 'hidden',
//       },
//       // h2: {
//       //   'font-size': '1.5rem',
//       // },
//       // h3: {
//       //   'font-size': '1.2rem',
//       // },
//       // h4: {
//       //   'font-size': '0.9rem',
//       // },
//       // 'html': {
//       //   fontSize: '16px',
//       // },
//       '::-webkit-scrollbar': {
//           width: '0px',
//           background: 'transparent',
//       }
//     },
//     app: {
//       // height: '100%',
//       // 'max-height': '100%',
//       // overflow: 'hidden',
//       // position: 'relative',
//     },
//     canvas: {
//       backgroundColor: 'red',
//     },
//     drawer: {
//       width: drawerWidth,
//       flexShrink: 0,
//     },
//     drawerPaper: {
//       width: drawerWidth,
//     },
//     drawerHeader: {
//       alignItems: 'center',
//       display: 'flex',
//       justifyContent: 'flex-end',
//       padding: theme.spacing(0, 1),
//       ...theme.mixins.toolbar,
//     },
//     content: {
//       flexGrow: 1,
//       // padding: theme.spacing(3),
//       transition: theme.transitions.create('left', {
//         easing: theme.transitions.easing.sharp,
//         duration: theme.transitions.duration.leavingScreen,
//       }),
//       left: 0,
//       // position: 'absolute',
//     },
//     contentShift: {
//       transition: theme.transitions.create('left', {
//         easing: theme.transitions.easing.easeOut,
//         duration: theme.transitions.duration.enteringScreen,
//       }),
//       left: drawerWidth,
//     },
//     heading: {
//       fontSize: theme.typography.pxToRem(24),
//       // fontWeight: theme.typography.fontWeightRegular,
//     },
//     hide: {
//       display: 'none',
//     },
//     menuButton: {
//       marginLeft: theme.spacing(2),
//       marginTop: theme.spacing(2),
//     },
//     nav: {
//       position: 'absolute',
//       zIndex: 100,
//     },
//     root: {
//       height: '100%',
//       display: 'flex',
//     },
//   })
// );



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
            <canvas id="canvas" style={{ background: "red", width: "100%", height: "100%" }}></canvas>
          </Box>
        </Box>
      </ThemeProvider>
    </DndProvider>
  );
}

export default App;
