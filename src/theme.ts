import { createTheme } from '@mui/material/styles';
import { orange, pink } from '@mui/material/colors';

export const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: '#101010',
      paper: '#0a1431',
    },
    primary: {
      main: pink['A400'],
    },
    secondary: {
      main: orange['A400'],
    },
    text: {
      primary: orange['A400'],
      // primary: cyan['A100'],
    }
  },
  typography: {
    fontFamily: [
      'Geo',
      'sans-serif'
    ].join(','),
  },
});
