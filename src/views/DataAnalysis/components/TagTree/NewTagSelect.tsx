import React, { useState, useEffect, useReducer, ChangeEvent } from 'react'

import axios from 'axios'
import { Typography } from '@mui/material'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  stepCountStore,
  variableStoreX,
  variableStoreY,
  selectedVarStoreX,
  selectedVarStoreY,
  indexColumnStore,
} from '../../atom'
import { cloneDeep, eachRight } from 'lodash'
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
  const { selectionType, onSelectionChanged, type, title, style, defaultValue } = props

  const [options, setOptions] = useState([])
  const [value, setValue] = useState()

  //최초 리스트
  const [rawDataX, setRawDataX] = useRecoilState(variableStoreX)
  const [rawDataY, setRawDataY] = useRecoilState(variableStoreY)

  const [selectedVarX, setSelectedVarX] = useRecoilState(selectedVarStoreX)
  const [selectedVarY, setSelectedVarY] = useRecoilState(selectedVarStoreY)

  const [indexColumn, setIndexColumn] = useRecoilState(indexColumnStore)

  useEffect(() => {
    fetchTaglistData()
  }, [])

  useEffect(() => {
    if (defaultValue !== undefined && defaultValue.length > 0) {
      console.log('new tag select:', 'useEffect')
      //타겟변수를 선택한 경우에 원인변수에서 호출되는 부분
      setValue(defaultValue)
    }
  }, [defaultValue])

  const handleClick = (e: any) => {
    if (type === 'EXPLANATORY_VARIABLE') {
      // console.log('before: ', options)
      // console.log('rawDataX:', rawDataX)
      // console.log('selected Y:', selectedVarY)

      if (selectedVarY.length > 0) {
        setOptions(rawDataX[0].options.filter((x: any) => x.value !== selectedVarY[0].variable[0]))
      }
    }
  }

  const handleChange = (selectedValue: any) => {
    // console.log('handleChange:: ', selectedValue)
    setValue(selectedValue)

    if (type === 'TARGET_VARIABLE') {
      //formatting FOR VARIABLE Y
      const formattedObj = { table_nm: rawDataY[0].label, variable: [selectedValue] }

      setSelectedVarY([formattedObj])

      ////////////TEST////////////////////////////////////
      // 타겟변수 제외한 모든 변수를 원인변수의 디폴트로 선택
      // const X_defaultValue = rawDataX[0].options
      //   .filter((x: any) => x.value !== selectedValue)
      //   .map((row: any) => row.value)

      // 원인변수 세팅 위해서 props 넘기기
      // onSelectionChanged({ type, X_defaultValue })
      ////////////TEST////////////////////////////////////
    }
    if (type === 'EXPLANATORY_VARIABLE') {
      //formatting FOR VARIABLE X
      const result = []
      result.push({ table_nm: rawDataX[0].label, variable: selectedValue })

      setSelectedVarX(result)
    }

    if (type === 'INDEX_COLUMN') {
      setIndexColumn(selectedValue)
    }
  }

  const handleAllSelect = () => {
    // 타겟변수 제외한 모든 변수를 원인변수의 디폴트로 선택
    const X_defaultValue = rawDataX[0].options.filter((x: any) => x.value !== value).map((row: any) => row.value)

    ////////////TEST/////////////
    //원인변수 세팅 위해서 props 넘기기
    onSelectionChanged({ type, X_defaultValue })

    //formatting FOR VARIABLE X
    const result = []
    result.push({ table_nm: rawDataX[0].label, variable: X_defaultValue })

    setSelectedVarX(result)
  }

  const fetchTaglistData = () => {
    axios
      .post(process.env.REACT_APP_API_SERVER_URL + '/api/tag/list', {
        com_id: localStorage.getItem('companyId'),
        search_type: 'tree',
      })
      .then((response) => {
        // console.log('--------------:', response.data)
        setRawDataX(response.data)
        setRawDataY(response.data)
        setOptions(response.data)
      })
      .catch((error) => error('Data Load Failed'))
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
        onClick={handleClick}
        maxTagCount="responsive"
        // onSelect={handleSelect}
        // onDropdownVisibleChange={handleDropdownVisibleChange}
        defaultActiveFirstOption={true}
      ></Select>
      {/* {type === 'EXPLANATORY_VARIABLE' && <button onClick={handleAllSelect}>All select</button>} */}
    </div>
  )
}

export default NewTagSelect
