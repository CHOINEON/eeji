import React, { useState, useEffect } from 'react'
// import { Dialog, DialogTitle, List, ListItem, ListItemText, ListItemButton } from '@mui/material'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import DialogTitle from '@mui/material/DialogTitle'
import Dialog from '@mui/material/Dialog'
import ico_line from 'assets/img/ineeji/ico_line.png'
import ico_scatter_plot from 'assets/img/ineeji/ico_scatter_plot.png'
// import Image from 'next/image'

// export const charts = ['Scatter Plot', 'Line Chart']

export const charts = [
  { name: 'Scatter Plot', icon: ico_scatter_plot },
  { name: 'Line Chart', icon: ico_line },
]

const ChartSelectionDialog = (props: any) => {
  /**
   *  Failed prop type: The prop `open` is marked as required in `ForwardRef(ModalUnstyled)`, but its value is `undefined`
   */
  //Dialog 컴포넌트 생성 전에 open이벤트 렌더링 되는거 막음(음..... 생각좀 해보자...)
  const [dialog, setDialog] = useState(false)

  const { isOpen, onDialogClose, onSelectChart } = props

  const [open, setOpen] = useState(false)

  // useEffect(() => console.log('props:', props), [props])

  useEffect(() => {
    setDialog(true)
    setOpen(isOpen)
  }, [isOpen])

  const handleClose = () => {
    setOpen(false)
    onDialogClose(true)
  }

  const handleListItemClick = (value: string) => {
    setOpen(false)
    onDialogClose(true)
    onSelectChart(value)
  }

  return (
    dialog && (
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Select Chart...</DialogTitle>
        <List sx={{ pt: 0 }}>
          {charts.map((chart) => (
            <ListItem disableGutters key={chart.name}>
              <ListItemButton key={chart.name} onClick={() => handleListItemClick(chart.name)}>
                <img src={chart.icon} width={30} style={{ margin: 5 }} alt={chart.name} />
                <ListItemText primary={chart.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Dialog>
    )
  )
}

export default ChartSelectionDialog
