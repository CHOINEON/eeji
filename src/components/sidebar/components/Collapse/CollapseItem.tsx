import { CaretDownFilled, DownOutlined, EllipsisOutlined, MoreOutlined } from '@ant-design/icons'
import styled from '@emotion/styled'
import { Button, Dropdown, MenuProps } from 'antd'
import React from 'react'

const CollapseItem = () => {
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

  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key === '1') {
      //   setModalState(true)
    }
    if (key === '2') {
      //   modal.confirm({
      //     title: 'Do you want to delete this dataset?',
      //     icon: <ExclamationCircleFilled />,
      //     content: `Deletion is permanent and you will not be able to undo it.`,
      //     onOk() {
      //       handleDelete(data.ds_id)
      //     },
      //     onCancel() {
      //       console.log('Cancel')
      //     },
      //   })
    }
  }

  const Ellipsis = () => {
    return (
      <EllipsisWrapper>
        <Dropdown menu={{ items, onClick }}>
          <EllipsisOutlined style={{ lineHeight: '69px', color: '#fff', fontSize: 20 }} size={16} />
        </Dropdown>
      </EllipsisWrapper>
    )
  }

  const StatusIcon = () => {
    return <StatusIconWrapper>●</StatusIconWrapper>
  }

  const Progress = () => {
    return <ProgressWrapper>88%</ProgressWrapper>
  }

  return (
    <>
      {Array(2)
        .fill(null)
        .map(() => {
          return (
            <ItemRow>
              <StatusIcon />
              <div style={{ width: '75%', display: 'block', float: 'left' }}>
                <div style={{ width: '70%', display: 'block', float: 'left' }}>
                  <Title>회귀예측모델 케이스</Title>
                  <DatetimeText>2024.00.00 10:00:00</DatetimeText>
                </div>
                <Progress />
              </div>
              <Ellipsis />
            </ItemRow>
          )
        })}
    </>
  )
}

export default CollapseItem

const ItemRow = styled.div`
  // border: '1px solid red'
  display: inline-block;
  width: '100%';
  margin: 5px 0px;
`

const Title = styled.div`
  font-family: 'Helvetica Neue';
  font-weight: bold;
  size: 15px;
  color: #fff;
  float: left;
  display: inline-block;
`

const DatetimeText = styled.div`
  font-family: 'Helvetica Neue';
  size: 10px;
  color: #fff;
  float: left;
  display: inline-block;
`

const StatusIconWrapper = styled.div`
  //   border: '1px solid white',
  color: #31d600;
  margin: 0 8px 15px 15px;
  float: left;
  width: 5%;
`

const EllipsisWrapper = styled.div`
  //   border: '1px solid white';
  display: 'block';
  float: 'left';
`

const ProgressWrapper = styled.div`
  // border: '1px solid red',

  display: block;
  float: left;
  color: #31d600;
  font-size: 15;
  font-weight: 'bold';
`
