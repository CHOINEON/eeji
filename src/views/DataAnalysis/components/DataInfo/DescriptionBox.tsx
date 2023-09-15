import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import '../../style/uploader.css'
import { Button, Dropdown, MenuProps, Typography, message } from 'antd'
import { useSetRecoilState } from 'recoil'
import { stepCountStore, dataSetStore } from 'views/DataAnalysis/store/atom'
import axios from 'axios'
import { DeleteOutlined, MoreOutlined } from '@ant-design/icons'
const { Text, Link } = Typography

const DescBoxContainer = styled.div`
  display: block;
  float: left;
  background-color: #fff;
  width: 100%;
  height: 150px;
  border: 1px solid lightgray;
  border-radius: 18px;
  box-shadow: 0px 0px 10px #0000001a;
  &:hover {
    // cursor: pointer;
    color: #0d99ff;
    background-color: #91caff69;
  }
`
const Content = styled.div`
  display: block;
  color: gray;
  font-size: 15px;
`
const TitleWrapper = styled.div`
  display: block;
  margin: 20px;
  &:hover {
    cursor: pointer;
  }
`

export interface DescriptionBoxProps {
  id: string
  name: string
  size: number
  create: string
  update: string
}

export interface IDescriptionBox {
  data: DescriptionBoxProps
  onSelect: any
  onDelete: any
}

const DescriptionBox: React.FC<IDescriptionBox> = (props: any) => {
  const setDataSet = useSetRecoilState(dataSetStore)
  const [messageApi, contextHolder] = message.useMessage()
  const { id, name, size } = props.data
  const { onSelect, onDelete } = props

  const [create, setCreate] = useState('')

  const items: MenuProps['items'] = [
    {
      label: 'Edit',
      key: '1',
    },
    {
      label: 'Delete',
      key: '2',
    },
  ]

  useEffect(() => {
    setCreate(new Date(props.data.create_date).toLocaleDateString())
  }, [])

  const handleClick = (event: any) => {
    if (event.target.tagName !== 'svg' && event.target.tagName !== 'SPAN') {
      //"more" 아이콘 클릭된 경우 예외로 처리
      setDataSet(id)
      onSelect(true)
    }
  }

  const handleDelete = () => {
    // console.log('delete:', id)
    const com_id = localStorage.getItem('companyId')
    const user_id = localStorage.getItem('userId')

    axios
      .delete(
        process.env.REACT_APP_API_SERVER_URL +
          '/api/dataset?com_id=' +
          com_id +
          '&dataset_id=' +
          id +
          '&user_id=' +
          user_id
      )
      .then(
        (response) => {
          // console.log(response)
          if (response.status === 200) {
            messageApi
              .open({
                type: 'success',
                content: '선택된 데이터셋 삭제',
                duration: 2,
                style: {
                  margin: 'auto',
                },
              })
              .then(() => onDelete(true))
          }
        },
        (error) => {
          alert(error)
        }
      )
  }

  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key === '1') {
      messageApi.open({
        type: 'warning',
        content: '구현 예정입니다',
        duration: 2,
        style: {
          margin: 'auto',
        },
      })
    }
    if (key === '2') {
      handleDelete()
    }
  }

  return (
    <>
      <DescBoxContainer onClick={handleClick} role="button">
        <TitleWrapper>
          <Typography.Title level={4} style={{ display: 'inline-block' }}>
            {name}
          </Typography.Title>
          <Dropdown menu={{ items, onClick }}>
            <MoreOutlined style={{ float: 'right' }} size={16} />
          </Dropdown>
          {/* <a onClick={() => handleDelete}>
            <DeleteOutlined style={{ float: 'right', color: 'red' }} />
          </a> */}
        </TitleWrapper>
        <div
          className="container"
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-evenly',
          }}
        >
          <Content>
            <div>Total Size</div>
            <div>{size / 1024 < 1024 ? Math.round(size / 1024) + ' KB' : Math.round(size / 1024 / 1024) + ' MB'}</div>
          </Content>
          <Content>
            {' '}
            <div>Created</div>
            <div>{create}</div>
          </Content>
          <Content>
            {' '}
            <div>Created by</div>
            <div>{'admin'}</div>
          </Content>
        </div>
      </DescBoxContainer>
      {contextHolder}
    </>
  )
}

export default DescriptionBox
