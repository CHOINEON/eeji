import React, { useEffect, useState } from 'react'
import { Button, Input, Tag, Card } from 'antd'
import { useMutation } from 'react-query'
import styled from '@emotion/styled'
import { ReloadOutlined } from '@ant-design/icons'
import SavedModelList from './PublishableModelList'
import XaiApi from 'apis/XaiApi'

const ApiService = () => {
  const [modelId, setModelId] = useState()
  const [data, setData] = useState([])

  const { mutate: mutateGetModelList } = useMutation(XaiApi.getSavedModelList, {
    onSuccess: (result: any) => {
      // console.log('mutateGetModelList:', result)
      setData(result.data)
    },
    onError: (error: any, query: any) => {
      //
    },
  })

  useEffect(() => {
    mutateGetModelList({ user_id: localStorage.getItem('userId') })
  }, [])

  const handleSelect = (param: any) => {
    setModelId(param)
  }

  const handleClick = () => {
    console.log('click')
  }

  return (
    <div style={{ display: 'grid', height: '800px', overflowY: 'scroll' }}>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Title style={{ marginLeft: '30px', marginBottom: '20px' }}>API Generator</Title>
      </div>

      <Card style={{ boxShadow: '0px 0px 10px #5951DB33' }}>
        {/* <PredictionList data={data} onSelect={handleSelect}></PredictionList> */}
        <SavedModelList data={data} onSelect={handleSelect} />

        <Card
          bodyStyle={{ paddingRight: '20px', paddingBottom: '10px' }}
          style={{ boxShadow: '0px 0px 10px #5951DB33', height: '400px', marginTop: '40px' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '12px' }}>
              <Title style={{ fontSize: '22px', marginBottom: '10px' }}>파라미터 설정 및 소스코드 예제</Title>
              <CustomButton1>예제 코드 실행 </CustomButton1>
              <Button
                onClick={handleClick}
                icon={<ReloadOutlined />}
                style={{
                  width: '36px',
                  height: '36px',
                  color: '#4338F7',
                  borderRadius: '10px',
                  background: '#E5EBFF',
                  marginLeft: '10px',
                }}
              ></Button>
            </div>
            <StyledDiv>
              <div>
                <Row>
                  <ParamText>URL</ParamText>
                  <Input></Input>
                </Row>
                <SecondRow>
                  <ParamText>Param</ParamText>
                  <div style={{ width: '100%', paddingRight: '10px' }}>
                    <StyledDiv>
                      <h2 style={{ fontFamily: 'Helvetica Neue', fontSize: '13px', color: '#002D65' }}>src</h2>
                      <Input style={{ marginBottom: '10px', marginLeft: '10px' }}></Input>
                    </StyledDiv>
                    <StyledDiv>
                      <h2>dst</h2>
                      <Input style={{ marginBottom: '10px ', marginLeft: '10px' }}></Input>
                    </StyledDiv>
                    <StyledDiv>
                      <h2>title</h2>
                      <Input style={{ marginBottom: '10px', marginLeft: '10px' }}></Input>
                    </StyledDiv>
                    <StyledDiv>
                      <h2>title</h2>
                      <Input></Input>
                    </StyledDiv>
                  </div>
                </SecondRow>
              </div>
              <div>
                <ResultRow>
                  <ParamText>실행결과</ParamText>
                  <Card style={{ height: '200px', marginTop: '10px', marginBottom: '10px' }}></Card>
                </ResultRow>
              </div>
            </StyledDiv>
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
  margin-right: 390px;
`
const StyledColumn = styled.div`
  display: Flex;
  flex-direction: row;
  margin-left: 20px;
  color: #002d65;
  font-size: 12px;
  text-align: center;
  margin-bottom: 2.5px;
`
const StyledDiv = styled.div`
  display: flex;
`
