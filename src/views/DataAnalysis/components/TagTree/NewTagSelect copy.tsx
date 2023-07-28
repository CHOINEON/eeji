import React, { useState, useEffect } from 'react'
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
  onChange?: any
  loading?: boolean
}

const NewTagSelect: React.FC<NewTagSelectProps> = (props: any) => {
  const { selectionType, type, title, style, onChange, loading } = props

  const [options, setOptions] = useState([])
  const [value, setValue] = useState([])

  //최초 리스트
  const [variableList, setVariableList] = useRecoilState(variableStore)
  const [usedVariable, setUsedVariable] = useRecoilState(usedVariableStore)

  const [selectedVarX, setSelectedVarX] = useRecoilState(selectedVarStoreX)
  const [selectedVarY, setSelectedVarY] = useRecoilState(selectedVarStoreY)
  const [indexColumn, setIndexColumn] = useRecoilState(indexColumnStore)

  //Update "options" in <Select> whenever feature selected
  useEffect(() => {
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

  useEffect(() => {
    if (value) {
      // console.log('value changed:', value)
      // console.log('usedVariable:', usedVariable)

      const selected = {
        type: type === 'TARGET_VARIABLE' ? 'y' : 'x',
        value: value,
      }
      onChange(selected)

      const result = []
      for (let i = 0; i < usedVariable.length; i++) {
        if (value.includes(usedVariable[i].value)) {
          result.push({ value: usedVariable[i].value, used: true, category: type === 'TARGET_VARIABLE' ? 'y' : 'x' })
        } else {
          result.push(usedVariable[i])
        }
      }
      setUsedVariable(result)
    }
  }, [value])

  //상위로 이동
  // const fetchTaglistData = () => {
  //   axios
  //     .post(
  //       process.env.REACT_APP_API_SERVER_URL + '/api/tag/list',
  //       {
  //         com_id: localStorage.getItem('companyId'),
  //         search_type: 'tree',
  //       }
  //       // { cancelToken: cancelSource }
  //     )
  //     .then((response) => {
  //       // console.log('fetchTaglistData:', response.data)
  //       setVariableList(response.data)

  //       const values = response.data[0].options
  //       const valueArr: Array<any> = values.map((item: any) => item.value)

  //       const result: Array<any> = []
  //       valueArr.forEach((value: any) => {
  //         result.push({ value: value, used: false })
  //       })

  //       setUsedVariable(result)
  //       // setFilteredList(response.data)
  //     })
  //     .catch((error) => error('Data Load Failed'))
  // }

  const handleDeselect = (param: any) => {
    const result = []
    for (let i = 0; i < usedVariable.length; i++) {
      if (value.includes(usedVariable[i].value)) {
        result.push({ value: usedVariable[i].value, used: false })
      } else {
        result.push(usedVariable[i])
      }
    }
    setUsedVariable(result)
  }

  const handleChange = (selectedValue: any) => {
    // console.log('handleChange:: ', selectedValue)
    setValue(selectedValue)

    if (type === 'TARGET_VARIABLE') {
      setSelectedVarY([selectedValue])
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
        loading={loading}
        disabled={loading}
        bordered={true}
        placeholder="Search to select"
        optionFilterProp="children"
        filterOption={(input, option) => (option?.label ?? '').includes(input)}
        value={value}
        options={options}
        onChange={handleChange}
        onDeselect={handleDeselect}
        maxTagCount="responsive"
        // filterSort={(optionA, optionB) =>
        //   (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
        // }
        // allowClear
        // showSearch
        // onClear={handleClear}
        // onClick={handleClick}
        // onSelect={handleSelect}
        // onDropdownVisibleChange={handleDropdownVisibleChange}
        // defaultActiveFirstOption={true}
      ></Select>
    </div>
  )
}

export default NewTagSelect
