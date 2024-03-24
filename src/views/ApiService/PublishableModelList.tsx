import React, { useEffect, useState } from 'react'

import { Badge, Button, Card, Row, Tag, message } from 'antd'
import styled from '@emotion/styled'
import { useMutation } from 'react-query'
import ModelApi from 'apis/ModelApi'
// import {
//   CheckCircleOutlined,
//   ClockCircleOutlined,
//   CloseCircleOutlined,
//   ExclamationCircleOutlined,
//   MinusCircleOutlined,
//   SyncOutlined,
// } from '@ant-design/icons'

interface IModelRow {
  item: IModelProps
  active: boolean
  onClick: () => void
}

interface IModelProps {
  create_date: string
  update_date: string
  is_classification: boolean
  model_name: string
  model_id: string
  descr: string
  status: string
  target_y: string
  columns: string //json string
}

const ModelRow = ({ item, active, onClick }: IModelRow) => {
  const [apiInfo, setApiInfo] = useState({ api_key: '' })
  const [toggledItem, setToggledItem] = useState([])

  const { mutate: mutatePublishModelAPI } = useMutation(ModelApi.publishModelAPI, {
    onSuccess: (result: any) => {
      console.log('mutateGetModelList:', result)
      setApiInfo(result)
    },
    onError: (error: any, query: any) => {
      console.log('er:', error)
      // message.warning()
    },
  })

  const onHandlePublish = (model_id: string) => {
    // console.log('model_id:', model_id)
    const payload = {
      com_id: localStorage.getItem('companyId'),
      user_id: localStorage.getItem('userId'),
      model_id: model_id,
    }
    mutatePublishModelAPI(payload)
  }

  return (
    <Row
      role="button"
      onClick={onClick}
      className={`hover:bg-[#D5DCEF] ${active === true ? 'bg-[#D5DCEF]' : 'bg-[#F6F8FF] '}`}
    >
      <RowItem className="w-1/12">{item.create_date}</RowItem>
      {/* <RowItem className="w-1/12">{item.update_date}</RowItem> */}
      <RowItem className="w-2/12">{item.model_name}</RowItem>
      <RowItem className="w-1/12">{item.descr}</RowItem>
      <RowItem className="w-1/12">{item.target_y}</RowItem>
      <RowItem className="w-3/12">
        {JSON.parse(item.columns).map((el: any, idx: number) => {
          if (idx < 5)
            return (
              <Tag key={idx} color="default">
                {el}
              </Tag>
            )
        })}
      </RowItem>
      <RowItem className="w-1/12">
        <Tag className="m-auto" color={`${item.is_classification}` ? '#2db7f5' : '#87d068'}>
          {item.is_classification ? 'Classification' : 'Regression'}
        </Tag>
      </RowItem>
      <RowItem className="w-1/12">
        <Badge className="mr-1" status={item.status === 'available' ? 'success' : 'error'} />
        <RowItem>{item.status}</RowItem>
      </RowItem>
      <RowItem className="w-2/12">
        <PublishButton onClick={() => onHandlePublish(item.model_id)} toggle={apiInfo?.api_key ? true : false}>
          {apiInfo?.api_key ? apiInfo.api_key : 'Publish'}
        </PublishButton>
      </RowItem>
    </Row>
  )
  //
}

const SavedModelList = ({ data, onSelect }: any) => {
  const [btnActive, setBtnActive] = useState(0)

  const toggleActive = (idx: number) => {
    setBtnActive(idx)
    onSelect(data[idx].model_id)
  }

  return (
    <Card>
      <StyledColumn>
        <ColumnLabel className="w-1/12">모델 생성일</ColumnLabel>
        {/* <ColumnLabel className="w-1/12">모델 수정일</ColumnLabel> */}
        <ColumnLabel className="w-2/12">모델명</ColumnLabel>
        <ColumnLabel className="w-1/12">설명</ColumnLabel>
        <ColumnLabel className="w-1/12">타겟변수명</ColumnLabel>
        <ColumnLabel className="w-3/12">입력변수</ColumnLabel>
        <ColumnLabel className="w-1/12">모델유형</ColumnLabel>
        <ColumnLabel className="w-1/12">상태</ColumnLabel>
        <ColumnLabel className="w-2/12">API Key</ColumnLabel>
      </StyledColumn>

      {data?.map((item: any, idx: number) => (
        <PredictionListWrapper key={idx}>
          <ModelRow item={item} active={idx === btnActive} onClick={() => toggleActive(idx)} />
        </PredictionListWrapper>
      ))}
    </Card>
  )
}

export default SavedModelList

const StyledColumn = styled.div`
  display: flex;
  flex-direction: row;
  color: #002d65;
  font-size: 12px;
  text-align: center;
  margin-bottom: 2.5px;
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

const ColumnLabel = styled.h2`
  // border: 1px solid red;
`

const RowItem = styled.span`
  // border: 1px solid blue;
  // flex: 1;
  font-family: 'Helvetica Neue';
  font-size: 14px;
  color: #002d65;
  line-height: 40px;
  text-align: center;
  text-overflow: ellipsis;
`

const PublishButton = styled.button<{ toggle: boolean }>`
  font-size: 13px;
  border-radius: 10px;
  height: 30px;
  // width: 75px;
  padding: 0 5%;
  line-height: 30px;
  font-family: 'Helvetica Neue';
  background-color: ${(props: any) => (props.toggle ? '#fff' : '#4338F7')};
  color: ${(props: any) => (props.toggle ? '#002d65' : '#fff')};
  text-align: center;
`
