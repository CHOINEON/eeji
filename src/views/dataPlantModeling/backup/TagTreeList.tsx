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

const TagTreeList = (props: any) => {
  const [multiple, setMultiple] = useState(true)
  const [tagName, setTagName] = useState<string[]>([])
  const [tagArray, setTagArray] = useState<string[]>([])
  const [names, setNames] = useState<any>()

  useEffect(() => {
    fetchTaglistData()
  }, [])

  // useEffect(() => {
  //   setMultiple(props.multipleSelection)
  // }, [props.multipleSelection])

  const handleChange = (event: SelectChangeEvent<any>) => {
    const {
      target: { value },
    } = event
    console.log('handle change value::', event)
    setTagName(value)
  }

  // useEffect(() => {
  //   const tempArr = []
  //   if (tagName.length > 0) {
  //     for (let i = 0; i < tagName.length; i++) {
  //       const selectedTag = names.filter((data: any) => data.name == tagName[i])
  //       tempArr.push(selectedTag)
  //     }
  //   }
  //   setTagArray(tempArr)
  // }, [tagName])

  const fetchTaglistData = () => {
    axios
      .post(process.env.REACT_APP_API_SERVER_URL + '/api/tag/list', {
        com_id: localStorage.getItem('companyId'),
        search_type: 'tree',
      })
      .then((response) => {
        // console.log('fetchTaglistData:', response)
        setNames(response.data)
      })
      .catch((error) => error('Data Load Failed'))
  }

  return (
    <>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel htmlFor="grouped-native-select">Target Variable...</InputLabel>
        <Select
          native
          defaultValue=""
          id="grouped-native-select"
          label="Target Variable"
          value={tagName}
          onChange={handleChange}
        >
          <option aria-label="None" value="" />
          {names &&
            names.map((data: any) => {
              return (
                <optgroup key={data.id} label={data.name}>
                  {data.children &&
                    data.children.map((child: any) => {
                      return (
                        <option key={child.id} value={child.id}>
                          {child.name}
                        </option>
                      )
                    })}
                </optgroup>
              )
            })}
        </Select>
      </FormControl>
    </>
  )
}

export default TagTreeList
