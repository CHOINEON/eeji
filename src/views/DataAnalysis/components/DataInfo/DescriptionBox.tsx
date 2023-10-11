import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import '../../style/uploader.css'
import { Dropdown, MenuProps, App, Typography, message } from 'antd'
import axios from 'axios'
import { ExclamationCircleFilled, MoreOutlined } from '@ant-design/icons'
import { useRecoilState } from 'recoil'
import { datasetEditModalState } from 'views/DataAnalysis/store/modal/atom'
import { selectedDataState } from 'views/DataAnalysis/store/base/atom'

export interface DescriptionBoxProps {
  ds_id?: string
  name?: string
  size?: number
  create_date?: string
  update_date?: string
  start_date?: string
  end_date?: string
  date_col?: string
  descr?: string
  loc?: string
}

export interface IDescriptionBox {
  data: DescriptionBoxProps
  // onSelect: any
  // onViewMore: any
}

const DescriptionBox: React.FC<IDescriptionBox> = (props: any) => {
  const com_id = localStorage.getItem('companyId')
  const user_id = localStorage.getItem('userId')

  const [modalState, setModalState] = useRecoilState(datasetEditModalState)
  const { modal } = App.useApp()
  const [selectedData, setSelectedData] = useRecoilState(selectedDataState)

  const { data } = props

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

  const handleClick = (event: any) => {
    if (event.target.tagName !== 'svg' && event.target.tagName !== 'SPAN') {
      //"more" 아이콘 클릭된 경우 예외로 처리
      // onSelect(data)
    } else {
      setSelectedData(data)
    }
  }

  const handleDelete = (ds_id: any) => {
    alert(`${ds_id} deleted`)
  }

  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key === '1') {
      setModalState(true)
    }
    if (key === '2') {
      modal.confirm({
        title: 'Do you want to delete this dataset?',
        icon: <ExclamationCircleFilled />,
        content: `Deletion is permanent and you will not be able to undo it.`,
        onOk() {
          handleDelete(data.ds_id)
        },
        onCancel() {
          console.log('Cancel')
        },
      })
    }
  }

  return (
    <>
      <DescBoxContainer onClick={handleClick} role="button">
        <TitleWrapper>
          <Typography.Title level={4} style={{ display: 'inline-block' }}>
            {data?.name}
          </Typography.Title>
          <Dropdown menu={{ items, onClick }}>
            <MoreOutlined style={{ float: 'right' }} size={16} />
          </Dropdown>
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
            <div>
              {data?.size / 1024 < 1024
                ? Math.round(data?.size / 1024) + ' KB'
                : Math.round(data?.size / 1024 / 1024) + ' MB'}
            </div>
          </Content>
          <Content>
            {' '}
            <div>Created</div>
            <div>{data?.create_date}</div>
          </Content>
          <Content>
            {' '}
            <div>Updated</div>
            <div>{data?.update_date}</div>
          </Content>
          <Content>
            {' '}
            <div>Created by</div>
            <div>{'admin'}</div>
          </Content>
        </div>
      </DescBoxContainer>
    </>
  )
}

export default DescriptionBox

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
