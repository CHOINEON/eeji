import React, { useState, useEffect, useReducer } from 'react'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import ListItemText from '@mui/material/ListItemText'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Checkbox from '@mui/material/Checkbox'
import axios from 'axios'
import TagSelect from '../components/TagTree/reducer'
import initialState from '../components/TagTree/initialState'

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

type testType = {
  id: ''
  name: ''
  table_nm: ''
}
const TagSelectList = (props: any) => {
  const { multipleSelection, onSelection } = props
  const [tagType, setTagType] = useState('')
  const [multiple, setMultiple] = useState(true)
  const [tagName, setTagName] = useState<testType[]>([])
  // const [tagArray, setTagArray] = useState<any[]>([])

  const [names, setNames] = useState<any>()
  const [state, dispatch] = useReducer(TagSelect, initialState)

  useEffect(() => {
    //render taglist dropdown
    fetchTaglistData()
  }, [])

  useEffect(() => {
    // console.log('state:', state)
  }, [state])

  useEffect(() => {
    setMultiple(multipleSelection)
  }, [multipleSelection])

  useEffect(() => {
    setTagType(props.type)
  }, [props.type])

  // useEffect(() => {
  //   // console.log('state:::::::', state)
  //   if (state.explanatoryTag.length > 0) {
  //     setExplanatoryVar(state.explanatoryVar)
  //   } else if (state.targetTag.length > 0) {
  //     setTargetVar(state.targetTag)
  //   }
  // }, [state])

  const handleChange = (event: SelectChangeEvent<typeof tagName>) => {
    console.log('event:', event)

    const {
      target: { value },
    } = event
    //setTagName(typeof value === 'string' ? value.split(',') : value)
  }

  useEffect(() => {
    // console.log(tagName)
    const tempArr = []
    if (tagName.length > 0) {
      for (let i = 0; i < tagName.length; i++) {
        const selectedTag = names.filter((data: any) => data.name == tagName[i])
        tempArr.push(selectedTag[0])
      }
    }
    //NEXT버튼 누를 때 step3로 선택값 파라메터로 /api/tag/preprocessing 호출 ------- 나중에 contextAPI붙여서 전역 상태관리/혹은 redux 로 바꿔야함
    dispatch({ type: tagType, payload: tempArr })

    if (tagType === 'TARGET_VARIABLE') {
      onSelection('targetTag', state.targetTag)
    } else if (tagType === 'EXPLANATORY_VARIABLE') {
      onSelection('explanatoryTag', state.explanatoryTag)
    }
  }, [tagName])

  const fetchTaglistData = () => {
    axios
      .post(process.env.REACT_APP_API_SERVER_URL + '/api/tag/list', {
        com_id: localStorage.getItem('companyId'),
        search_type: 'all',
      })
      .then((response) => {
        // console.log('fetchTaglistData:', response)
        setNames(response.data)
      })
      .catch((error) => error('Data Load Failed'))
  }

  const handleRenderValue = (selected: Array<any>) => {
    console.log(selected) //array [{"id":'', "name":''}]    안에 JSON 으로 담겨있음. 쓰려면 for문 돌면서 파싱해야됨
    const test = selected.map((value: string, index: number) => {
      console.log(JSON.parse(value[index]))
    })

    // const obj = JSON.parse(selected) //번거로움....

    // console.log('handleRenderValue:', JSON.parse(selected).name)
    //must return string[]
    return '--' //      tag1, tag2, tag3
  }

  return (
    <>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-checkbox-label">Explanatory Variables...</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple={multiple}
          value={tagName}
          onChange={handleChange}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => selected.join(', ')}
          //renderValue={handleRenderValue}
          MenuProps={MenuProps}
        >
          {names &&
            names.map((data: any) => (
              <MenuItem key={data.name} value={JSON.stringify(data)}>
                <Checkbox checked={tagName.indexOf(data.name) > -1} />
                <ListItemText primary={data.name} />
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      {tagName.length > 0 ? `selectedTags : ` + tagName.join(', ') : ''}
    </>
  )
}

export default TagSelectList
