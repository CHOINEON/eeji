import styled from '@emotion/styled'
import useModal from 'hooks/useModal'
import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { SideBarState } from 'stores/sidebar'
import { CustomButton } from 'views/AIModelGenerator/components/Modal/DataImportModal'
import { MenuList } from 'views/Main/MenuList'
import CustomCollapse, { CollapseItem } from './components/Collapse/CustomCollapse'

export const mockData: Array<CollapseItem> = [
  {
    index: 1,
    id: 'aaaaa',
    label: 'Now Processing',
    children: [
      {
        id: 'model1',
        label: 'Test Model 1',
        created: '2024.01.31 10:00:00', //datetime으로 주셔도 됨
        progress: 88,
        starred: false,
        deleteYN: false,
      },
      // {
      //   id: 'model3',
      //   label: 'Test Model 3',
      //   created: '2024.01.31 10:00:00',
      //   progress: 100,
      //   starred: true,
      //   deleteYN: false,
      // },
    ],
  },
  // {
  //   index: 2,
  //   id: 'bbbb',
  //   label: 'Fixed',
  //   children: [
  //     {
  //       id: 'model2',
  //       label: 'Test Model 2',
  //       created: '2024.01.31 10:00:00',
  //       progress: 100,
  //       starred: true,
  //       deleteYN: false,
  //     },
  //   ],
  // },
  {
    index: 3,
    id: 'cccc',
    label: 'Today',
    children: [
      {
        id: "Today's model",
        label: 'Today Model 1',
        created: '2024.01.31 10:00:00',
        progress: 100,
        starred: false,
        deleteYN: false,
      },
    ],
  },
  {
    index: 4,
    id: 'dddd',
    label: 'Yesterday',
    children: [
      {
        id: "Yesterday's model",
        label: 'Yesterday Model 1',
        created: '2024.01.31 10:00:00',
        progress: 100,
        starred: false,
        deleteYN: false,
      },
    ],
  },
  {
    index: 5,
    id: 'eeee',
    label: 'Previous 30 days',
    children: [
      {
        id: 'Old model',
        label: 'Old Model 1',
        created: '2024.01.31 10:00:00',
        progress: 100,
        starred: false,
        deleteYN: false,
      },
    ],
  },
]

const SidebarHeader = (props: any) => {
  const { value } = props
  const { openModal, closeModal } = useModal()

  const handleClick = () => {
    openModal({
      modalTitle: 'Data Upload',
      modalType: 'DataImport',
      modalProps: {
        onClick: () => {
          closeModal()
        },
      },
    })
  }

  return (
    <HeaderWrapper>
      <div>
        <IconImage src={value.icon_inbox} />
        <div>
          <Title>{value.title}</Title>
          <SubTitle>{value.title_KR} </SubTitle>
        </div>
        <CustomButton
          style={{ width: 134, height: 28, margin: '20px auto', fontSize: 13, fontWeight: 'bold' }}
          onClick={handleClick}
        >
          Data Upload
        </CustomButton>
      </div>
    </HeaderWrapper>
  )
}

const HistorySidebar = () => {
  const item = MenuList[0]
  const [sidebarItem, setSidebarItem] = useRecoilState(SideBarState)

  useEffect(() => {
    setSidebarItem(mockData)
  }, [])

  // useEffect(() => {
  //   console.log('sidebarItem updated:', sidebarItem)
  // }, [sidebarItem])

  return (
    <SidebarContainer>
      <SidebarHeader value={item} />
      <CustomCollapse item={sidebarItem} />
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
  // background-color: #342cc0;
  background: linear-gradient(135deg, #3b31da, #000000, #000000 60%);
`

const HeaderWrapper = styled.div`
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
const IconImage = styled.img<{ src: any }>`
  display: inline-block;
  width: 40px;
  height: 40px;
  margin-right: 10px;
  float: left;
  background-image: url(${(props: any) => props.src});
  background-size: contain;
`
