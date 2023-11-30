import React, { useEffect, useState } from 'react'
import DescriptionBox, { DescriptionBoxProps } from './components/DataInfo/DescriptionBox'
import { Button, Col, Row, message } from 'antd'
import DataImportModal from './components/DataInfo/DataImportModal'
import './style/styles.css'
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil'
import { importModalAtom } from './store/modal/atom'
import styled from '@emotion/styled'
import { selectedDataState, userInfoState } from './store/dataset/atom'
import { stepCountStore } from './store/global/atom'
import { usedVariableStore, variableStore } from './store/variable/atom'
import useGetDatasets from 'hooks/queries/useGetDatasets'
import DataEditModal from './components/DataInfo/DataEditModal'
import { analysisResponseAtom } from './store/response/atoms'

const DataSet = () => {
  //상태 저장
  const setActiveStep = useSetRecoilState(stepCountStore)
  const setUserInfo = useSetRecoilState(userInfoState)
  const setSelectedData = useSetRecoilState(selectedDataState)
  const setVariableList = useSetRecoilState(variableStore) //최초 변수 리스트 렌더링
  const resetAnalysisResponse = useResetRecoilState(analysisResponseAtom)
  const [usedVariable, setUsedVariable] = useRecoilState(usedVariableStore)
  const [importOpen, setImportOpen] = useRecoilState(importModalAtom)

  //모든 데이터셋 가져오기
  const { data } = useGetDatasets(localStorage.getItem('userId'))

  useEffect(() => {
    //데이터셋 페이지 나갔다 오면 초기화
    // resetAnalysisResponse()
    setUserInfo({ user_id: localStorage.getItem('userId'), com_id: localStorage.getItem('companyId') })
  }, [])

  const handleClick = () => {
    setImportOpen(true)
  }

  const handleSelect = (data: any) => {
    console.log('Dataset selected ::', data)

    setUsedVariable([])
    setSelectedData({
      ds_id: data.ds_id,
      name: data.name,
      size: data.size,
      rowCount: 0,
      colCount: 0,
      startDate: data.start_date,
      endDate: data.end_date,
      dateCol: data.date_col,
      targetY: data.target_y,
    })
    //태그리스트 드롭다운 바인딩
    setFeatureList(data.name, JSON.parse(data.col_list))
  }

  const setFeatureList = (name: string, columns: Array<any>) => {
    if (columns) {
      //X, Y 변수 드롭다운 리스트(default로 사용) 포맷팅
      const formattedData: any = []
      columns.forEach((column: any) => {
        formattedData.push({ value: column, label: column })
      })
      // const temp = [{ label: name, options: formattedData }]
      setVariableList(formattedData)
      // console.log(formattedData)

      //feature 사용관리 하기 위한 store 데이터 포맷팅
      const result: Array<any> = []
      columns.forEach((value: any) => {
        result.push({ value: value, used: false })
      })

      setUsedVariable(result)
      setActiveStep(1)
    }
  }

  const handleEdit = (ds_id: string) => {
    //
    console.log('handleEdig:', ds_id)
  }

  return (
    <>
      <div style={{ width: '100%', display: 'block', float: 'right', margin: '20px 0' }}>
        <DatasetAddButton className="ant-btn ant-btn-primary" onClick={handleClick}>
          + NEW DATASET
        </DatasetAddButton>
        <Row gutter={[16, 16]}>
          {data?.data.map((data: any, index: number) => (
            <Col span={12} key={index}>
              <DescriptionBox data={data} onSelect={handleSelect} />
            </Col>
          ))}
        </Row>
      </div>
      <DataImportModal />
      <DataEditModal />
    </>
  )
}

export default DataSet

const DatasetAddButton = styled.button`
  width: 100%;
  height: 50px;
  margin: 20px 0;
  border-radius: 10px;
  font-size: 17px;
  color: #fff;
  background-color: #4338f7;
  box-shadow: 0 2px 0 rgba(55, 5, 255, 0.06);
`
