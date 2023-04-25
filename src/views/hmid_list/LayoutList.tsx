import React from 'react'
import axios from 'axios'
import { MdOutlineGridView, MdOutlineSettingsInputComposite, MdSave, MdOutlineRestartAlt } from 'react-icons/md'
import { BiSelectMultiple } from 'react-icons/bi'
import { RiDeleteBinLine } from 'react-icons/ri'
import { Box, useColorModeValue, Stack, Button, Checkbox } from '@chakra-ui/react'
import styled from '@emotion/styled'
import no_image from './img/no-image.jpg'
import use_yn_check from './img/use_yn_check.png'

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
  position: relative;
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

const UseYnCheckBox = styled.div`
  position: absolute;
  right: 0.5vw;
  top: 0.5vw;
  background-repeat: no-repeat;
  background-size: 100% auto;
  width: 2vw;
  height: 2vw;
  background-position: center center;
  background-image: url(${use_yn_check});
`

export const LayoutList: React.FC<LayoutListProps> = (props: any) => {
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

  const testRefs = React.useRef([])

  React.useEffect(() => {
    setCompanyId(props.company_id)
    getLayoutList(props.company_id)
  }, [props.comapny_id])

  //새로운 대시보드 만들기
  const NewDashboard = () => {
    window.location.href = '/admin/layout-configuration'
  }

  const addLineBox = (e: any) => {
    setLayoutId(e.target.id)

    for (let i = 0, len = testRefs.current.length; i < len; i++) {
      console.log(testRefs.current[i])
      console.log(testRefs.current[i].children)
      if (testRefs.current[i].children.length === 2) {
        if (testRefs.current[i].children[1].id !== e.target.id) {
          testRefs.current[i].style = 'border:0px solid #fff'
        } else {
          testRefs.current[i].style = 'border:3px solid #00a0e9'
        }
      } else {
        if (testRefs.current[i].children[0].id !== e.target.id) {
          testRefs.current[i].style = 'border:0px solid #fff'
        } else {
          testRefs.current[i].style = 'border:3px solid #00a0e9'
        }
      }
    }
  }

  //개별 대시보드 정보 가져와서 담기
  const getDashboardInfo = (e: any) => {
    console.log(' 대시보드 Information ')
    console.log(e)
    console.log(e.target.id)

    axios.get('http://220.94.157.27:59871/api/hmid/layout/info?lay_id=' + e.target.id).then((response) => {
      console.log('[ Select Layout Info Response ] :')
      console.log(response.data)

      //storage 안에 info data
      window.localStorage.setItem('SelectedDashboardInfo', JSON.stringify(response.data))

      window.location.href = '/admin/layout-configuration'
    })
  }

  //render LayoutList UI
  const renderLayoutList = (data: any) => {
    const component: any = []
    console.log(data)

    for (let i = 0, len = data.length; i < len; i++) {
      if (data[i].use_yn === 1) {
        component.push(
          <LayoutListBox key={data[i].lay_id}>
            <LayoutListViewParent
              ref={(el): any => (testRefs.current[i] = el)}
              onClick={(e: any) => {
                addLineBox(e)
              }}
              onDoubleClick={(e: any) => {
                getDashboardInfo(e)
              }}
            >
              <UseYnCheckBox />
              <LayoutListView id={data[i].lay_id} />
            </LayoutListViewParent>
            <LayoutListTitle>{data[i].lay_nm}</LayoutListTitle>
          </LayoutListBox>
        )
      } else {
        component.push(
          <LayoutListBox key={data[i].lay_id}>
            <LayoutListViewParent
              ref={(el): any => (testRefs.current[i] = el)}
              onClick={(e: any) => {
                addLineBox(e)
              }}
              onDoubleClick={(e: any) => {
                getDashboardInfo(e)
              }}
            >
              <LayoutListView id={data[i].lay_id} />
            </LayoutListViewParent>
            <LayoutListTitle>{data[i].lay_nm}</LayoutListTitle>
          </LayoutListBox>
        )
      }
    }

    component.push(
      <AddLayoutListBox key={'add'} id="add" onDoubleClick={NewDashboard}>
        +
      </AddLayoutListBox>
    )

    setComponent(component)
  }

  // const deleteLayout = () => {
  //   console.log('선택된 레이아웃 아이디 : ' + LayoutId)
  //   console.log('선택된 회사 아이디 : ' + CompanyId)

  //   const result = confirm('선택한 레이아웃을 삭제하시겠습니까?')
  //   if (result) {
  //     axios
  //       .delete('http://220.94.157.27:59871/api/hmid/layout?com_id=' + CompanyId + '&lay_id=' + LayoutId, {
  //         headers: {
  //           Accept: '*/*',
  //           'Content-Type': 'application/x-www-form-urlencoded;',
  //         },
  //         timeout: 5000,
  //       })
  //       .then((response) => {
  //         console.log('[ delete Layout axios response data ] : ')
  //         console.log(response.data)
  //         getLayoutList(CompanyId)
  //       })
  //       .catch((error) => {
  //         console.log(error.response)
  //       })
  //   } else {
  //     for (let i = 0, len = testRefs.current.length; i < len; i++) {
  //       testRefs.current[i].children[0].style.border = '0px solid rgba(0,0,0,0)'
  //     }
  //   }
  // }

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

        window.localStorage.setItem('layout_id', response.data[response.data.length - 1].lay_id)
      })
      .catch((error) => {
        console.log(error.response)
      })
  }

  //set Default Dashboard Layout
  const SetDefaultDashboard = () => {
    axios
      .put('http://220.94.157.27:59871/api/hmid/layout/default?com_id=' + CompanyId + '&lay_id=' + LayoutId, {
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/x-www-form-urlencoded;',
        },
        timeout: 5000,
      })
      .then((response) => {
        console.log('[ set Default Layout axios response data ] : ')
        console.log(response.data)

        renderLayoutList(response.data)
        getLayoutList(CompanyId)
      })
      .catch((error) => {
        console.log(error.response)
      })
  }
  //레이아웃 삭제
  const deleteLayout = () => {
    axios
      .delete('http://220.94.157.27:59871/api/hmid/layout?com_id=' + CompanyId + '&lay_id=' + LayoutId, {
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

  return (
    <>
      <Box style={{ position: 'relative', zIndex: 1000 }}>
        <Stack direction="row" spacing={4} pl={3} display={AdminInfo}>
          <Button leftIcon={<BiSelectMultiple />} variant="brand" onClick={SetDefaultDashboard}>
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
