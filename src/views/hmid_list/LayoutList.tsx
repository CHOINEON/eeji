import React from 'react'
import axios from 'axios'
import { BiSelectMultiple } from 'react-icons/bi'
import { RiDeleteBinLine } from 'react-icons/ri'
import { Box, useColorModeValue, Stack, Button, Checkbox } from '@chakra-ui/react'
import styled from '@emotion/styled'
import no_image from './img/no-image.jpg'
import use_yn_check from './img/use_yn_check.png'
import preview_icon from './img/preview_icon.png'
import layout_add_btn from './img/layout_add_btn.png'
import { Alert } from 'views/hmid/components/Modal/Alert'

interface LayoutListProps {
  company_id: string
}

const LayoutListWrap = styled.div`
  width: 100%;
  height: 74vh;
  display: flex;
  overflow-y: scroll;
  flex-wrap: wrap;
`

const LayoutListBox = styled.div`
  width: calc(33.3% - 2vw);
  height: 14vw;
  margin: 1vw;
  box-shadow: 0px 0px 20px #b2b2b24f;
  border-radius: 18px;
  background-color: #fff;
  padding: 1vw;
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

const TitleParentBox = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.3vw;
`

const IconBox = styled.div`
  margin-right: 1vw;
  border-radius: 100px;
  width: 2vw;
  height: 2vw;
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-position: center center;
  background-image: url(${preview_icon});
`

const LayoutListTitle = styled.div`
  text-align: left;
  padding: 0.3vw 0;
  font-weight: bold;
  height: auto;
  line-height: 1vw;
  width: 100%;
  font-size: 0.9vw;
  color: #1c264a;
`

const SubTitleBox = styled.div`
  font-size: 0.5vw;
  color: gray;
  text-align: left;
`

const AddLayoutListBox = styled(LayoutListBox)`
  height: 10.5vw;
  position: relative;
  box-shadow: none;
  background-color: rgba(0, 0, 0, 0);
`

const UseYnCheckBox = styled.div`
  position: absolute;
  right: 0.5vw;
  top: 0.5vw;
  background-repeat: no-repeat;
  background-size: 80% auto;
  width: 2.5vw;
  height: 2.5vw;
  background-position: center center;
  background-image: url(${use_yn_check});
  background-color: #4338f74a;
  border-radius: 100px;
  z-index: 999;
`

const DashboardImage = styled.img`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: block;
  box-shadow: 0px 0px 20px #00000021;
`

const AddLayoutBoChild = styled.div`
  position: absolute;
  width: 7vw;
  height: 7vw;
  border-radius: 100px;
  background-color: #fff;
  cursor: pointer;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0px 0px 20px #0000001a;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 38% auto;
  background-image: url(${layout_add_btn});
`

export const LayoutList: React.FC<LayoutListProps> = (props: any) => {
  const [Component, setComponent] = React.useState<any>()
  const [AdminInfo, setAdminInfo] = React.useState('block')
  const [CompanyId, setCompanyId] = React.useState()
  const [LayoutId, setLayoutId] = React.useState<any>()
  const [showModal, setShowModal] = React.useState(false)
  const [message, setMessage] = React.useState('')

  // const theme = useColorModeValue('navy.700', 'white')

  const testRefs = React.useRef([])

  React.useEffect(() => {
    setCompanyId(props.company_id)
    getLayoutList(props.company_id)
  }, [props.comapny_id])

  React.useEffect(() => {
    console.log(LayoutId)
  }, [LayoutId])

  //새로운 대시보드 만들기
  const NewDashboard = () => {
    window.localStorage.setItem('SelectedDashboardInfo', 'new')
    window.location.href = '/admin/layout-configuration'
  }

  const addLineBox = (e: any) => {
    if (e.target.offsetParent.children[0].id.length === 0) {
      setLayoutId(e.target.offsetParent.children[1].id)
    } else {
      setLayoutId(e.target.offsetParent.children[0].id)
    }

    // setLayoutId(e.target.offsetParent.children[0].id)

    for (let i = 0, len = testRefs.current.length; i < len; i++) {
      if (testRefs.current[i] !== null) {
        console.log(testRefs.current[i].children[2])
        if (testRefs.current[i].children[2] !== undefined) {
          if (testRefs.current[i].children[1].id !== e.target.offsetParent.children[1].id) {
            testRefs.current[i].children[2].style = 'border:0px solid #fff'
          } else {
            testRefs.current[i].children[2].style = 'border:3px solid #00a0e9'
          }
        } else {
          if (testRefs.current[i].children[0].id !== e.target.offsetParent.children[0].id) {
            testRefs.current[i].children[1].style = 'border:0px solid #fff'
          } else {
            testRefs.current[i].children[1].style = 'border:3px solid #00a0e9'
          }
        }
      }
    }
  }

  /**
   * 2023-04-27 박윤희
   * 대시보드 아이디에 따라 info값 가져오기
   */
  const getClickDashboardInfo = (DashboardId: string) => {
    axios.get(process.env.REACT_APP_API_SERVER_URL + '/api/hmid/layout/info?lay_id=' + DashboardId).then((response) => {
      console.log('[ Select Layout Info Response ] :')
      console.log(response.data)

      //storage 안에 info data
      window.localStorage.setItem('layout_id', DashboardId)
      window.localStorage.setItem('SelectedDashboardInfo', JSON.stringify(response.data))
      window.location.href = '/admin/layout-configuration'
    })
  }

  //개별 대시보드 정보 가져와서 담기
  const getDashboardInfo = (e: any) => {
    if (e.target.offsetParent.children.length === 3) {
      getClickDashboardInfo(e.target.offsetParent.children[1].id)
    } else {
      getClickDashboardInfo(e.target.offsetParent.children[0].id)
    }
  }

  //render LayoutList UI
  const renderLayoutList = (data: any) => {
    const component: any = []
    console.log(data)

    for (let i = 0, len = data.length; i < len; i++) {
      if (data[i].use_yn === 1) {
        component.push(
          <LayoutListBox key={data[i].lay_id}>
            <LayoutListViewParent ref={(el): any => (testRefs.current[i] = el)}>
              <UseYnCheckBox />
              <LayoutListView id={data[i].lay_id} />
              <DashboardImage
                src={'data:image/jpeg;base64,' + data[i].img_path}
                onClick={(e: any) => {
                  addLineBox(e)
                }}
                onDoubleClick={(e: any) => {
                  getDashboardInfo(e)
                }}
              />
            </LayoutListViewParent>
            <TitleParentBox>
              <IconBox />
              <div>
                <SubTitleBox>Main Dashboard</SubTitleBox>
                <LayoutListTitle>{data[i].lay_nm}</LayoutListTitle>
              </div>
            </TitleParentBox>
          </LayoutListBox>
        )
      } else {
        component.push(
          <LayoutListBox key={data[i].lay_id}>
            <LayoutListViewParent ref={(el): any => (testRefs.current[i] = el)}>
              <LayoutListView id={data[i].lay_id} />
              <DashboardImage
                src={'data:image/jpeg;base64,' + data[i].img_path}
                onClick={(e: any) => {
                  addLineBox(e)
                }}
                onDoubleClick={(e: any) => {
                  getDashboardInfo(e)
                }}
              />
            </LayoutListViewParent>
            <TitleParentBox>
              <IconBox />
              <div>
                <SubTitleBox>Main Dashboard</SubTitleBox>
                <LayoutListTitle>{data[i].lay_nm}</LayoutListTitle>
              </div>
            </TitleParentBox>
          </LayoutListBox>
        )
      }
    }

    component.push(
      <AddLayoutListBox key={'add'} id="add" onDoubleClick={NewDashboard}>
        <AddLayoutBoChild />
      </AddLayoutListBox>
    )

    setComponent(component)
  }

  //layoutlist api 연결
  const getLayoutList = (company_id: string) => {
    console.log(company_id)
    axios
      .get(process.env.REACT_APP_API_SERVER_URL + '/api/hmid/layout?company_id=' + company_id, {
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/x-www-form-urlencoded;',
        },
        timeout: 500000,
      })
      .then((response) => {
        console.log('[ get Layout List axios response data ] : ')
        console.log(response.data)

        renderLayoutList(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  //set Default Dashboard Layout
  const SetDefaultDashboard = () => {
    axios
      .put(
        process.env.REACT_APP_API_SERVER_URL + '/api/hmid/layout/default?com_id=' + CompanyId + '&lay_id=' + LayoutId,
        {
          headers: {
            Accept: '*/*',
            'Content-Type': 'application/x-www-form-urlencoded;',
          },
          timeout: 5000,
        }
      )
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
      .delete(process.env.REACT_APP_API_SERVER_URL + '/api/hmid/layout?com_id=' + CompanyId + '&lay_id=' + LayoutId, {
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/x-www-form-urlencoded;',
        },
        timeout: 5000,
      })
      .then((response) => {
        console.log('[ get Layout List axios response data ] : ')
        console.log(response.data)

        if (response.data.detail === 'success') {
          setShowModal(true)
          setMessage('레이아웃 삭제가 완료 되었습니다.')

          getLayoutList(localStorage.getItem('companyId'))
        }
      })
      .catch((error) => {
        console.log(error.response)
      })
  }

  const getCloseModal = (e: boolean) => {
    console.log(e)
    setShowModal(false)
  }

  return (
    <>
      <Box style={{ position: 'relative', zIndex: 1000 }}>
        <Stack direction="row" spacing={4} pl={3} display={AdminInfo}>
          <Button
            id="design_button"
            leftIcon={<BiSelectMultiple />}
            onClick={SetDefaultDashboard}
            style={{ backgroundColor: '#4338F7', color: '#fff', borderRadius: '100px' }}
          >
            선택
          </Button>
          <Button
            id="design_button"
            leftIcon={<RiDeleteBinLine />}
            onClick={deleteLayout}
            style={{ backgroundColor: '#4338F7', color: '#fff', borderRadius: '100px' }}
          >
            삭제
          </Button>
        </Stack>
      </Box>
      <Box mt={10}>
        <LayoutListWrap>{Component}</LayoutListWrap>
      </Box>

      <Alert ShowModal={showModal} message={message} getCloseModal={getCloseModal} />
    </>
  )
}

export default LayoutList
