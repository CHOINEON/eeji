import { CaretDownFilled, DownOutlined, EllipsisOutlined, MoreOutlined } from '@ant-design/icons'
import styled from '@emotion/styled'
import { Button, Dropdown, MenuProps } from 'antd'
import React, { ForwardedRef, forwardRef } from 'react'

interface CollapseItemProps {
  items: Array<any>
}

const CollapseItem = ({ items }: CollapseItemProps, ref: ForwardedRef<HTMLDivElement>) => {
  // const { items } = props

  // const items: MenuProps['items'] = [
  //   {
  //     label: '고정하기',
  //     key: '1',
  //   },
  //   {
  //     label: '삭제',
  //     key: '2',
  //   },
  // ]
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

  const StatusIcon = (props: any) => {
    return <StatusIconWrapper> {props.value < 100 ? '●' : null}</StatusIconWrapper>
  }

  const Progress = (props: any) => {
    return <ProgressWrapper>{props.value} %</ProgressWrapper>
  }

  return (
    <div ref={ref}>
      {items.map((item: any) => {
        return (
          <ItemRow key={item.id}>
            <StatusIcon value={item.progress} />
            <div style={{ width: '75%', display: 'block', float: 'left' }}>
              <div style={{ width: '70%', display: 'block', float: 'left' }}>
                <Title>{item.label}</Title>
                <DatetimeText>{item.created}</DatetimeText>
              </div>
              <Progress value={item.progress} />
            </div>
            <Ellipsis />
          </ItemRow>
        )
      })}
    </div>
  )
}

export default forwardRef<HTMLDivElement, CollapseItemProps>(CollapseItem)

const ItemRow = styled.div`
  // border: 1px solid red;
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
  display: block;
  float: left;
`

const ProgressWrapper = styled.div`
  // border: '1px solid red',

  display: block;
  float: left;
  color: #31d600;
  font-size: 15;
  font-weight: 'bold';
`
