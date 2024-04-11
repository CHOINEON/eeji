import React, { useEffect, useState } from 'react'
import { Badge, Button as AntButton, Card, Row, Tag, App } from 'antd'
import styled from '@emotion/styled'
import { useMutation } from 'react-query'
import ModelApi from 'apis/ModelApi'
import { useRecoilState } from 'recoil'
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { publishResultState } from '../store/atom'

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

interface IModelRow {
  id: number
  item: IModelProps
  active: boolean //row선택 기능 지금 사용 안함
  onClick: () => void
}

const ModelRow = ({ id, item, active, onClick }: IModelRow) => {
  const { message } = App.useApp()
  const [result, setResult] = useState({ api_key: '', request: {}, response: {} })
  const MAX_VAR_COUNT = 5
  const [apiInfo, setApiInfo] = useRecoilState(publishResultState)
  const [maxCount, setMaxCount] = useState(MAX_VAR_COUNT)
  const [loadMore, setLoadMore] = useState(false)

  const { mutate: mutatePublishModelAPI } = useMutation(ModelApi.publishModelAPI, {
    onSuccess: (result: any) => {
      // console.log('mutateGetModelList:', result)
      setResult(result)
      setApiInfo(result)
      handleCopyClipBoard(result.api_key)
    },
    onError: (error: any, query: any) => {
      console.log('er:', error)
      // message.warning()
    },
  })

  const handleCopyClipBoard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      message.success('선택한 값이 복사되었습니다.')
    } catch (e) {
      alert('복사에 실패하였습니다')
    }
  }

  const onHandlePublish = (model_id: string) => {
    // console.log('model_id:', model_id)
    const payload = {
      com_id: localStorage.getItem('companyId'),
      user_id: localStorage.getItem('userId'),
      model_id: model_id,
    }
    mutatePublishModelAPI(payload)
  }

  //row hover style
  //      // hover:bg-[#D5DCEF]
  // ${active === true ? 'bg-[#D5DCEF]' : 'bg-[#F6F8FF] '}
  const onHandleClick = () => {
    setLoadMore((prev: boolean) => !prev)
  }

  useEffect(() => {
    // console.log('loadmore:', loadMore)
    if (loadMore) {
      setMaxCount(999)
    } else {
      setMaxCount(MAX_VAR_COUNT)
    }
  }, [loadMore])

  function RenderInputValueCell(max?: number) {
    // const inputArr = JSON.parse(jsonString)
    const inputArr = JSON.parse(item.columns)

    const renderedTags = inputArr.slice(0, max).map((el: any, idx: number) => (
      <Tag key={idx} color="default">
        {el}
      </Tag>
    ))

    return (
      <>
        {renderedTags}
        <button className="inline-block">
          <Badge
            count={
              loadMore ? (
                <MinusCircleOutlined style={{ color: 'black' }} onClick={onHandleClick} />
              ) : (
                <PlusCircleOutlined style={{ color: 'black' }} onClick={onHandleClick} />
              )
            }
          />
        </button>
      </>
    )
  }

  return (
    <Row
      // role="button"
      onClick={onClick}
      className={`w-100 min-h-[43px] px-1 flex-wrap overflow-visible rounded-lg border-[#D5DCEF] bg-[#F6F8FF]`}
    >
      <RowItem className="w-1/12">{item.create_date}</RowItem>
      {/* <RowItem className="w-1/12">{item.update_date}</RowItem> */}
      <RowItem className="w-2/12">{item.model_name}</RowItem>
      <RowItem className="w-1/12">{item.descr}</RowItem>
      <RowItem className="w-1/12">{item.target_y}</RowItem>
      <RowItem className="w-3/12">{RenderInputValueCell(maxCount)}</RowItem>
      <RowItem className="w-1/12">
        <Tag className="m-auto" color={item.is_classification ? '#2db7f5' : '#87d068'}>
          {item.is_classification ? 'Classification' : 'Regression'}
        </Tag>
      </RowItem>
      <RowItem className="w-1/12">
        <Badge className="mr-1" status={item.status === 'available' ? 'success' : 'error'} />
        <RowItem>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</RowItem>
      </RowItem>
      <RowItem className="w-2/12">
        <PublishButton
          // loading={true}
          data-name={id}
          onClick={() => onHandlePublish(item.model_id)}
          toggle={result?.api_key ? true : false}
        >
          {result?.api_key ? item.model_id : 'Publish'}
        </PublishButton>
      </RowItem>
    </Row>
  )
  //
}

const RowItem = styled.span`
  // border: 1px solid blue;
  font-family: 'Helvetica Neue';
  font-size: 14px;
  color: #002d65;
  line-height: 40px;
  text-align: center;
  flex: flex-wrap;
  text-overflow: ellipsis;
  overflow-wrap: anywhere;
`

const PublishButton = styled.button<{ toggle: boolean }>`
  font-size: 13px;
  border-radius: 10px;
  height: 30px;
  width: ${(props: any) => (props.toggle ? '100%' : '75px')};

  padding: 0 5%;
  line-height: 30px;
  font-family: 'Helvetica Neue';
  background-color: ${(props: any) => (props.toggle ? '#fff' : '#4338F7')};
  color: ${(props: any) => (props.toggle ? '#002d65' : '#fff')};
  text-align: center;
  &:hover {
    background-color: #827fff;
    color: #fff;
  }
`

export default ModelRow
