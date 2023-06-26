import React, { useState, useEffect, useReducer, ChangeEvent, useRef } from 'react'
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
  variableStore,
} from '../../atom'
import { cloneDeep, eachRight } from 'lodash'
import { Col, Row, DatePicker, Select, Space, Divider, Tag } from 'antd'
import type { CustomTagProps } from 'rc-select/lib/BaseSelect'
import type { SelectProps } from 'antd'

// const options: SelectProps['options'] = []
// const testOption = [
//   { value: 'yoga_train_0_426', label: 'x427' },
//   { value: 'yoga_train_0_425', label: 'x426' },
//   { value: 'yoga_train_0_424', label: 'x425' },
// ]

// for (let i = 0; i < testOption.length; i++) {
//   options.push(testOption[i])
// }

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
  const { selectionType, type, title, style, filteredOptions, defaultOptions } = props

  const [options, setOptions] = useState([])
  const [value, setValue] = useState()

  //최초 리스트
  const [variableList, setVariableList] = useRecoilState(variableStore)
  // const [rawDataX, setRawDataX] = useRecoilState(variableStoreX)
  // const [rawDataY, setRawDataY] = useRecoilState(variableStoreY)

  const [filteredData, setFilteredData] = useState([])
  const [selectedVarX, setSelectedVarX] = useRecoilState(selectedVarStoreX)
  const [selectedVarY, setSelectedVarY] = useRecoilState(selectedVarStoreY)

  const [indexColumn, setIndexColumn] = useRecoilState(indexColumnStore)

  useEffect(() => setOptions(defaultOptions), [defaultOptions])
  useEffect(() => {
    if (filteredOptions && filteredOptions.length > 0) setOptions(filteredOptions)
  }, [filteredOptions])

  useEffect(() => {
    return console.log('newtagselect cleanup!')
  }, [])

  const handleClick = (e: any) => {
    // console.log('selectedVarY: ', selectedVarY)
    // if (type === 'EXPLANATORY_VARIABLE') {
    //   if (selectedVarY.length > 0) {
    //     const array = selectedVarY[0].variable //['x1','x2']
    //     for (let i = 0; i < array.length; i++) {
    //       // console.log('options:', options)
    //       // console.log('array[i]:', array[i])
    //       // console.log(
    //       //   'options[0].variable.filter((x: any) => x.value !== array[i]):',
    //       //   options[0].options.filter((x: any) => x.value !== array[i])
    //       // )
    //       const result = []
    //       result.push({
    //         label: rawDataX[0].label,
    //         options: options[0].options.filter((x: any) => x.value !== array[i]),
    //       })
    //       // console.log('---------------------result:', result)
    //       setOptions(result)
    //     }
    //   }
    // }
  }

  const handleChange = (selectedValue: any) => {
    // console.log('handleChange:: ', selectedValue)
    setValue(selectedValue)

    //formatting 을 request 직전으로 옮기자...
    // const result = []
    // result.push({ table_nm: variableList[0].label, variable: selectedValue })

    if (type === 'TARGET_VARIABLE') {
      //formatting FOR VARIABLE Y
      // const formattedObj = { table_nm: rawDataY[0].label, variable: [selectedValue] }

      setSelectedVarY(selectedValue)

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
      setSelectedVarX(selectedValue)
    }

    if (type === 'INDEX_COLUMN') {
      setIndexColumn(selectedValue)
    }
  }

  return (
    <div style={style}>
      <Typography variant="subtitle2" gutterBottom marginLeft={1}>
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
        // defaultActiveFirstOption={true}
      ></Select>
      {/* {type === 'EXPLANATORY_VARIABLE' && <button onClick={handleAllSelect}>All select</button>} */}
    </div>
  )
}

export default NewTagSelect
