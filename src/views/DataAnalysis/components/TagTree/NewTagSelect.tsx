import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Typography } from '@mui/material'
import { useRecoilState } from 'recoil'
import {
  selectedVarStoreX,
  selectedVarStoreY,
  indexColumnStore,
  variableStore,
  usedVariableStore,
} from '../../store/atom'
import { Select } from 'antd'

interface NewTagSelectProps {
  selectionType: string
  type: string
  title?: string
  style?: any
  onSelect: any
  onDeselect?: any //only for multiple deselect
  loading?: boolean
  selectOptions?: any
}

const NewTagSelect: React.FC<NewTagSelectProps> = (props: any) => {
  const { selectionType, type, title, style, onSelect, onDeselect, loading, selectOptions } = props

  const [options, setOptions] = useState([])
  const [value, setValue] = useState([])

  //최초 리스트
  const [variableList, setVariableList] = useRecoilState(variableStore)
  const [usedVariable, setUsedVariable] = useRecoilState(usedVariableStore)

  const [selectedVarX, setSelectedVarX] = useRecoilState(selectedVarStoreX)
  const [selectedVarY, setSelectedVarY] = useRecoilState(selectedVarStoreY)
  const [indexColumn, setIndexColumn] = useRecoilState(indexColumnStore)

  // useEffect(() => console.log('selectOptions:', selectOptions)), [selectOptions]

  //Update "options" in <Select> whenever feature selected
  useEffect(() => {
    // console.log('-----------usedVariable:::::', usedVariable)

    if (usedVariable && usedVariable.length > 0) {
      if (type === 'TARGET_VARIABLE') {
        const leftItems = usedVariable.filter((item) => item.category !== 'x').map((item) => item.value)
        setOptions(variableList[0].options.filter((x: any) => leftItems.includes(x.value)))
      } else {
        const leftItems = usedVariable.filter((item) => item.category !== 'y').map((item) => item.value)
        setOptions(variableList[0].options.filter((x: any) => leftItems.includes(x.value)))
      }
    }
  }, [usedVariable])

  useEffect(() => {
    setOptions(variableList)
  }, [variableList])

  const handleSelect = (value: any) => {
    const selected = {
      type: type === 'TARGET_VARIABLE' ? 'y' : 'x',
      value: value,
    }
    onSelect(selected)
  }

  const handleDeselect = (value: any) => {
    const deselected = {
      type: type === 'TARGET_VARIABLE' ? 'y' : 'x',
      value: value,
    }
    onDeselect(deselected)
    // const result = []
    // for (let i = 0; i < usedVariable.length; i++) {
    //   if (value.includes(usedVariable[i].value)) {
    //     result.push({ value: usedVariable[i].value, used: false })
    //   } else {
    //     result.push(usedVariable[i])
    //   }
    // }
    // setUsedVariable(result)
  }

  // only for rendering inside of the component itself
  const handleChange = (selectedValue: any) => {
    // console.log('handleChange:: ', selectedValue)
    setValue(selectedValue)

    //   if (type === 'TARGET_VARIABLE') {
    //     setSelectedVarY([selectedValue])
    //   }
    //   if (type === 'EXPLANATORY_VARIABLE') {
    //     setSelectedVarX(selectedValue)
    //   }
    //   if (type === 'INDEX_COLUMN') {
    //     setIndexColumn(selectedValue)
    //   }

    //   const selected = {
    //     type: type === 'TARGET_VARIABLE' ? 'y' : 'x',
    //     value: value,
    //   }
    //   onChange(selected)

    //   const result = []
    //   for (let i = 0; i < usedVariable.length; i++) {
    //     if (value.includes(usedVariable[i].value)) {
    //       result.push({ value: usedVariable[i].value, used: true, category: type === 'TARGET_VARIABLE' ? 'y' : 'x' })
    //     } else {
    //       result.push(usedVariable[i])
    //     }
    //   }
    //   // console.log('result:', result)
    //   setUsedVariable(result)
  }

  return (
    <div style={style}>
      <Typography variant="subtitle2" gutterBottom marginLeft={1}>
        {title}
      </Typography>
      <Select
        id={selectionType}
        mode={selectionType}
        loading={loading}
        disabled={loading}
        bordered={true}
        placeholder="Search to select"
        optionFilterProp="children"
        filterOption={(input, option) => (option?.label ?? '').includes(input)}
        value={value}
        options={options}
        onChange={handleChange}
        onSelect={handleSelect}
        onDeselect={handleDeselect}
        maxTagCount="responsive"
        // filterSort={(optionA, optionB) =>
        //   (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
        // }
        // onClear={handleClear}
        // onClick={handleClick}
        // onDropdownVisibleChange={handleDropdownVisibleChange}
        // defaultActiveFirstOption={true}
      ></Select>
    </div>
  )
}

export default NewTagSelect
