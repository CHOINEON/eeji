/* eslint-disable @typescript-eslint/no-loss-of-precision */
import styled from '@emotion/styled'
import { Badge } from 'antd'
import ModelApi from 'apis/ModelApi'
import React, { useState, useEffect } from 'react'
import { useMutation } from 'react-query'
import './antdCustom.css'

const PredictionRow = ({ item, active, onClick }: any) => {
  const user_id = localStorage.getItem('userId').toString()
  const { mutate: mutatePublishModelAPI } = useMutation(ModelApi.publishModelAPI, {
    onSuccess: (result: any) => {
      console.log('mutateGetModelList:', result)
      // setData(result.data)
    },
    onError: (error: any, query: any) => {
      //
    },
  })

  const APIMenu = ({ ButtonType }: any) => {
    const PublishAPI = () => {
      console.log('api')

      mutatePublishModelAPI({ user_id: user_id })
    }

    return (
      <div style={{ flex: 1, textAlign: 'center', marginTop: '5px' }}>
        <PublishButton onClick={PublishAPI}>Publish</PublishButton>
      </div>
    )
  }
  const ModelType = ({ Model_Type }: any) => {
    return (
      <StyledModelType>
        <Badge status="success" style={{ marginRight: '5px' }}></Badge>
        {item.descr}
      </StyledModelType>
    )
  }

  const Status = ({ isAvailable }: any) => {
    return (
      <StyledStatus>
        <Badge status="success" style={{ marginRight: '5px' }}></Badge>
        {item.status}
      </StyledStatus>
    )
  }
  const TagType = ({ Tag_List }: any) => {
    const parsedList = JSON.parse(Tag_List)
    return (
      <TagContainer>
        {parsedList?.map((item: any, index: number) => (
          <TagWrapper key={item}>
            <TagBox>{item}</TagBox>
          </TagWrapper>
        ))}
      </TagContainer>
    )
  }
  return (
    <Row
      role="button"
      onClick={onClick}
      className={`hover:bg-[#D5DCEF] ${active === true ? 'bg-[#D5DCEF]' : 'bg-[#F6F8FF] '}`}
    >
      <DateText> {item.create_date}</DateText>
      <ModelTitle>{item.model_name}</ModelTitle>
      <TargetText>{item.target_y}</TargetText>
      <TagType Tag_List={item.columns}></TagType>
      <ModelType></ModelType>
      <Status></Status>
      <APIMenu></APIMenu>
    </Row>
  )
}

const PredictionList = ({ data, onSelect }: any) => {
  const [btnActive, setBtnActive] = useState(0)

  const toggleActive = (idx: number) => {
    setBtnActive(idx)
    onSelect(data[idx].model_id)
  }

  return (
    <>
      {data?.map((item: any, idx: number) => (
        <PredictionListWrapper>
          <PredictionRow key={idx} item={item} active={idx === btnActive} onClick={() => toggleActive(idx)} />
        </PredictionListWrapper>
      ))}
    </>
  )
}
export default PredictionList

const Row = styled.div`
  display: flex;
  width: 100%;
  height: 38px;
  border-radius: 10px;
`

const PredictionListWrapper = styled.div`
  height: 40px;
  align-item: center;
  border-radius: 10px;
  border: 1px solid #d5dcef;
  margin-bottom: 5px;

  &::-webkit-scrollbar {
    display: flex;
    border-radius: 30%;
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #332bbf;
    border-radius: 10%;
    // overflow: auto;
  }
  &::-webkit-scrollbar-track {
    background: #d5dcef;
    border-radius: 10%;
  }
`
const ModelTitle = styled.div`
  width: 20%;
  height: 100%;
  flex: 1;
  float: left;
  font-family: Helvetica Neue;
  font-size: 17px;
  line-height: 38px;
  color: #002d65;
  align-item: center;
`
const TargetText = styled.div`
  width: 13%;
  line-height: 35px;
  float: left;
  font-family: Helvetica Neue;
  font-size: 17px;
  color: #002d65;
`

const DateText = styled.div`
  width: 13%;
  line-height: 35px;
  display: inline-block;
  float: left;
  font-family: Helvetica Neue;
  font-size: 17px;
  color: #002d65;
  text-align: center;
`
const TagContainer = styled.div`
  display: flex;
  width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: break-all;
`
const TagWrapper = styled.div`
  display: block;
  text-align: center;
  // overflow: hidden;
  width: 49px;
  align-items: center;
  margin-top: 10px;
`
const TagBox = styled.div`
  width: 49px;
  height: 16px;
  font-size: 11px;
  // font-color: black;
  margin: auto !important;
  letterspacing: 0.1;
  border: 1px solid #d5dcef;
  border-radius: 5px;
  align-items: center;
  display: inline-block;
`

const PublishButton = styled.button`
  border-radius: 10px;
  height: 28px;
  width: 75px;
  font-family: 'Helvetica Neue Bold';
  background: #4338f7;
  padding: 0px 10px;
  color: #fff;
  margin-left: 105px;
`

const StyledModelType = styled.div`
  flex: 0.6;
  text-align: right;
  margin-top: 7px;
  margin-right: 50px;
  padding-right: 50px;
`

const StyledStatus = styled.div`
  flex: 0.4;
  text-align: right;
  margin-top: 7px;
`
