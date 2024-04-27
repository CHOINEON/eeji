import { EllipsisOutlined } from '@ant-design/icons'
import styled from '@emotion/styled'
import { Dropdown, MenuProps } from 'antd'
import { mockData } from 'components/sidebar/HistorySidebar'
import { ForwardedRef, forwardRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import { SideBarState } from 'stores/sidebar'
import { ItemChild } from './CustomCollapse'

interface CollapseItemProps {
  children: Array<any>
}

const CollapseItem = ({ children }: CollapseItemProps, ref: ForwardedRef<HTMLDivElement>) => {
  // const { items } = props

  const [sidebarItem, setSidebarItem] = useRecoilState(SideBarState)
  const [data, setData] = useState(mockData)
  const [starredItem, setStarredItem] = useState<Array<ItemChild>>([])

  const items: MenuProps['items'] = [
    {
      label: '고정하기',
      key: '1',
    },
    {
      label: '삭제',
      key: '2',
    },
  ]

  // Modify onClick to accept id parameter
  const onClick: any = (key: string, id: any) => {
    if (key === '1') {
      const indexToUpdate = data.findIndex((item: any) => item.label === 'Fixed')
      console.log(indexToUpdate)

      if (indexToUpdate !== -1) {
        const updatedData = [...data]

        //별 붙이고 싶은 대상 모델(한개) 찾기
        const childToStar = sidebarItem
          .map((item: any) => item.children.find((child: any) => child.id === id))
          .filter((element: any) => element !== undefined)

        console.log('child to start:', childToStar[0])
        //원래 fix되었던 값들
        const original = updatedData[indexToUpdate].children

        //Fixed children render only it's not included already
        const newChildren = [...original, childToStar[0]]
        console.log('newChildren:', newChildren)
        updatedData[indexToUpdate] = {
          ...updatedData[indexToUpdate],
          children: newChildren,
        }

        console.log('??:', updatedData)
        // const test = updatedData.map((item: any) => ({
        //   ...item,
        //   children: item.children.filter((child: any) => child.id !== childToStar[0].id),
        // }))

        console.log('---test:', test)

        // setSidebarItem(updatedDataFiltered)
      }
    }
  }

  const Ellipsis = ({ id }: any) => {
    return (
      <EllipsisWrapper>
        <Dropdown menu={{ items, onClick: (e) => onClick(e.key, id) }}>
          <EllipsisOutlined style={{ lineHeight: '69px', color: '#fff', fontSize: 20, float: 'right' }} size={14} />
        </Dropdown>
      </EllipsisWrapper>
    )
  }

  const StatusIcon = (props: any) => {
    return <StatusIconWrapper> {props.value < 100 ? '●' : null}</StatusIconWrapper>
  }

  const Progress = (props: any) => {
    return (
      <ProgressWrapper>
        {props.value}
        <span style={{ fontSize: '12px' }}>%</span>
      </ProgressWrapper>
    )
  }

  return (
    <div ref={ref}>
      {children?.map((item: ItemChild) => {
        return (
          <ItemRow key={item.id}>
            <StatusIcon value={item.progress} />
            <div style={{ width: '75%', float: 'left' }}>
              <div style={{ width: '75%', display: 'inline-block', float: 'left' }}>
                <Title>{item.label}</Title>
                <DatetimeText>{item.created}</DatetimeText>
              </div>

              <Progress value={item.progress} />
            </div>
            <Ellipsis id={item.id} />
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
  width: 100%;
  margin: 5px 0px;
`

const Title = styled.button`
  font-family: 'Helvetica Neue';
  size: 15px;
  font-weight: bold;
  color: #fff;
  float: left;
  display: inline-block;
`

const DatetimeText = styled.p`
  font-family: 'Helvetica Neue';
  font-size: 11px;
  color: #fff;
  float: left;
  display: inline-block;
`

const StatusIconWrapper = styled.div`
  //   border: '1px solid white',
  color: #31d600;
  margin: 0 8px 15px 8px;
  float: left;
  width: 5%;
`

const EllipsisWrapper = styled.div`
  float: left;
  // border: 1px solid white;
  // position: relative;
`

const ProgressWrapper = styled.div`
  // border: 1px solid red;
  display: inline-block;
  float: left;
  color: #31d600;
  font-size: 15px;
  font-weight: bold;
  width: 37px;
`
