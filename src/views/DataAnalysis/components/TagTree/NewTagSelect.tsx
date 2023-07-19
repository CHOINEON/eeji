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

const NewTagSelect = (props: any) => {
  const { selectionType, type, title, style } = props

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
    // console.log('-----------usedVariable:::::', usedVariable)

    // let category = ''
    // if (type === 'TARGET_VARIABLE') category = 'y'
    // if (type === 'EXPLANATORY_VARIABLE') category = 'x'

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

      const result = []
      for (let i = 0; i < usedVariable.length; i++) {
        if (value.includes(usedVariable[i].value)) {
          result.push({ value: usedVariable[i].value, used: true, category: type === 'TARGET_VARIABLE' ? 'y' : 'x' })
        } else {
          result.push(usedVariable[i])
        }
      }
      // console.log('result:', result)
      setUsedVariable(result)

      //   if (type === 'TARGET_VARIABLE') {
      //     const result = []
      //     for (let i = 0; i < usedVariable.length; i++) {
      //       if (value.includes(usedVariable[i].value)) {
      //         result.push({ value: usedVariable[i].value, used: true, category: 'y' })
      //       } else {
      //         result.push(usedVariable[i])
      //       }
      //     }
      //     // console.log('result:', result)
      //     setVariableUsage(result)
      //   } else if (type === 'EXPLANATORY_VARIABLE') {
      //     const result = []
      //     for (let i = 0; i < usedVariable.length; i++) {
      //       if (value.includes(usedVariable[i].value)) {
      //         result.push({ value: usedVariable[i].value, used: true, category: 'x' })
      //       } else {
      //         result.push(usedVariable[i])
      //       }
      //     }
      //     // console.log('result:', result)
      //     setVariableUsage(result)
      //   }
      // }
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
    // console.log('param:', param)
    // console.log('value:', value)

    // if (type === 'TARGET_VARIABLE') {
    const result = []
    for (let i = 0; i < usedVariable.length; i++) {
      if (value.includes(usedVariable[i].value)) {
        result.push({ value: usedVariable[i].value, used: false })
      } else {
        result.push(usedVariable[i])
      }
    }
    // console.log('result:', result)
    setUsedVariable(result)
    // }
  }

  // useEffect(() => {
  //   // console.log('filtered::', filteredOptions)
  //   if (filteredOptions && filteredOptions.length > 0) setOptions(filteredOptions)
  // }, [filteredOptions])

  const handleClick = (e: any) => {
    // console.log('new tagselect handleClick: ', e)
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
        // allowClear
        // showSearch
        placeholder="Search to select"
        optionFilterProp="children"
        filterOption={(input, option) => (option?.label ?? '').includes(input)}
        filterSort={(optionA, optionB) =>
          (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
        }
        value={value}
        options={options}
        onChange={handleChange}
        onDeselect={handleDeselect}
        // onClear={handleClear}
        // onClick={handleClick}
        maxTagCount="responsive"
        // onSelect={handleSelect}
        // onDropdownVisibleChange={handleDropdownVisibleChange}
        // defaultActiveFirstOption={true}
      ></Select>
    </div>
  )
}

export default NewTagSelect
