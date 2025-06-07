import createTheme from '@mui/material/styles/createTheme';
import { getContrastRatio } from '@mui/material';
import { lighten, darken } from '@mui/material/styles';

const getContrastTextColor = (color: string, contrastColor = '#FFFFFF') => {
  return getContrastRatio(color, contrastColor) > 4.5
    ? contrastColor
    : '#111111';
};

let theme = createTheme({
  // Components overrides
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },

  palette: {
    mode: 'dark',
    primary: {
      light: lighten('#ffce03', 0.2),
      main: '#ffce03',
      dark: darken('#ffce03', 0.2),
      contrastText: getContrastTextColor('#ffce03'),
    },
    secondary: {
      light: lighten('#43A047', 0.2),
      main: '#43A047',
      dark: darken('#43A047', 0.2),
      contrastText: getContrastTextColor('#43A047'),
    },
    background: {
      default: '#121212',
      paper: '#1d1d1d',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0bec5',
    },
  },

  typography: {
    fontFamily: '"Inter", sans-serif',
  },
});

export default theme;
