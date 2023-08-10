import React, { useState, useEffect, useReducer, ChangeEvent } from 'react'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import ListItemText from '@mui/material/ListItemText'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Checkbox from '@mui/material/Checkbox'
import axios from 'axios'
import { Typography } from '@mui/material'
import { useRecoilState, useRecoilValue } from 'recoil'
import { stepCountStore } from '../../store/atom'
import {
  variableStoreX,
  variableStoreY,
  selectedVarStoreX,
  selectedVarStoreY,
} from 'views/DataAnalysis/store/variable/atom'
import { cloneDeep } from 'lodash'

const ITEM_HEIGHT = 50
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

const TagSelectList = (props: any) => {
  const { multipleSelection, onSelection, type } = props

  const activeStep = useRecoilValue(stepCountStore)
  const [varListX, setVarListX] = useRecoilState(variableStoreX)
  const [varListY, setVarListY] = useRecoilState(variableStoreY)

  const [selectedVarX, setSelectedVarX] = useRecoilState(selectedVarStoreX)
  const [selectedVarY, setSelectedVarY] = useRecoilState(selectedVarStoreY)

  const [checkedValue, setChackedValue] = useState([])
  const [tagType, setTagType] = useState('')
  const [multiple, setMultiple] = useState(true)
  const [tagName, setTagName] = useState<string[]>([])

  useEffect(() => {
    fetchTaglistData()
  }, [])

  useEffect(() => {
    setMultiple(multipleSelection)
  }, [multipleSelection])

  useEffect(() => {
    setTagType(props.type)
  }, [props.type])

  const handleChange = (event: SelectChangeEvent<typeof tagName>) => {
    const selectedValue = event.target.value
    // when selection changed, update datasource for the menuItem on select component

    //원인변수, 타겟변수 동시 선택 막기위해 분기처리
    if (type === 'EXPLANATORY_VARIABLE') {
      for (let i = 0; i < selectedValue.length; i++) {
        setVarListY(varListY.filter((x) => x.name !== selectedValue[i]))
      }
    } else if (type === 'TARGET_VARIABLE') {
      for (let i = 0; i < selectedValue.length; i++) {
        setVarListX(varListX.filter((x) => x.name !== selectedValue)) //single selection
      }
    }

    setTagName(typeof selectedValue === 'string' ? selectedValue.split(',') : selectedValue)
  }

  useEffect(() => {
    const tempArr: Array<any> = []
    let tagList //selectbox 렌더링할 배열

    if (type === 'EXPLANATORY_VARIABLE') {
      tagList = varListX
      setSelectedVarX(tagName)
    }
    if (type === 'TARGET_VARIABLE') {
      tagList = varListY
      setSelectedVarY(tagName)
    }

    if (tagName.length > 0) {
      //formatting for API
      //tempArr : {id: 'power_0_0', name: 'single-phase'}, {id: 'power_0_1', name: 'three-phase'}]
      //tagName : ['single-phase', 'three-phase']

      for (let i = 0; i < tagName.length; i++) {
        const selectedTag = tagList.filter((data: any) => data.name == tagName[i])
        tempArr.push(selectedTag[0]) //for formatting
      }

      const result = []
      const unique_table = [...new Map(tempArr.map((data: any) => [data.table_nm, data.table_nm])).values()]

      for (const tb of unique_table) {
        //테이블 명으로 데이터 필터 후 필요한 데이터만 리스트로 추출
        const tag_data = tempArr.filter((item: any) => item.table_nm === tb).map((m_item: any) => m_item.name)
        result.push({ table_nm: tb, variable: tag_data })
      }

      //가공된 데이터 props로 넘기는 부분
      onSelection(tagType, result)
    }
  }, [tagName])

  const fetchTaglistData = () => {
    axios
      .post(process.env.REACT_APP_API_SERVER_URL + '/api/tag/list', {
        com_id: localStorage.getItem('companyId'),
        search_type: 'all',
      })
      .then((response) => {
        // console.log('fetching taglist data:', response)
        //recoil state 에 전체 태그 데이터 저장
        setVarListX(response.data)
        setVarListY(response.data)
      })
      .catch((error) => error('Data Load Failed'))
  }

  const renderTagList = () => {
    let array
    if (type === 'EXPLANATORY_VARIABLE') {
      array = varListX
    } else if (type === 'TARGET_VARIABLE') {
      array = varListY
    }

    return (
      array &&
      array.map((data: any) => (
        <MenuItem key={data.name} value={data.name}>
          <Checkbox checked={tagName.indexOf(data.name) > -1} />
          <ListItemText primary={data.name} />
        </MenuItem>
      ))
    )
  }

  const renderCheckedTagList = () => {
    let array
    const tempArray = ['three-phase', 'single-phase', 'Tag-9']
    const checkedIndex = []

    if (type === 'EXPLANATORY_VARIABLE') {
      // console.log(selectedVarX)
      // console.log(array)
      array = cloneDeep(varListX)

      for (let i = 0; i < tempArray.length; i++) {
        checkedIndex.push(array.findIndex((el) => el.name === tempArray[i]))
      }

      for (let i = 0; i < array.length; i++) {
        if (checkedIndex.includes(i)) {
          array[i].checked = true
        } else {
          array[i].checked = false
        }
        array[i].disabled = true
      }
    }
    // else if (type === 'TARGET_VARIABLE') {
    //   console.log(selectedVarY)
    //   array = varListY
    // }

    return (
      array &&
      array.map((data: any) => (
        <MenuItem key={data.name} value={data.name}>
          <Checkbox checked={data.checked} onChange={() => (data.checked = true)} />
          <ListItemText primary={data.name} />
        </MenuItem>
      ))
    )
  }

  const handleCheckChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('checked data value:', event.target.value)
  }
  return (
    <>
      <FormControl sx={{ m: 1, width: 250 }} size="small">
        <InputLabel id="demo-multiple-checkbox-label">Select...</InputLabel>
        <Select
          labelId="demo-select-small-label"
          id="demo-select-small"
          multiple={multiple}
          value={tagName}
          onChange={handleChange}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {activeStep === 1 && renderTagList()}
          {activeStep === 3 && renderCheckedTagList()}
        </Select>
      </FormControl>
      <div style={{ marginTop: '20px' }}>
        {tagName.length > 0 && (
          <div>
            <Typography variant="body2" gutterBottom marginLeft={2}>
              {' '}
              Selected Tags
            </Typography>
            <Typography variant="body2" gutterBottom marginLeft={2}>
              {tagName.join(', ')}
            </Typography>
          </div>
        )}

        {/* {tagName.length > 0 && <p className="title-md">선택된 태그</p>}
        {tagName.length > 0 ? <p className="contents">{tagName.join(', ')}</p> : ''} */}
      </div>
    </>
  )
}

export default TagSelectList
