import React from 'react'
import axios from 'axios'
import { MdOutlineGridView, MdOutlineSettingsInputComposite, MdSave, MdOutlineRestartAlt } from 'react-icons/md'
import { BiSelectMultiple } from 'react-icons/bi'
import { RiDeleteBinLine } from 'react-icons/ri'
import { Box, useColorModeValue, Stack, Button, Checkbox } from '@chakra-ui/react'
import styled from '@emotion/styled'
import no_image from './img/no-image.jpg'

import reducer from '../../hmid_config/reducer/reducer'
import initialState from '../../hmid_config/reducer/initialState'

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
`

const LayoutListViewParent = styled.div`
  width: 100%;
  height: 80%;
  cursor: pointer;
`

const LayoutListView = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fff;
  background-image: url(${no_image});
  background-position: center center;
  background-size: auto 100%;
  background-repeat: no-repeat;
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
  const [state, dispatch] = React.useReducer(reducer, initialState)

  const [ButtonDisabled, setButtonDisabled] = React.useState<boolean>(true)
  const [OpenLayoutModal, setOpenLayoutModal] = React.useState<boolean>(false)
  const [GridInfo, setGridInfo] = React.useState<string>()
  const [ItemColor, setItemColor] = React.useState('#0044620f')

  const [Component, setComponent] = React.useState<any>()

  //권한
  const [AdminInfo, setAdminInfo] = React.useState('block')

  //company_id
  const [CompanyId, setCompanyId] = React.useState()

  //layout id
  const [LayoutId, setLayoutId] = React.useState<any>()

  const theme = useColorModeValue('navy.700', 'white')

  const testRefs = React.useRef<any>([])

  React.useEffect(() => {
    setCompanyId(props.company_id)
    getLayoutList(props.company_id)
  }, [props.comapny_id])

  //새로운 대시보드 만들기
  const NewDashboard = () => {
    window.location.href = '/admin/layoutconfig'
  }

  const addLineBox = (e: any) => {
    setLayoutId(e.target.id)
    e.target.style.border = '3px solid #00a0e9'
  }

  //render LayoutList UI
  const renderLayoutList = (data: any) => {
    const component: any = []
    const layout_id: any = []
    console.log(data)

    for (let i = 0, len = data.length; i < len; i++) {
      layout_id.push(data[i].lay_id)

      component.push(
        <LayoutListBox key={data[i].lay_id}>
          <LayoutListViewParent
            ref={(el): any => (testRefs.current[i] = el)}
            onClick={(e: any) => {
              addLineBox(e)
            }}
          >
            <LayoutListView id={data[i].lay_id} />
          </LayoutListViewParent>
          <LayoutListTitle>{data[i].lay_nm}</LayoutListTitle>
        </LayoutListBox>
      )
    }

    component.push(
      <AddLayoutListBox key={'add'} id="add" onDoubleClick={NewDashboard}>
        +
      </AddLayoutListBox>
    )

    setComponent(component)

    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
    console.log(layout_id.length)
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>')

    // //layout_id setting
    dispatch({ type: 'LAYOUT_ID', data: layout_id.length })
  }

  const deleteLayout = () => {
    console.log('선택된 레이아웃 아이디 : ' + LayoutId)
    console.log('선택된 회사 아이디 : ' + CompanyId)

    const result = confirm('선택한 레이아웃을 삭제하시겠습니까?')
    if (result) {
      axios
        .delete('http://220.94.157.27:59871/api/hmid/layout?com_id=' + CompanyId + '&lay_id=' + LayoutId, {
          headers: {
            Accept: '*/*',
            'Content-Type': 'application/x-www-form-urlencoded;',
          },
          timeout: 5000,
        })
        .then((response) => {
          console.log('[ delete Layout axios response data ] : ')
          console.log(response.data)
          getLayoutList(CompanyId)
        })
        .catch((error) => {
          console.log(error.response)
        })
    } else {
      for (let i = 0, len = testRefs.current.length; i < len; i++) {
        testRefs.current[i].children[0].style.border = '0px solid rgba(0,0,0,0)'
      }
    }
  }

  //layoutlist api 연결
  const getLayoutList = (company_id: string) => {
    console.log(company_id)
    axios
      .get('http://220.94.157.27:59871/api/hmid/layout?company_id=' + company_id, {
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
          <Button leftIcon={<RiDeleteBinLine />} variant="brand" onClick={deleteLayout}>
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
