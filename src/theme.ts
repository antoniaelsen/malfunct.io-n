import { createMuiTheme } from '@material-ui/core/styles';
import { cyan, indigo, orange, pink } from '@material-ui/core/colors';

// Theming
// Style guide colors

interface PaletteIntention {
  light?: string;
  main: string;
  dark?: string;
  contrastText?: string;
};

const backgroundDark: PaletteIntention = {
  main: '#0a1431',
};


let muiTheme = createMuiTheme({
  palette: {
    type: 'dark',
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

console.log("Theme |", muiTheme);
export const theme = muiTheme;
