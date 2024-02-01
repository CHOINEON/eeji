import styled from '@emotion/styled'
import React, { useState, useCallback, useRef, useEffect } from 'react'
import CollapseItem from './CollapseItem'
import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { Button } from 'antd'

export interface CollapseItem {
  index: number
  id: string
  label: string
  children: Array<unknown>
}

interface CollapsProps {
  item: Array<CollapseItem>
}

const CustomCollapse = ({ item }: CollapsProps) => {
  //Manage Individual Collapse States
  const initialCollapseState = item.reduce((acc: any, currentItem) => {
    acc[currentItem.id] = false
    return acc
  }, {})

  const [collapseStates, setCollapseStates] = useState(initialCollapseState)

  const parentRefs = useRef<Array<HTMLDivElement>>([])
  const childRefs = useRef<Array<HTMLDivElement>>([])

  //버튼 클릭 -> DOM에 접근해 contents 영역 계산한 다음 컨텐츠 높이만큼 세팅
  const handleButtonClick = useCallback(
    (index: number, id: string) => (event: any) => {
      event.stopPropagation()

      const parent = parentRefs.current[index]
      const child = childRefs.current[index]

      if (!parent || !child) return

      if (parent.clientHeight > 8) {
        parent.style.height = '0'
      } else {
        parent.style.height = `${child.clientHeight}px`
      }

      // Update the specific item's collapse state
      setCollapseStates((prevStates: any) => ({
        ...prevStates,
        [id]: !prevStates[id],
      }))
    },
    [item]
  )

  return (
    <>
      {item.map((item: any, index: number) => {
        const buttonIcon = collapseStates[item.id] ? <UpOutlined /> : <DownOutlined />
        return (
          <CollapseContainer key={item.id}>
            <Header>
              <div style={{ width: '90%', display: 'inline-block' }}>{item.label}</div>
              <Button onClick={handleButtonClick(index, item.id)} icon={buttonIcon} type="text" />
            </Header>
            <SingleLine />
            <ContentsWrapper ref={(el) => (parentRefs.current[index] = el)}>
              <CollapseItem ref={(el) => (childRefs.current[index] = el)} items={item.children} />
            </ContentsWrapper>
          </CollapseContainer>
        )
      })}
    </>
  )
}

export default CustomCollapse

const CollapseContainer = styled.div`
  // border: 1px solid red;
  display: flex;
  position: relative;
  flex-direction: column;
  margin: 5px 0;
`

const ContentsWrapper = styled.div`
  height: 0; //기본이 숨김 상태
  width: 100%;
  overflow: hidden;
  transition: height 0.35s ease;
  padding: 4px 8px;
`

const Header = styled.div`
  display: flex;
  align-item: center;
  font-family: 'Helvetica Neue';
  font-weight: bold;
  color: white;
  font-size: 14px;
  margin: 0px 30px;
`
const SingleLine = styled.hr`
  color: #ffffff;
  width: 88%;
  margin: 0 5px 5px 20px;
  opacity: 0.25;
`
