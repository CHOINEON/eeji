import React, { Component, useEffect, useState } from 'react'
import { Badge, Button, Input, message, Radio, Space, Table, Tag, Card, Checkbox } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { CustomButton } from 'views/AIModelGenerator/components/DataInfo/DataImportModal'
import PredictionList from 'views/XAI-simulator/components/apiList'
import { useMutation } from 'react-query'
import XaiApi from 'apis/XaiApi'
import styled from '@emotion/styled'

interface DataType {
  key: React.Key
  name: string
  created: string
  target: string
  description: string
  tags: string[]
}

const columns: ColumnsType<DataType> = [
  { title: '모델 생성일', dataIndex: 'created', key: 'created' },
  // Table.EXPAND_COLUMN,
  { title: '모델명', dataIndex: 'name', key: 'name' },
  // Table.SELECTION_COLUMN,
  { title: '타겟변수명', dataIndex: 'target', key: 'target' },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? 'geekblue' : 'green'
          if (tag === 'loser') {
            color = 'volcano'
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          )
        })}
      </>
    ),
  },
  { title: '비고', dataIndex: 'description', key: 'description' },
  {
    title: 'Status',
    key: 'state',
    render: () => <Badge status="success" text="available" />,
  },
  { title: 'API 생성', dataIndex: 'address', key: 'address', render: () => <Button>Publish</Button> },
]
{
  /* <Table
        columns={columns}
        rowSelection={{}}
        // expandable={{
        //   expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.description}</p>,
        // }}
        dataSource={data}
      /> */
}
// const data: DataType[] = [
//   {
//     key: 1,
//     name: 'Model_1',
//     created: '2023-12-31',
//     target: 'retention1',
//     description: 'test model 1',
//     tags: ['nice', 'developer'],
//   },
//   {
//     key: 2,
//     name: 'Model_2',
//     created: '2024-01-01',
//     target: 'retention7',
//     description: 'test model 2',
//     tags: ['loser'],
//   },
//   {
//     key: 3,
//     name: 'Model_2',
//     created: '2024-01-01',
//     target: 'retention7',
//     description: 'test model 2',
//     tags: ['loser'],
//   },
// ]

// const dataSample; DataType[] =[
//   {

//   },
//   {

//   }
// ]

//TODO : 사용자가 생성하고 저장했거나, 직접 업로드한 모델 목록을 표출
//구현할 기능 : 요청 및 응답 명세
//Query string

const ApiService = () => {
  const [data, setData] = useState([])
  const [modelId, setModelId] = useState()
  const user_id = localStorage.getItem('userId').toString()

  const { mutate: mutateGetModelList } = useMutation(XaiApi.getSavedModelList, {
    onSuccess: (result: any) => {
      console.log('mutateGetModelList:', result)
      setData(result.data)
    },
    onError: (error: any, query: any) => {
      //
    },
  })

  useEffect(() => {
    if (user_id) mutateGetModelList({ user_id: user_id })
  }, [])

  const handleSelect = (param: any) => {
    setModelId(param)
  }
  return (
    <div style={{ display: 'grid', height: '800px', overflowY: 'scroll' }}>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Title style={{ marginLeft: '30px', marginBottom: '20px' }}>API Generator</Title>
        {/* <div style={{ textAlign: 'right', margin: '30px 0px', width: 200, display: 'flex', float: 'right' }}> */}
        {/* <CustomButton1 onClick={() => message.info('서비스 준비중입니다')}>
          {<img src={Upload.png} />}
          Model Upload
        </CustomButton1> */}
      </div>

      <Card style={{ boxShadow: '0px 0px 10px #5951DB33' }}>
        <div
          style={{
            display: 'Flex',
            flexDirection: 'row',
            marginLeft: '20px',
            color: '#002D65',
            fontSize: '12px',
            textAlign: 'center',
            marginBottom: '2.5px',
          }}
        >
          <h2 style={{ flex: 0.5 }}>모델 생성일</h2>
          <h2 style={{ flex: 1 }}>모델명</h2>
          <h2 style={{ flex: 2 }}>타겟변수명</h2>
          <h2 style={{ flex: 1 }}>Tags</h2>
          <h2 style={{ flex: 1 }}>모델 유형</h2>
          <h2 style={{ flex: 1 }}>Status</h2>
          <h2 style={{ flex: 1 }}>API생성</h2>
        </div>
        <PredictionList data={data} onSelect={handleSelect}></PredictionList>

        <Card
          bodyStyle={{ paddingRight: '20px', paddingBottom: '10px' }}
          style={{ boxShadow: '0px 0px 10px #5951DB33', height: '400px', marginTop: '40px' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '12px' }}>
              <Title style={{ fontSize: '22px', marginBottom: '10px' }}>파라미터 설정 및 소스코드 예제</Title>
              <CustomButton1>예제 코드 실행 </CustomButton1>
              <CustomButton1>새로고침 </CustomButton1>
            </div>
            <div style={{ display: 'flex' }}>
              <div>
                <Row>
                  <ParamText>URL</ParamText>
                  <Input></Input>
                </Row>
                <SecondRow>
                  <ParamText>Param</ParamText>
                  <div style={{ width: '100%', paddingRight: '10px' }}>
                    <div style={{ display: 'flex' }}>
                      <h2 style={{ fontFamily: 'Helvetica Neue', fontSize: '13px', color: '#002D65' }}>src</h2>
                      <Input style={{ marginBottom: '10px', marginLeft: '10px' }}></Input>
                    </div>
                    <div style={{ display: 'flex' }}>
                      <h2>dst</h2>
                      <Input style={{ marginBottom: '10px ', marginLeft: '10px' }}></Input>
                    </div>
                    <div style={{ display: 'flex' }}>
                      <h2>title</h2>
                      <Input style={{ marginBottom: '10px', marginLeft: '10px' }}></Input>
                    </div>
                    <div style={{ display: 'flex' }}>
                      <h2>title</h2>
                      <Input></Input>
                    </div>
                  </div>
                </SecondRow>
              </div>
              <div>
                <ResultRow>
                  <ParamText>실행결과</ParamText>
                  <Card style={{ height: '200px', marginTop: '10px', marginBottom: '10px' }}></Card>
                </ResultRow>
              </div>
            </div>
          </div>
        </Card>
      </Card>
    </div>
  )
}

export default ApiService

const Row = styled.div`
  display: flex;
  width: 860px;
  padding-right: 10px;
  border: 1px solid #d5dcef;
  border-radius: 10px;
  background: #f6f8ff;
  margin-bottom: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
`
const SecondRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 75%;
  border: 1px solid #d5dcef;
  border-radius: 10px;
  background: #f6f8ff;
  margin-bottom: 10px;
  padding-top: 10px;
`
const ResultRow = styled.div`
  display: flex;
  flex-direction: column;
  width: 860px;
  height: 100%;
  border: 1px solid #d5dcef;
  border-radius: 10px;
  background: #f6f8ff;
  margin-left: 15px;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 10px;
`
const Title = styled.div`
  font-family: 'Helvetica Neue';
  font-weight: bold;
  color: #002d65;
  font-size: 32px;
  display: flex;
  float: left;
`
const ParamText = styled.div`
  font-family: 'Helvetica Neue';
  font-weight: bold;
  color: #002d65;
  font-size: 17px;
  display: flex;
  margin-right: 10px;
  margin-left: 20px;
`

const CustomButton1 = styled.button`
  background: #4338f7;
  top: 102px;
  width: 111px;
  height: 36px;
  color: #ffffff;
  border-radius: 10px;
  font-size: 11px;
  font-face: 'Helvetica Neue';
`
