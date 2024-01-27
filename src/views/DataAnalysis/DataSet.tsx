import React, { useEffect, useState } from 'react'
import DescriptionBox, { DescriptionBoxProps } from './components/DataInfo/DescriptionBox'
import { Button, Col, Row, message, Spin } from 'antd'
import DataImportModal from './components/DataInfo/DataImportModal'
import './style/data-analysis-style.css'
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil'
import { selectedDataState, userInfoState } from './store/dataset/atom'
import { stepCountStore } from './store/global/atom'
import { usedVariableStore, variableStore } from './store/variable/atom'
import useGetDatasets from 'hooks/queries/useGetDatasets'
import DataEditModal from './components/DataInfo/DataEditModal'
import { analysisResponseAtom } from './store/response/atoms'
import { Empty } from 'antd'

const DataSet = () => {
  const [loading, setLoading] = useState(false)
  const setActiveStep = useSetRecoilState(stepCountStore)
  const setUserInfo = useSetRecoilState(userInfoState)
  const [selectedData, setSelectedData] = useRecoilState(selectedDataState)
  const setVariableList = useSetRecoilState(variableStore) //최초 변수 리스트 렌더링
  const resetAnalysisResponse = useResetRecoilState(analysisResponseAtom)
  const [usedVariable, setUsedVariable] = useRecoilState(usedVariableStore)

  //모든 데이터셋 가져오기
  const { data } = useGetDatasets(localStorage.getItem('userId'))
  const columnNames = ['Target', 'Total Size', 'Created', 'Updated', 'Created by']

  useEffect(() => {
    //데이터셋 페이지 나갔다 오면 초기화
    resetAnalysisResponse()
    // resetSelectedData()  //타이밍이 한발 늦어서 다른데로 옮김
    setUserInfo({ user_id: localStorage.getItem('userId'), com_id: localStorage.getItem('companyId') })
  }, [])

  useEffect(() => {
    if (data) setLoading(false)
    else setLoading(true)
  }, [data])

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
      numeric_cols: data.numeric_cols,
      non_numeric_cols: data.non_numeric_cols,
      isClassification: data.is_classification,
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

  return (
    <>
      <div style={{ width: '100%', display: 'block', float: 'right', margin: '50px 0' }}>
        {data?.data.length > 0 ? (
          <Row className="row-column-title">
            {/* <Col flex="451px"></Col>
            <Col style={{ textAlign: 'center' }} flex="100px">
              Target
            </Col>
            <Col style={{ textAlign: 'center' }} flex="100px">
              Total Size
            </Col>
            <Col style={{ textAlign: 'center' }} flex="200px">
              Created
            </Col>
            <Col style={{ textAlign: 'center' }} flex="200px">
              Updated
            </Col>
            <Col style={{ textAlign: 'center' }} flex="230px">
              Created by
            </Col> */}
          </Row>
        ) : (
          !loading && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ marginTop: '200px' }} />
        )}
        <Spin tip="데이터셋 로드 중..." spinning={loading} style={{ marginTop: '100px' }}>
          <div>
            {data?.data.map((data: any, index: number) => (
              <Col key={index}>
                <DescriptionBox data={data} onSelect={handleSelect} />
              </Col>
            ))}
          </div>
        </Spin>
      </div>

      <DataImportModal />
      <DataEditModal />
    </>
  )
}

export default DataSet
