import { green, purple } from '@mui/material/colors'
import { createTheme, ThemeProvider } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: {
      main: 'rgb(67, 56, 247)',
    },
    secondary: {
      main: green[500],
    },
  },
})
