import React from 'react'
import TreeView from '@mui/lab/TreeView'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
// import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import TreeItem from '@mui/lab/TreeItem'

import { createTheme, ThemeProvider } from '@mui/material/styles'
import { green, purple } from '@mui/material/colors'

const theme = createTheme({
  palette: {
    primary: {
      main: purple[500],
    },
    secondary: {
      main: green[500],
    },
  },
})

const DatabaseNavigator = () => {
  return (
    <div style={{ border: '1px solid black' }}>
      <ThemeProvider theme={theme}>
        <TreeView
        // aria-label="file system navigator"
        // defaultCollapseIcon={<ExpandMoreIcon />}
        // defaultExpandIcon={<ExpandMoreIcon />}
        // sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
        >
          <TreeItem nodeId="1" label="Dongwon">
            <TreeItem nodeId="2" label="Main" />
            <TreeItem nodeId="3" label="Power" />
            <TreeItem nodeId="4" label="T/C" />
          </TreeItem>
        </TreeView>
      </ThemeProvider>
    </div>
  )
}

export default DatabaseNavigator
