import React, { useState, useEffect } from 'react'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import ListItemText from '@mui/material/ListItemText'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Checkbox from '@mui/material/Checkbox'
import TreeView from '@mui/lab/TreeView'
import TreeItem from '@mui/lab/TreeItem'
import axios from 'axios'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

// const names = [
//   { id: 1, name: 'Tag-1' },
//   { id: 2, name: 'Tag-2' },
//   { id: 3, name: 'Tag-3' },
// ]

const TagSelectList = (props: any) => {
  const [multiple, setMultiple] = useState(true)
  const [tagName, setTagName] = useState<string[]>([])
  const [names, setNames] = useState<any>()

  useEffect(() => {
    fetchTaglistData()
  }, [])

  useEffect(() => {
    setMultiple(props.multipleSelection)
  }, [props.multipleSelection])

  const handleChange = (event: SelectChangeEvent<typeof tagName>) => {
    const {
      target: { value },
    } = event
    setTagName(typeof value === 'string' ? value.split(',') : value)
  }

  const fetchTaglistData = () => {
    axios
      .post(process.env.REACT_APP_API_SERVER_URL + '/api/tag/list', {
        com_id: localStorage.getItem('companyId'),
        search_type: 'all',
      })
      .then((response) => {
        console.log('fetchTaglistData:', response)
        setNames(response.data)
      })
      .catch((error) => error('Data Load Failed'))
  }

  return (
    <FormControl sx={{ m: 1, width: 300 }}>
      <InputLabel id="demo-multiple-checkbox-label">Explanatory Variables...</InputLabel>
      <Select
        labelId="demo-multiple-checkbox-label"
        id="demo-multiple-checkbox"
        multiple={true}
        value={tagName}
        onChange={handleChange}
        input={<OutlinedInput label="Tag" />}
        renderValue={(selected) => selected.join(', ')}
        MenuProps={MenuProps}
      >
        {names &&
          names.map((data: any) => (
            <MenuItem key={data.id} value={data.name}>
              <Checkbox checked={tagName.indexOf(data.name) > -1} />
              <ListItemText primary={data.name} />
            </MenuItem>
          ))}

        {/* <TreeView
          aria-label="file system navigator"
          // defaultCollapseIcon={<ExpandMoreIcon />}
          // defaultExpandIcon={<ChevronRightIcon />}
          sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
        >
          <TreeItem nodeId="1" label="Applications">
            <TreeItem nodeId="2" label="Calendar" />
          </TreeItem>
          <TreeItem nodeId="5" label="Documents">
            <TreeItem nodeId="10" label="OSS" />
            <TreeItem nodeId="6" label="MUI">
              <TreeItem nodeId="8" label="index.js" />
            </TreeItem>
          </TreeItem>
        </TreeView> */}
      </Select>
    </FormControl>
  )
}

export default TagSelectList
