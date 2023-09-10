import React, { useState, useEffect } from 'react'
import { Typography } from '@mui/material'
import { useRecoilState } from 'recoil'
import {
  selectedVarStoreX,
  selectedVarStoreY,
  indexColumnStore,
  variableStore,
  usedVariableStore,
} from '../../store/variable/atom'
import { Select } from 'antd'

interface NewTagSelectProps {
  selectionType: string
  type: string
  title?: string
  style?: any
  onSelect: any
  onDeselect?: any //only for multiple selection
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

  //Update "options" in <Select> whenever feature selected
  useEffect(() => {
    if (usedVariable && usedVariable.length > 0) {
      if (type === 'y') {
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
      type: type,
      value: value,
    }
    onSelect(selected)
  }

  const handleDeselect = (value: any) => {
    const deselected = {
      type: type,
      value: value,
    }
    onDeselect(deselected)
  }

  // only for rendering inside of the component itself
  const handleChange = (selectedValue: any) => {
    setValue(selectedValue)
  }

  return (
    <div style={style}>
      <Typography variant="subtitle2" gutterBottom marginLeft={1}>
        {title}
      </Typography>
      <Select
        style={{ width: '100%' }}
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
