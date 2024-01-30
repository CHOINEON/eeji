import styled from '@emotion/styled'
import { Collapse } from 'antd'
import type { CollapseProps } from 'antd'
import React from 'react'
import { CustomButton } from 'views/DataAnalysis/components/DataInfo/DataImportModal'
import { MenuList } from 'views/Main/menuList'
import CustomCollapse from './components/Collapse/CustomCollapse'

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`

const items: CollapseProps['items'] = [
  {
    key: '1',
    label: <p style={{ color: 'white', fontWeight: 'bold' }}>Now Processing</p>,
    children: <p style={{ color: 'white' }}>{text}</p>,
  },
  {
    key: '2',
    label: 'This is panel header 2',
    children: <p>{text}</p>,
  },
  {
    key: '3',
    label: 'This is panel header 3',
    children: <p>{text}</p>,
  },
]

const HistorySidebar = () => {
  const item = MenuList[0]
  return (
    <SidebarContainer>
      <>
        <TitleWrapper>
          <div>
            <IconImage src={item.icon_inbox} />
            <div>
              <Title>{item.title}</Title>
              <SubTitle>{item.title_KR} </SubTitle>
            </div>
            <CustomButton
              visible={true}
              style={{ width: 134, height: 28, margin: '20px auto', fontSize: 13, fontWeight: 'bold' }}
            >
              Data Upload
            </CustomButton>
          </div>
        </TitleWrapper>
        {/* <Collapse defaultActiveKey={['1']} ghost items={items} expandIconPosition="end" />; */}
        <CustomCollapse />
      </>
    </SidebarContainer>
  )
}

export default HistorySidebar

const SidebarContainer = styled.div`
  position: absolute;
  z-index: 99999;
  top: 64px;
  left: 0;
  width: 290px;
  height: 98vh;
  background: linear-gradient(90deg, #3e34e6, #000000);
`

const TitleWrapper = styled.div`
  // border: 1px solid white;
  width: 100%;
  height: 150px;
  padding: 25px;
`

const Title = styled.p`
  font-family: 'ITC Avant Garde Gothic';
  font-weight: bold;
  font-size: 18px;
  color: white;
`

const SubTitle = styled.p`
  font-family: 'Noto Sans';
  font-size: 10px;
  color: white;
`
const IconImage = styled.image<{ src: any }>`
  display: inline-block;
  width: 40px;
  height: 40px;
  margin-right: 10px;
  float: left;
  background-image: url(${(props: any) => props.src});
  background-size: contain;
`
