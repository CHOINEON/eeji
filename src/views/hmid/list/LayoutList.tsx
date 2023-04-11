import React from 'react'
import axios from 'axios'
import { MdOutlineGridView, MdOutlineSettingsInputComposite, MdSave, MdOutlineRestartAlt } from 'react-icons/md'
import { BiSelectMultiple } from 'react-icons/bi'
import { RiDeleteBinLine } from 'react-icons/ri'
import { Box, useColorModeValue, Stack, Button, Checkbox } from '@chakra-ui/react'
import styled from '@emotion/styled'
import no_image from './img/no-image.jpg'

interface LayoutListProps {
  company_id: string
  // setLayoutId: (layout_id: string) => void
}

const LayoutListWrap = styled.div`
  width: 100%;
  height: 85vh;
  display: flex;
  overflow-y: scroll;
`

const LayoutListBox = styled.div`
  width: calc(25% - 1vw);
  height: 13vw;
  margin: 0.5vw;
  cursor: pointer;
`

const LayoutListView = styled.div`
  width: 100%;
  height: 80%;
  background-color: #fff;
  background-image: url(${no_image});
  background-position: center center;
  background-size: auto 100%;
  background-repeat: no-repeat;
  border: 1px solid #606060;
`

const LayoutListTitle = styled.div`
  text-align: center;
  padding: 0.3vw 0;
  font-weight: bold;
  height: 20%;
  line-height: 2vw;
  width: 100%;
  font-size: 0.8vw;
  // background-color: rgba(143, 155, 186, 0.2);
`

const AddLayoutListBox = styled(LayoutListBox)`
  background-color: #fff;
  height: 10.5vw;
  text-align: center;
  line-height: 10.5vw;
  font-size: 4vw;
  cursor: pointer;
  color: #00a0e9;
`

export const LayoutList: React.FC<LayoutListProps> = (props: any) => {
  const [ButtonDisabled, setButtonDisabled] = React.useState<boolean>(true)
  const [OpenLayoutModal, setOpenLayoutModal] = React.useState<boolean>(false)
  const [GridInfo, setGridInfo] = React.useState<string>()
  const [ItemColor, setItemColor] = React.useState('#0044620f')

  const [Component, setComponent] = React.useState<any>()

  //권한
  const [AdminInfo, setAdminInfo] = React.useState('block')

  const theme = useColorModeValue('navy.700', 'white')

  React.useEffect(() => {
    console.log(props.company_id)
    getLayoutList(props.company_id)
  }, [props.comapny_id])

  //새로운 대시보드 만들기
  const NewDashboard = () => {
    window.location.href = '/admin/layoutconfig'
  }

  //render LayoutList UI
  const renderLayoutList = (data: any) => {
    const component: any = []

    for (let i = 0, len = data.length; i < len; i++) {
      component.push(
        <LayoutListBox key={data[i].lay_id} id={data[i].lay_id}>
          <LayoutListView />
          <LayoutListTitle>{data[i].lay_nm}</LayoutListTitle>
        </LayoutListBox>
      )
    }

    component.push(
      <AddLayoutListBox key={'add'} id="add" onClick={NewDashboard}>
        +
      </AddLayoutListBox>
    )

    setComponent(component)
  }

  //layoutlist api 연결
  const getLayoutList = (company_id: string) => {
    axios
      .get('http://34.64.197.87:5001/hmid/getLayout?company_id=' + company_id, {
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/x-www-form-urlencoded;',
        },
        timeout: 5000,
      })
      .then((response) => {
        console.log('[ get Layout List axios response data ] : ')
        console.log(response.data)

        renderLayoutList(response.data)
      })
      .catch((error) => {
        console.log(error.response)
      })
  }

  //레이아웃 삭제
  // const deleteLayout = () => {
  //   axios
  //     .delete('http://192.168.1.27:8000/api/hmid/layout?com_id=' + company_id + '&lay_id', {
  //       headers: {
  //         Accept: '*/*',
  //         'Content-Type': 'application/x-www-form-urlencoded;',
  //       },
  //       timeout: 5000,
  //     })
  //     .then((response) => {
  //       console.log('[ get Layout List axios response data ] : ')
  //       console.log(response.data)

  //       renderLayoutList(response.data)
  //     })
  //     .catch((error) => {
  //       console.log(error.response)
  //     })
  // }

  return (
    <>
      <Box style={{ position: 'relative', zIndex: 1000 }}>
        <Stack direction="row" spacing={4} pl={3} display={AdminInfo}>
          <Button leftIcon={<BiSelectMultiple />} variant="brand">
            선택
          </Button>
          <Button leftIcon={<RiDeleteBinLine />} variant="brand">
            삭제
          </Button>
        </Stack>
      </Box>
      <Box mt={10}>
        <LayoutListWrap>{Component}</LayoutListWrap>
      </Box>
    </>
  )
}

export default LayoutList
