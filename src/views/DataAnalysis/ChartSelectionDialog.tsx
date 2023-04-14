import React, { useState, useEffect } from 'react'
import { Dialog, DialogTitle, List, ListItem, ListItemText, ListItemButton } from '@mui/material'

const charts = ['Scatter Plot', 'Line Chart']

const ChartSelectionDialog = (props: any) => {
  useEffect(() => {
    console.log('props:', props)
  }, [])

  const { isShow } = props
  const [open, setOpen] = useState(false)

  const handleListItemClick = (e: any) => {
    console.log('e:', e)
  }
  return (
    <Dialog open={isShow}>
      <DialogTitle>Select chart...</DialogTitle>
      {/* <List sx={{ pt: 0 }}>{charts.map((chart: any) => console.log('chart:', chart))}</List> */}
    </Dialog>
  )
}

export default ChartSelectionDialog
