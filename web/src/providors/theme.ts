import { createTheme } from '@mui/material/styles';
import { green, lightGreen } from '@mui/material/colors';

export const theme = createTheme({
  palette: {
    primary: green,
    secondary: {
        main: lightGreen['A100'],
    }
  }
})