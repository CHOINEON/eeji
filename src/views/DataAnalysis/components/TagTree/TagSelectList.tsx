import React, { useState, useEffect, useReducer } from 'react'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import ListItemText from '@mui/material/ListItemText'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Checkbox from '@mui/material/Checkbox'
import axios from 'axios'
import TagSelect from './reducer'
import initialState from './initialState'
import { Text } from '@chakra-ui/react'

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

// type TestProp = {
//   data: string
//   id: string
// }

// const names = [{ id: 'testid', name: 'testname' }]

const TagSelectList = (props: any) => {
  const { multipleSelection, onSelection } = props
  const [tagType, setTagType] = useState('')
  const [multiple, setMultiple] = useState(true)
  const [tagName, setTagName] = useState<string[]>([])
  // const [tagArray, setTagArray] = useState<any[]>([])

  const [names, setNames] = useState<string[]>([])
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
    const {
      target: { value },
    } = event

    // console.log('value:', value)
    setTagName(typeof value === 'string' ? value.split(',') : value)
  }

  useEffect(() => {
    const tempArr = []
    if (tagName.length > 0) {
      for (let i = 0; i < tagName.length; i++) {
        const selectedTag = names.filter((data: any) => data.name == tagName[i])
        tempArr.push(selectedTag[0])
      }

      // console.log('tempArr:', tempArr) //{id: 'power_0_0', name: 'single-phase'}, {id: 'power_0_1', name: 'three-phase'}]
      // console.log('tagname:', tagName) //['single-phase', 'three-phase']

      const result = []
      const unique_table = [...new Map(tempArr.map((data: any) => [data.table_nm, data.table_nm])).values()]

      for (const tb of unique_table) {
        //테이블 명으로 데이터 필터 후 필요한 데이터만 리스트로 추출
        const tag_data = tempArr.filter((item: any) => item.table_nm === tb).map((m_item: any) => m_item.name)
        result.push({ table_nm: tb, variable: tag_data })
      }

      // console.log('result:', result)
      onSelection(tagType, result)
    }

    // //NEXT버튼 누를 때 step3로 선택값 파라메터로 /api/tag/preprocessing 호출 ------- 나중에 contextAPI붙여서 전역 상태관리/혹은 redux 로 바꿔야함
    // dispatch({ type: tagType, payload: tempArr })
    // if (tagType === 'TARGET_VARIABLE') {
    //   onSelection('targetTag', state.targetTag)
    // } else if (tagType === 'EXPLANATORY_VARIABLE') {
    //   onSelection('explanatoryTag', state.explanatoryTag)
    // }
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

  return (
    <>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-checkbox-label">Select...</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={tagName}
          onChange={handleChange}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {names &&
            names.map((data: any) => (
              <MenuItem key={data.name} value={data.name}>
                <Checkbox checked={tagName.indexOf(data.name) > -1} />
                <ListItemText primary={data.name} />
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      <div style={{ marginTop: '20px' }}>
        {tagName.length > 0 && (
          <div>
            <Text fontSize="md" color="secondaryGray.600" fontWeight="700" mb="5px" marginLeft={2}>
              Selected Tags
            </Text>
            <Text fontSize="md" color="secondaryGray.600" fontWeight="300" mb="5px" marginLeft={2}>
              {tagName.join(', ')}
            </Text>
          </div>
        )}

        {/* {tagName.length > 0 && <p className="title-md">선택된 태그</p>}
        {tagName.length > 0 ? <p className="contents">{tagName.join(', ')}</p> : ''} */}
      </div>
    </>
  )
}

export default TagSelectList
