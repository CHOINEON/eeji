import React, { useState, useEffect, useReducer, ChangeEvent } from 'react'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox'
import axios from 'axios'
import { Typography } from '@mui/material'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  stepCountStore,
  variableStoreX,
  variableStoreY,
  selectedVarStoreX,
  selectedVarStoreY,
  tagListStore,
} from '../../atom'
import { cloneDeep } from 'lodash'
import { Col, Row, DatePicker, Select, Space, Divider, Tag } from 'antd'
import type { CustomTagProps } from 'rc-select/lib/BaseSelect'
import type { SelectProps } from 'antd'

const options: SelectProps['options'] = []
const testOption = [
  { value: 'yoga_train_0_426', label: 'x427' },
  { value: 'yoga_train_0_425', label: 'x426' },
  { value: 'yoga_train_0_424', label: 'x425' },
]

for (let i = 0; i < testOption.length; i++) {
  options.push(testOption[i])
}

const tagRender = (props: CustomTagProps) => {
  const { label, value, closable, onClose } = props
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }
  return (
    <Tag
      // color={value}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginRight: 3 }}
    >
      {label}
    </Tag>
  )
}

const NewTagSelect = (props: any) => {
  const { selectionType, onSelectionChanged, type, title, style, defaultSelectedArr } = props

  const activeStep = useRecoilValue(stepCountStore)

  const [options, setOptions] = useState([])

  // const [selectedValue, setSelectedValue] = useState([])
  const [checkedValue, setChackedValue] = useState([])
  // const [tagType, setTagType] = useState('')
  const [defaultValue, setDefaultValue] = useState([])

  const [value, setValue] = useState([])
  //최초 리스트
  const [rawDataX, setRawDataX] = useRecoilState(variableStoreX)
  const [rawDataY, setRawDataY] = useRecoilState(variableStoreY)

  //필터링 된 리스트
  const [filteredVarX, setFilteredVarX] = useState([])
  const [filteredVarY, setFilteredVarY] = useState([])

  const [selectedVarX, setSelectedVarX] = useRecoilState(selectedVarStoreX)
  const [selectedVarY, setSelectedVarY] = useRecoilState(selectedVarStoreY)

  const [tagList, setTagList] = useRecoilState(tagListStore)

  useEffect(() => {
    fetchTaglistData()
  }, [])

  const handleChange = (selectedValue: any) => {
    console.log('--------handle change--------')
    console.log('selectedValue:', selectedValue)

    setValue(selectedValue)
    console.log('tagList:', tagList)
    const tags: Array<{ value: string; label: string; usedYN: boolean }> = tagList

    if (type === 'TARGET_VARIABLE') {
      //single selection
      let idx = 0
      idx = tagList.findIndex((x) => x.value == selectedValue)

      console.log(idx)
      // tags[idx].usedYN = true
      // console.log('tags:', tags)
      //
    } else {
      //
    }
  }

  const handleSelect = (e: any) => {
    console.log('handleSelect:,', e)
  }

  // const handleClick = (e: any) => {
  //   console.log('handleClick---')
  //   console.log('default value', defaultValue)
  // }

  const fetchTaglistData = () => {
    axios
      .post(process.env.REACT_APP_API_SERVER_URL + '/api/tag/list', {
        com_id: localStorage.getItem('companyId'),
        search_type: 'tree',
      })
      .then((response) => {
        setOptions(response.data)
        storeTagList(response.data)
      })
      .catch((error) => error('Data Load Failed'))
  }

  const storeTagList = (data: any) => {
    // console.log('formattingForStore:', data[0].options)
    const array = data[0].options
    const reformattedArray = array.map((obj: any) => {
      const rObj = { value: '', label: '', usedYN: false }

      rObj.value = obj.value
      rObj.label = obj.label
      rObj.usedYN = false

      return rObj
      // rObj.value = obj.name
    })

    return setTagList(reformattedArray)
  }

  return (
    <div style={style}>
      <Typography variant="subtitle1" gutterBottom marginLeft={1}>
        {title}
      </Typography>
      <Select
        id={selectionType}
        mode={selectionType}
        // tagRender={tagRender}

        allowClear
        showSearch
        placeholder="Search to select"
        optionFilterProp="children"
        filterOption={(input, option) => (option?.label ?? '').includes(input)}
        filterSort={(optionA, optionB) =>
          (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
        }
        value={value}
        options={options}
        onChange={handleChange}
        // onClick={handleClick}
        maxTagCount="responsive"
        onSelect={handleSelect}
        // onDropdownVisibleChange={handleDropdownVisibleChange}
        // defaultActiveFirstOption={true}
        // onDeselect={handleDeselect}
      ></Select>
    </div>
  )
}

export default NewTagSelect
