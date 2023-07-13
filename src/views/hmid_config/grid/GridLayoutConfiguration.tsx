/**
 * INFINITE OPTIMAL
 * 메뉴 : HMI Designer - GridLayout
 * 시작 날짜 : 2023-03-10
 * 최종 수정 날짜 : 2023-06-13
 * 개발자 : 박윤희 (BAK YUN HEE)
 */

import * as ReactDOM from 'react-dom'
import * as React from 'react'
import axios from 'axios'
import styled from '@emotion/styled'
import '../style/style.css'
import 'ag-grid-community/styles/ag-grid.css'
import { Spin } from 'antd'
import '../../hmid/components/Modal/style/style.css'

import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { panelData } from '../data/panel-data_config'
import * as d3 from 'd3'

import WidgetModal from '../../hmid/components/Modal/WidgetModal'
import SaveConfirmModal from '../../hmid/components/Modal/SaveConfirm'
import LayoutModal from '../../hmid/components/Modal/LayoutListModal'
import DataConnection from '../../hmid/components/Modal/DataConnection'
import { Alert } from '../../hmid/components/Modal/Alert'

import domtoimage from 'dom-to-image'

import * as ReactIcon from 'react-icons/md'
import * as Chakra from '@chakra-ui/react'
import * as ej2 from '@syncfusion/ej2-react-layouts'

import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import * as RecoilAtoms from '../recoil/config/atoms'
import { LayoutTitle, NowDate } from '../recoil/base/atoms'

import D3ChartDefaultGrid from './TestComponent/drawD3ChartDefaultGrid'
import D3LineChart from '../../hmid/components/d3/D3LineChart'
import D3ScatterPlotChart from '../../hmid/components/d3/D3ScatterPlotChart'

const DataGridWrap = styled.div`
  width: 100%;
  height: calc(100% - 1.1vw);
`

const CurrentText = styled.div`
  float: right;
  font-size: 1vw;
  font-weight: 500;
  padding-right: 1vw;
`

const CurrentIcon = styled.div`
  float: right;
  font-size: 1.3vw;
  font-weight: 500;
  color: rgb(67, 56, 247);
`

export const PredefinedLayoutsConfiguration: React.FC = () => {
  const [gridInformation, setGridInformation] = useRecoilState(RecoilAtoms.GridInformationState)
  const [showLoading, setShowLoading] = useRecoilState(RecoilAtoms.ShowLoadingState)
  const [widgetInfo, setWidgetInfo] = useRecoilState(RecoilAtoms.WidgetInfoState)
  const [boxTargetId, setBoxTargetId] = useRecoilState(RecoilAtoms.BoxTargetIdState)
  const [panelIdx, setPanelIdx] = useRecoilState(RecoilAtoms.PanelIdxState)
  const [NowDateText, setNowDateText] = useRecoilState(NowDate)
  const [saveLayoutInfo, setSaveLayoutInfo] = useRecoilState(RecoilAtoms.SaveLayoutInformationState)

  const setOpenGridModal = useSetRecoilState(RecoilAtoms.ShowGridModalState)
  const setOpenSaveLayoutModal = useSetRecoilState(RecoilAtoms.OpenSaveLayoutModalState)
  const setshowWidgetModalState = useSetRecoilState(RecoilAtoms.ShowWidgetModalState)
  const setDataConnectionModal = useSetRecoilState(RecoilAtoms.ShowConnectionDataState)
  const setAlertMessage = useSetRecoilState(RecoilAtoms.AlertMessageState)
  const setShowAlertModal = useSetRecoilState(RecoilAtoms.AlertModalState)

  //모달에서 선택한 Tag Array
  const SelectTagInfo = useRecoilValue(RecoilAtoms.SelectTagInfoState)
  const layoutTitle = useRecoilValue(LayoutTitle)

  const panels: any = panelData
  let dashboardObj: ej2.DashboardLayoutComponent
  const cellSpacing: number[] = [5, 5]

  //test
  const [Form, setForm] = React.useState<any>()

  //현재시간 계산하기
  //대신에 luxon 사용
  const getNowDateTime = () => {
    const now = new Date()
    const year = now.getFullYear()
    let month: any = now.getMonth() + 1
    if (month.toString().length === 1) month = '0' + month
    let date: any = now.getDate()
    if (date.toString().length === 1) date = '0' + date
    let hour: any = now.getHours()
    if (hour.toString().length === 1) hour = '0' + hour
    let minutes: any = now.getMinutes()
    if (minutes.toString().length === 1) minutes = '0' + minutes
    let seconds: any = now.getSeconds()
    if (seconds.toString().length === 1) seconds = '0' + seconds

    setNowDateText(year + '-' + month + '-' + date + ' ' + hour + ':' + minutes + ':' + seconds)
  }

  React.useEffect(() => {
    getNowDateTime()

    //리스트에 있는 대시보드 데이터 인지, 새로 생성하는 대시보드인지 확인
    if (window.localStorage.getItem('SelectedDashboardInfo') !== 'new') {
      const Layoutdata: any = JSON.parse(window.localStorage.getItem('SelectedDashboardInfo'))
      const panel: any = Object.keys(panels[Number(Layoutdata[0].grid_id)]).map((panelIndex: string) => {
        return panels[Number(Layoutdata[0].grid_id)][panelIndex]
      })

      initializeTemplate(dashboardObj, Number(Layoutdata[0].grid_id)).then(function () {
        SelectedDashboardWidgetData(Layoutdata, panel)
      })
    } else {
      initializeTemplate(dashboardObj, 0)
    }
  }, [])

  React.useEffect(() => {
    setInterval(function () {
      getNowDateTime()
    }, 1000)
  }, [NowDateText])

  React.useEffect(() => {
    if (saveLayoutInfo.length !== 0) {
      setOpenSaveLayoutModal(false)
      if (saveLayoutInfo !== 'unSave') {
        getSaveLayoutInfo(saveLayoutInfo)
      }
    }
  }, [saveLayoutInfo])

  React.useEffect(() => {
    // 새로 그린 dashboard인 경우
    if (window.localStorage.getItem('SelectedDashboardInfo') === 'new') {
      const timeout = setTimeout(function () {
        AddGridGauid(panelIdx)
      }, 500)

      clearTimeout(timeout)
    }
  }, [panelIdx])

  //theme color mode
  const dashboardBoxColor = Chakra.useColorModeValue('white', 'dark')

  //리스트에 있던 대시보드 불러와서 위젯을 그리는 경우
  //현재 데이터가 없으므로 테스트데이터 csv 파일 가져와서 data로 사용함
  const SelectedDashboardWidgetData = async (Layoutdata: any, panel: any) => {
    for (let i = 0, len = Layoutdata.length; i < len; i++) {
      for (let j = 0, len = panel.length; j < len; j++) {
        if (Layoutdata[i].grid_index === Number(panel[j].id.split('_')[0])) {
          let uniqueArr: any = []
          const set: any = []
          for (let k = 0, len = Layoutdata[i].tag_list.length; k < len; k++) {
            set.push(Layoutdata[i].tag_list[k].tag)
            uniqueArr = [...new Set(set)]
          }
          const node: any = document.getElementById(panel[j].id)

          const data = await d3.csv(
            'https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered.csv'
          )

          const data1 = await d3.csv(
            'https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv'
          )

          if (Layoutdata[i].widget_type === 'Scatter Plot') {
            const elementData = (
              <>
                <D3ScatterPlotChart
                  widthSize={node.clientWidth}
                  heightSize={node.clientHeight}
                  Data={data}
                  DataName={'TestData'}
                  Color={'#69b3a294'}
                />
              </>
            )
            ReactDOM.render(elementData, node)
          } else if (Layoutdata[i].widget_type === 'Time Series') {
            const elementData = (
              <>
                <D3LineChart
                  widthSize={node.clientWidth}
                  heightSize={node.clientHeight}
                  Data={data1}
                  DataName={'TestData'}
                  Color={'orange'}
                />
              </>
            )
            ReactDOM.render(elementData, node)
          } else {
            const column: any = [
              { field: 'date', headerName: 'Date', editable: false },
              { field: 'value', headerName: 'Value', editable: false },
            ]
            const row: any = []
            let RowObj: any = new Object()

            for (let i = 0, len = data1.length; i < len; i++) {
              RowObj.date = data1[i].date
              RowObj.value = data1[i].value

              row.push(RowObj)
              RowObj = new Object()
            }

            const RtnData = [column, row]

            const elementData = (
              <DataGridWrap className={'ag-theme-alpine'}>
                <AgGridReact
                  rowData={RtnData[1]}
                  columnDefs={RtnData[0]}
                  defaultColDef={{
                    flex: 1,
                    editable: true,
                  }}
                  enableCellChangeFlash={true}
                  editType={'fullRow'}
                  pagination={true}
                  paginationAutoPageSize={true}
                />
              </DataGridWrap>
            )
            ReactDOM.render(elementData, node)
          }
        }
      }
    }
  }

  //grid 선택해서 레이아웃 변경 한 경우 모달의 target을 인수로 넘기는 grid render 함수를 call
  React.useEffect(() => {
    if (gridInformation !== undefined && gridInformation !== null) {
      rendereComplete(gridInformation)
    }
  }, [gridInformation])

  // 새로 그리는 대시보드인 경우, 가이드 형식 그려주는 함수
  // 가이드 데이터 표시 여부 확인 2023.06.14
  const AddGridGauid = async (idx: number) => {
    const panels: any = panelData
    const index = idx
    const panel: any = Object.keys(panels[index]).map((panelIndex: string) => {
      return panels[index][panelIndex]
    })

    for (let j = 0, len = panel.length; j < len; j++) {
      const node: any = document.getElementById(panel[j].id)
      node.className = panel[j].widget
      let data: any = []
      data = await d3.csv(
        'https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv'
      )

      if (node.className !== 'Table') {
        DrawD3ChartWithData(node, data)
      } else {
        const column: any = [
          { field: 'date', headerName: 'Date', editable: false },
          { field: 'value', headerName: 'Value', editable: false },
        ]
        const row: any = []
        let RowObj: any = new Object()

        for (let i = 0, len = data.length; i < len; i++) {
          RowObj.date = data[i].date
          RowObj.value = data[i].value

          row.push(RowObj)
          RowObj = new Object()
        }

        const RtnData = [column, row]
        DrawD3ChartWithData(node, RtnData)
      }
    }
  }

  //TagList에 따른 데이터를 받아와서 d3 chart 그리기.
  const DrawD3ChartWithData = (node: any, data: any) => {
    if (node.className === 'Time Series') {
      const elementData = (
        <>
          <D3LineChart
            widthSize={node.clientWidth}
            heightSize={node.clientHeight}
            Data={data}
            DataName={'TestData'}
            Color={'orange'}
          />
        </>
      )
      ReactDOM.render(elementData, node)
    } else if (node.className === 'Scatter Plot') {
      const elementData = (
        <>
          <D3ScatterPlotChart
            widthSize={node.clientWidth}
            heightSize={node.clientHeight}
            Data={data}
            DataName={'TestData'}
            Color={'#69b3a294'}
          />
        </>
      )
      ReactDOM.render(elementData, node)
    } else {
      const elementData = (
        <DataGridWrap className={'ag-theme-alpine'}>
          <AgGridReact
            rowData={data[1]}
            columnDefs={data[0]}
            defaultColDef={{
              flex: 1,
              editable: true,
            }}
            enableCellChangeFlash={true}
            editType={'fullRow'}
            pagination={true}
            paginationAutoPageSize={true}
          />
        </DataGridWrap>
      )
      ReactDOM.render(elementData, node)
    }
  }

  const getDataBySelectTagInfo = async (TagArr: any, node: any) => {
    DrawDefaultGrid(node)

    //일단 Table인 경우 조건 걸기 test용
    if (node.className !== 'Table') {
      //Test Data
      if (TagArr.length === 1) {
        if (TagArr[0] === 'TestData1') {
          const data = await d3.csv(
            'https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv'
          )

          DrawD3ChartWithData(node, data)
        } else {
          const data = await d3.csv(
            'https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered.csv'
          )

          DrawD3ChartWithData(node, data)
        }
      } else if (TagArr.length === 2) {
        const data = await d3.csv(
          'https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered.csv'
        )

        DrawD3ChartWithData(node, data)
      } else {
        axios
          .post(process.env.REACT_APP_API_SERVER_URL + '/api/hmid/chartData?', TagArr)
          .then((response) => {
            console.log('[ Chart response data ] : ')
            console.log(response.data)

            if (node.className === 'Time Series') {
              // layout.title = '선택한 Tag의 Data'

              //2023-06-13
              //Title or 범례 인수 check
              DrawD3ChartWithData(node, response.data)
            }
            setShowLoading(false)
          })
          .catch((error) => {
            console.log(error)

            alert('Error. 담당자에게 문의 바랍니다.')
            setShowLoading(false)
          })
      }
    } else {
      //Test Data 선택 한 경우
      if (TagArr[0] === 'TestData1') {
        const data = await d3.csv(
          'https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv'
        )

        const column: any = [
          { field: 'date', headerName: 'Time', editable: false },
          { field: 'value', headerName: 'Value', editable: false },
        ]
        const row: any = []
        let RowObj: any = new Object()

        for (let i = 0, len = data.length; i < len; i++) {
          RowObj.date = data[i].date
          RowObj.value = data[i].value

          row.push(RowObj)
          RowObj = new Object()
        }

        const RtnData = [column, row]
        DrawD3ChartWithData(node, RtnData)
      } else {
        axios
          .post(process.env.REACT_APP_API_SERVER_URL + '/api/tag/describe', TagArr)
          .then((response) => {
            setShowLoading(false)

            const column: any = [
              { field: 'date', headerName: 'Time', editable: false },
              { field: 'value', headerName: 'Value', editable: false },
            ]
            const row: any = []
            let RowObj: any = new Object()

            for (let i = 0, len = response.data.length; i < len; i++) {
              RowObj.date = response.data[i].date
              RowObj.value = response.data[i].value

              row.push(RowObj)
              RowObj = new Object()
            }
          })
          .catch((error) => {
            console.log(error)

            alert('Error. 담당자에게 문의 바랍니다.')
            setShowLoading(false)
          })
      }
    }
  }

  // 기본 형식 그려주는 함수
  const DrawDefaultGrid = (node: any) => {
    let data
    if (node.className !== 'Table') {
      data = (
        <>
          <D3ChartDefaultGrid widthSize={node.clientWidth} heightSize={node.clientHeight} />
        </>
      )
    } else {
      data = (
        <DataGridWrap className={'ag-theme-alpine'}>
          <AgGridReact
            rowData={[]}
            columnDefs={[]}
            defaultColDef={{
              flex: 1,
              editable: true,
            }}
            enableCellChangeFlash={true}
            editType={'fullRow'}
            pagination={true}
            paginationAutoPageSize={true}
          />
        </DataGridWrap>
      )
    }

    ReactDOM.render(data, node)
  }

  //위젯이 변경 되었을 때,
  //d3 grid clientWidth값 만큼 그려주기
  React.useEffect(() => {
    if (widgetInfo.length !== 0) {
      const node: any = document.getElementById(boxTargetId)
      node.className = widgetInfo
      setWidgetInfo('')

      //위젯 변경 시 기본 grid 그려주기
      DrawDefaultGrid(node)
    }
  }, [widgetInfo])

  //모달에서 선택한 TagInfoArr
  React.useEffect(() => {
    if (SelectTagInfo.length !== 0) {
      const node: any = document.getElementById(boxTargetId)
      node.setAttribute('tag-data', JSON.stringify(SelectTagInfo))

      getDataBySelectTagInfo(SelectTagInfo, node)
    }
  }, [SelectTagInfo])

  //Reset 버튼 클릭
  function reset(): void {
    dashboardObj.removeAll()
  }

  // 그리드 레이아웃 모달에서 그리드 선택 시 다시 그림
  async function initializeTemplate(dashboardObj: any, indexNumber: number) {
    let panelModelValue: ej2.PanelModel = {}
    const updatePanels: ej2.PanelModel[] = []
    setPanelIdx(indexNumber)

    const panel: any = Object.keys(panels[indexNumber]).map((panelIndex: string) => {
      return panels[indexNumber][panelIndex]
    })

    for (let i = 0; i < panel.length; i++) {
      panelModelValue = {
        id: i.toString(),
        row: panel[i].row,
        col: panel[i].col,
        sizeX: panel[i].sizeX,
        sizeY: panel[i].sizeY,
        header: `
        <div class="e-header-text">
          <button class="widget-setting-btn"></button>
          <button class="connection-chart-data"></button>
        </div>
        <div class="header-border"></div>`,
        content: '<div class="panel-content ${dashboardBoxColor}">Content Area</div>',
      }
      updatePanels.push(panelModelValue)
    }
    dashboardObj.panels = updatePanels
    return dashboardObj.panels
  }

  /**
   * 2023-06-13 박윤희
   * 위젯 셋팅 drawer 연결 작업 중 ...
   */
  const ClickDashBoardComponent = (e: any) => {
    //Data Connection 버튼 클릭한 경우
    const typeClass = e.target.className
    if (typeof typeClass !== 'object') {
      if (e.target.className.includes('connection-chart-data')) {
        const className = e.target.offsetParent.offsetParent.children[0].children[1].className
        const box_target_id = e.target.offsetParent.offsetParent.children[0].children[1].id
        if (className !== undefined) {
          setDataConnectionModal(true)
          setBoxTargetId(box_target_id)
        }
        //Widget 버튼 클릭한 경우
      } else if (e.target.className.includes('widget-setting-btn')) {
        const box_target_id = e.target.offsetParent.offsetParent.children[0].children[1].id
        setshowWidgetModalState(true)
        setBoxTargetId(box_target_id)
      }
    }
  }

  //그리드 rendering
  const rendereComplete = (args: any) => {
    if (args !== 'reset') {
      if (args.className.includes('image-pattern-style')) {
        //그리드 선택 모달창 닫기
        setOpenGridModal(false)
        const id = args.id
        dashboardObj.removeAll()
        initializeTemplate(dashboardObj, Number(id.charAt(id.length - 1)) - 1)
      }
    } else {
      reset()
    }
  }

  //이미지 저장
  const SaveLayoutImage = (lay_id: number, args: any) => {
    const formData: any = new FormData()

    const file: any = domtoimage.toBlob(document.querySelector('#DashboardBox')).then((blob) => {
      const id: any = lay_id

      const myfile = new File([blob], id + '.png', { type: 'image/png', lastModified: new Date().getTime() })

      formData.append('com_id', window.localStorage.getItem('companyId'))
      formData.append('lay_id', lay_id)
      formData.append('file', myfile)

      setForm(formData)
    })

    file.then(function (result: any) {
      axios
        .post(process.env.REACT_APP_API_SERVER_URL + '/api/hmid/layout/img', formData)
        .then((response) => {
          console.log('[ Save Dashboard Image Response Data ] : ')
          console.log(response.data)
          setAlertMessage('레이아웃 이미지 저장이 완료 되었습니다.')
          setShowAlertModal(true)
        })
        .catch((error) => {
          console.log(error)
          setAlertMessage('이미지 저장 오류. 관리자에게 문의 바랍니다.')
          setShowAlertModal(true)
        })
    })
  }

  //Layoutlist 가져오기
  const getLayoutList = (args: any) => {
    axios
      .get(
        process.env.REACT_APP_API_SERVER_URL +
          '/api/hmid/layout?company_id=' +
          window.localStorage.getItem('companyId'),
        {
          headers: {
            Accept: '*/*',
            'Content-Type': 'application/x-www-form-urlencoded;',
          },
          timeout: 500000,
        }
      )
      .then((response) => {
        console.log('[ get Layout List axios response data ] : ')
        console.log(response.data)
        SaveLayoutImage(response.data[Number(response.data.length) - 1].lay_id, args)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  /**
   * 2023-06-13
   * 박윤희
   * 대시보드 저장 코드 수정 작업
   */
  const SaveDashboard = (args: any) => {
    let params: any = new Object()

    if (window.localStorage.getItem('SelectedDashboardInfo') === 'new') {
      params = {
        com_id: localStorage.getItem('companyId'),
        lay_name: layoutTitle,
        grid_id: panelIdx.toString(),
        data: args,
      }

      console.log('[ Save Dashboard Params ] : ', params)
      console.log(JSON.stringify(params))

      axios
        .post(process.env.REACT_APP_API_SERVER_URL + '/api/hmid/layout', params)
        .then((response) => {
          console.log('[ SaveDashboard Response Data ] : ')
          console.log(response.data)

          if (response.data.detail === 'success') {
            setAlertMessage('레이아웃 저장이 완료 되었습니다.')
            setShowAlertModal(true)
            getLayoutList(args)

            // SaveLayoutImage(Number(window.localStorage.getItem('layout_id')), args)

            getLayoutList(args)
          }
        })
        .catch((error) => {
          console.log(error)
          setAlertMessage('저장 오류. 관리자에게 문의 바랍니다.')
          setShowAlertModal(true)
        })
    } else {
      params = {
        com_id: localStorage.getItem('companyId'),
        lay_id: Number(window.localStorage.getItem('layout_id')),
        lay_name: layoutTitle,
        grid_id: panelIdx.toString(),
        data: args,
      }

      axios
        .put(process.env.REACT_APP_API_SERVER_URL + '/api/hmid/layout', params)
        .then((response) => {
          console.log('[ Update Dashboard Response Data ] : ')
          console.log(response.data)

          if (response.data.detail === 'success') {
            setAlertMessage('레이아웃 업데이트가 완료 되었습니다.')
            setShowAlertModal(true)

            SaveLayoutImage(Number(window.localStorage.getItem('layout_id')), args)
          }
        })
        .catch((error) => {
          console.log(error)
          setAlertMessage('업데이트 오류. 관리자에게 문의바랍니다.')
          setShowAlertModal(true)
        })
    }
  }

  /**
   *
   * 2023-06-14 박윤희
   * 레이아웃 저장
   * 레이아웃 저장 API 파라미터를 가공하기 위한 함수
   *
   */
  const getSaveLayoutInfo = (SaveInfo: string) => {
    if (window.localStorage.getItem('SelectedDashboardInfo') === 'new') {
      //const company_nm: any = JSON.parse(window.localStorage.getItem('company_info')).com_nm

      let save_grid_obj: any = new Object()
      const save_grid_arr: any = []

      if (dashboardObj !== undefined) {
        const dashboard_data: any = dashboardObj.element.children

        for (let i = 0, len = dashboard_data.length; i < len; i++) {
          const node = dashboard_data[i].childNodes[0].childNodes[1]

          save_grid_obj.grid_nm = ''
          save_grid_obj.grid_index = i
          save_grid_obj.widget_type = node.className
          // save_grid_obj.width = node.clientWidth
          // save_grid_obj.height = node.clientHeight
          /**2023.07.03 박윤희 Tag List 현재 수정 */
          save_grid_obj.tag_list = []
          // 추후 주석 해제
          // save_grid_obj.tag_list = JSON.parse(node.getAttribute('tag-data'))

          save_grid_arr.push(save_grid_obj)
          save_grid_obj = new Object()
        }

        console.log('[ 저장 할 레이아웃 파라미터 ] ', save_grid_arr)
        SaveDashboard(save_grid_arr)
      }
      //레이아웃 수정 일 경우
    } else {
      //1. 위젯 이외 타이틀 등만 변경하는 경우
      let save_grid_obj: any = new Object()
      const save_grid_arr: any = []

      if (dashboardObj !== undefined) {
        const dashboard_data: any = JSON.parse(window.localStorage.getItem('SelectedDashboardInfo'))

        for (let i = 0, len = dashboard_data.length; i < len; i++) {
          save_grid_obj.grid_nm = ''
          save_grid_obj.grid_index = i
          save_grid_obj.widget_type = dashboard_data[i].widget_type
          // // save_grid_obj.width = node.clientWidth
          // // save_grid_obj.height = node.clientHeight
          // /**2023.07.03 박윤희 Tag List 현재 데이터가 없으므로 빈값으로 보냄 */
          save_grid_obj.tag_list = []
          // // 추후 주석 해제
          // // save_grid_obj.tag_list = JSON.parse(node.getAttribute('tag-data'))

          save_grid_arr.push(save_grid_obj)
          save_grid_obj = new Object()
        }

        console.log('[ 저장 할 레이아웃 파라미터 ] ', save_grid_arr)
        SaveDashboard(save_grid_arr)
      }
    }
  }

  return (
    <>
      <LayoutModal />
      <SaveConfirmModal />
      <WidgetModal />
      <DataConnection />
      <Alert />
      <Chakra.Box style={{ position: 'relative', zIndex: 1000 }}>
        <Chakra.Stack direction="row" spacing={4} pl={3} display={'block'}>
          <Chakra.Button
            id="design_button"
            leftIcon={<ReactIcon.MdBackspace />}
            variant="brand"
            onClick={() => {
              window.location.href = '/admin/layout-list'
            }}
            style={{ backgroundColor: '#4338F7', borderRadius: '100px' }}
          >
            Back
          </Chakra.Button>
          <Chakra.Button
            id="design_button"
            leftIcon={<ReactIcon.MdOutlineGridView />}
            variant="brand"
            onClick={() => {
              setOpenGridModal(true)
            }}
            style={{ backgroundColor: '#4338F7', borderRadius: '100px' }}
          >
            Grid
          </Chakra.Button>
          <Chakra.Button
            id="design_button"
            leftIcon={<ReactIcon.MdOutlineRestartAlt />}
            variant="brand"
            onClick={() => {
              setGridInformation('reset')
            }}
            style={{ backgroundColor: '#4338F7', borderRadius: '100px' }}
          >
            Reset
          </Chakra.Button>
          <Chakra.Button
            id="design_button"
            leftIcon={<ReactIcon.MdSave />}
            variant="brand"
            onClick={() => {
              setOpenSaveLayoutModal(true)
            }}
            style={{ backgroundColor: '#4338F7', borderRadius: '100px' }}
          >
            Save
          </Chakra.Button>
          <CurrentText>{NowDateText}</CurrentText>
          <CurrentIcon>
            <ReactIcon.MdAccessTime />
          </CurrentIcon>
        </Chakra.Stack>
      </Chakra.Box>
      <Spin tip="Loading" size="large" spinning={showLoading}>
        <div className="content" />
      </Spin>
      <div id="DashboardBox" style={{ position: 'relative' }}>
        <div className="col-lg-8 control-section" id="control_dash">
          <div className="content-wrapper" style={{ maxWidth: '100%' }}>
            <ej2.DashboardLayoutComponent
              id="api_dashboard"
              cellSpacing={cellSpacing}
              allowFloating={false}
              allowResizing={false}
              allowDragging={false}
              onClick={(e: any) => {
                ClickDashBoardComponent(e)
              }}
              columns={8}
              ref={(scope: any) => {
                ;(dashboardObj as any) = scope
              }}
            ></ej2.DashboardLayoutComponent>
          </div>
        </div>
      </div>
    </>
  )
}
export default PredefinedLayoutsConfiguration
