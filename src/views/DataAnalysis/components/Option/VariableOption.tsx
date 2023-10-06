import { Col, Collapse, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import NewTagSelect from '../TagTree/NewTagSelect'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  selectedVarStoreX,
  selectedVarStoreY,
  usedVariableStore,
  variableStore,
} from 'views/DataAnalysis/store/variable/atom'
import { inputOptionListState } from 'views/DataAnalysis/store/userOption/atom'
import { uploadedDataState } from 'views/DataAnalysis/store/base/atom'

const VariableOption = () => {
  //최초 리스트
  const [variableList, setVariableList] = useRecoilState(variableStore)
  const [usedVariable, setUsedVariable] = useRecoilState(usedVariableStore)

  //선택된 x,y 태그  (나중에 ... inputOptionState에 바로 저장할 수 있게 고치기)
  const [selectedVarX, setSelectedVarX] = useRecoilState(selectedVarStoreX)
  const [selectedVarY, setSelectedVarY] = useRecoilState(selectedVarStoreY)

  const uploadedData = useRecoilValue(uploadedDataState)
  const [userInputOption, setUserInputOption] = useRecoilState(inputOptionListState)
  const [defaultOption, setDefaultOption] = useState([])

  useEffect(() => {
    setDefaultOption(variableList)
  }, [variableList])

  // useEffect(() => {
  //   console.log('selectedVarX:', selectedVarX)
  //   console.log('selectedVarY:', selectedVarY)
  // }, [selectedVarX, selectedVarY])

  useEffect(() => {
    setUserInputOption({ ...userInputOption, x_value: selectedVarX })
  }, [selectedVarX])

  useEffect(() => {
    setUserInputOption({ ...userInputOption, y_value: selectedVarY[0] })
  }, [selectedVarY])

  const handleSelect = (param: any) => {
    // console.log('select:', param)

    if (param.type === 'x') {
      //multiple selection
      setSelectedVarX((prev) => [...prev, param.value])

      const result = []
      for (let i = 0; i < usedVariable.length; i++) {
        if (param.value.includes(usedVariable[i].value)) {
          result.push({ value: usedVariable[i].value, used: true, category: param.type })
        } else {
          result.push(usedVariable[i])
        }
      }
      setUsedVariable(result)
    } else if (param.type == 'y') {
      //single selection
      setSelectedVarY([param.value])

      const result = []
      for (let i = 0; i < usedVariable.length; i++) {
        //같은 카테고리에 선택된거 있으면 해제
        if (usedVariable[i].category === param.type) {
          result.push({ value: usedVariable[i].value, used: false })
        }
        //선택된 값은 true처리
        else if (usedVariable[i].value === param.value) {
          result.push({ value: usedVariable[i].value, used: true, category: param.type })
        } else {
          //그 외는 그대로 렌더링
          result.push(usedVariable[i])
        }
      }
      setUsedVariable(result)
    } else {
      //   setIndexColumn(param.value)
    }
  }

  const handleDeselect = (param: any) => {
    // console.log('deselect:', param)

    if (param.type === 'x') {
      //multiple selection

      setSelectedVarX(selectedVarX.filter((x) => x !== param.value))

      const result = []
      for (let i = 0; i < usedVariable.length; i++) {
        if (param.value === usedVariable[i].value) {
          result.push({ value: usedVariable[i].value, used: false })
        } else {
          result.push(usedVariable[i])
        }
      }
      setUsedVariable(result)
    }

    //
  }

  return (
    // <Collapse
    //   ghost
    //   size="small"
    //   collapsible="header"
    //   defaultActiveKey={['1']}
    //   items={[
    //     {
    //       key: '1',
    //       label: 'Data',
    //       children: (
    <Row gutter={[0, 16]}>
      <NewTagSelect
        style={{ width: '100%', margin: 'auto' }}
        selectionType="single"
        type="y"
        title="타겟변수(Y)"
        onSelect={handleSelect}
        onDeselect={handleDeselect}
        selectOptions={defaultOption}
      />
      <NewTagSelect
        style={{ width: '100%', margin: 'auto' }}
        selectionType="multiple"
        type="x"
        title="원인변수(X)"
        onSelect={handleSelect}
        onDeselect={handleDeselect}
        selectOptions={defaultOption}
      />
    </Row>
    // ),
    //     },
    //   ]}
    // />
  )
}

export default VariableOption
