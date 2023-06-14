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
import { ColDef } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { panelData } from '../data/panel-data_config'
import * as d3 from 'd3'

import WidgetModal from '../../hmid/components/Modal/WidgetModal'
import SaveConfirmModal from '../../hmid/components/Modal/SaveConfirm'
import LayoutModal from '../../hmid/components/Modal/LayoutListModal'
import DataConnection from '../../hmid/components/Modal/DataConnection'
import { Alert } from '../../hmid/components/Modal/Alert'

import * as ReactIcon from 'react-icons/md'
import * as Chakra from '@chakra-ui/react'
import * as ej2 from '@syncfusion/ej2-react-layouts'
import * as 그리기함수 from './function/차트그리기함수'
import * as 가공함수 from './function/차트데이터가공함수'
import * as 이미지저장함수 from './function/캡쳐이미지저장함수'

import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import * as RecoilAtoms from '../recoil/config/atoms'
import { CompanyId, LayoutTitle, NowDate, WsDataTest } from '../recoil/base/atoms'
// import * as RecoilLineAtoms from '../recoil/line/atoms'
// import * as RecoilTimeSeriesAtoms from '../recoil/timeseries/atoms'
// import { GridDataObjSelector } from '../recoil/config/selector'

// import D3LineChart from './function/drawD3Chart'
import D3LineChartTooltip from './function/drawD3ChartTooltip(Test중)'
import D3ChartDefaultGrid from './function/drawD3ChartDefaultGrid'
import D3LineChart from '../../hmid/components/d3/D3LineChart'
import D3ScatterPlotChart from '../../hmid/components/d3/D3ScatterPlotChart'

const DataGridWrap = styled.div`
  width: 100%;
  height: calc(100% - 1.1vw);
`

const BoxTitle = styled.div`
  position: absolute;
  left: 1vw;
  top: 1vw;
  font-size: 0.8vw;
  font-weight: bold;
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
  //atom
  //옵션 삭제
  // const [LineDataOption, setLineDataOption] = useRecoilState(RecoilLineAtoms.LineChartDataOptionState)
  // const [LineLayoutOption, setLineLayoutOption] = useRecoilState(RecoilLineAtoms.LineChartLayoutOptionState)
  // const [TimeSeriesDataOption, setTimeSeriesDataOption] = useRecoilState(
  //   RecoilTimeSeriesAtoms.TimeSeriesChartDataOptionState
  // )
  // const [TimeSeriesLayoutOption, setTimeSeriesLayoutOption] = useRecoilState(
  //   RecoilTimeSeriesAtoms.TimeSeriesChartLayoutOptionState
  // )
  const [gridInformation, setGridInformation] = useRecoilState(RecoilAtoms.GridInformationState)
  // const [gridDataObj, setGridDataObj] = useRecoilState(RecoilAtoms.GridDataObjState)
  const [showLoading, setShowLoading] = useRecoilState(RecoilAtoms.ShowLoadingState)
  const [widgetInfo, setWidgetInfo] = useRecoilState(RecoilAtoms.WidgetInfoState)
  const [boxTargetId, setBoxTargetId] = useRecoilState(RecoilAtoms.BoxTargetIdState)
  const [panelIdx, setPanelIdx] = useRecoilState(RecoilAtoms.PanelIdxState)
  const [NowDateText, setNowDateText] = useRecoilState(NowDate)

  const setOpenGridModal = useSetRecoilState(RecoilAtoms.ShowGridModalState)
  const setOpenSaveLayoutModal = useSetRecoilState(RecoilAtoms.OpenSaveLayoutModalState)
  const setshowWidgetModalState = useSetRecoilState(RecoilAtoms.ShowWidgetModalState)
  const setDataConnectionModal = useSetRecoilState(RecoilAtoms.ShowConnectionDataState)
  const setAlertMessage = useSetRecoilState(RecoilAtoms.AlertMessageState)
  const setShowAlertModal = useSetRecoilState(RecoilAtoms.AlertModalState)

  //모달에서 선택한 Tag Array
  const SelectTagInfo = useRecoilValue(RecoilAtoms.SelectTagInfoState)
  const companyId = useRecoilValue(CompanyId)
  const layoutTitle = useRecoilValue(LayoutTitle)

  //보류
  // const [SaveTagDataList, setSaveTagDataList] = React.useState<any>([
  //   {
  //     type: 'Time Series',
  //     tag_data: [],
  //   },
  //   {
  //     type: 'Pie',
  //     tag_data: [],
  //   },
  //   {
  //     type: 'Bar',
  //     tag_data: [],
  //   },
  //   {
  //     type: 'Line',
  //     tag_data: [],
  //   },
  //   {
  //     type: 'Table',
  //     tag_data: [],
  //   },
  // ])

  const panels: any = panelData
  let dashboardObj: ej2.DashboardLayoutComponent
  const cellSpacing: number[] = [5, 5]

  //현재시간 계산하기
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
      const dashboardData = initializeTemplate(dashboardObj, 0)
      //가이드 필요한 경우
      dashboardData.then(function (args: any) {
        setTimeout(function () {
          AddGridGauid(0)
        }, 1000)
      })
    }
  }, [])

  React.useEffect(() => {
    setInterval(function () {
      getNowDateTime()
    }, 1000)
  }, [NowDateText])

  //theme color mode
  const dashboardBoxColor = Chakra.useColorModeValue('white', 'dark')

  //리스트에 있던 대시보드 불러와서 위젯을 그리는 경우
  const SelectedDashboardWidgetData = (Layoutdata: any, panel: any) => {
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
          if (Layoutdata[i].widget_type === 'Line') {
            그리기함수.getDataList(
              uniqueArr,
              Layoutdata[i].widget_type,
              node,
              JSON.parse(Layoutdata[i].layout_option),
              JSON.parse(Layoutdata[i].data_option)
            )
          } else if (Layoutdata[i].widget_type === 'Bar') {
            그리기함수.getDataList(
              uniqueArr,
              Layoutdata[i].widget_type,
              node,
              JSON.parse(Layoutdata[i].layout_option),
              JSON.parse(Layoutdata[i].data_option)
            )
          } else if (Layoutdata[i].widget_type === 'Pie') {
            const lay_option = JSON.parse(Layoutdata[i].layout_option)
            const data_option = JSON.parse(Layoutdata[i].data_option)
            그리기함수.getDataList(uniqueArr, Layoutdata[i].widget_type, node, lay_option, data_option)
          } else if (Layoutdata[i].widget_type === 'TimeSeries') {
            그리기함수.getDataList(
              uniqueArr,
              Layoutdata[i].widget_type,
              node,
              JSON.parse(Layoutdata[i].layout_option),
              JSON.parse(Layoutdata[i].data_option)
            )
          } else if (Layoutdata[i].widget_type === 'Table') {
            그리기함수.getDataList(
              uniqueArr,
              Layoutdata[i].widget_type,
              node,
              JSON.parse(Layoutdata[i].layout_option),
              JSON.parse(Layoutdata[i].data_option)
            )
          }
        }

        const inputElement: any = document.getElementById('input' + i)
        inputElement.value = Layoutdata[i].grid_nm
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
  const AddGridGauid = async (idx: number) => {
    const panels: any = panelData
    const index = idx
    const panel: any = Object.keys(panels[index]).map((panelIndex: string) => {
      return panels[index][panelIndex]
    })

    for (let j = 0, len = panel.length; j < len; j++) {
      const node: any = document.getElementById(panel[j].id)
      node.className = panel[j].widget
      console.log('[ Draw Dashboard Gauid ]')
      console.log(node)
      console.log(node.className)
      let data: any = []
      data = await d3.csv(
        'https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv'
      )

      DrawD3ChartWithData(node, data)
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
          <div>Data Table 작업 중 ... </div>
          {/* <AgGridReact
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
          /> */}
        </DataGridWrap>
      )
      ReactDOM.render(elementData, node)
    }
  }

  const getDataBySelectTagInfo = async (TagArr: any, node: any) => {
    console.log('[ Tag Arr ] : ', TagArr)
    console.log('[ Box Target Id ] ', boxTargetId)

    //일단 Table인 경우 조건 걸기 chart를 그려야 하기 때문
    if (node.className !== 'Table') {
      //Test Data
      if (TagArr[0] === 'TestData1') {
        const data = await d3.csv(
          'https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv'
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
      axios
        .post(process.env.REACT_APP_API_SERVER_URL + '/api/tag/describe', TagArr)
        .then((response) => {
          console.log('[ Tag Describe data ] : ')
          console.log(response.data)
          setShowLoading(false)

          const column: any = [
            { field: 'TagName', filter: true },
            { field: 'avg', filter: true },
            { field: 'min', filter: true },
            { field: 'max', filter: true },
          ]
          const row: any = []
          let RowObj: any = new Object()

          for (let i = 0, len = response.data.length; i < len; i++) {
            RowObj.TagName = response.data[i].tagName
            RowObj.avg = response.data[i].avg
            RowObj.min = response.data[i].min
            RowObj.max = response.data[i].max
            row.push(RowObj)
            RowObj = new Object()
          }

          const TableData: any = [column, row]
          DrawD3ChartWithData(node, TableData)
        })
        .catch((error) => {
          console.log(error)

          alert('Error. 담당자에게 문의 바랍니다.')
          setShowLoading(false)
        })
    }
  }

  //위젯이 변경 되었을 때,
  //d3 grid clientWidth값 만큼 그려주기
  React.useEffect(() => {
    if (widgetInfo.length !== 0) {
      const node: any = document.getElementById(boxTargetId)
      node.className = widgetInfo
      setWidgetInfo('')
      const data = (
        <>
          <D3ChartDefaultGrid widthSize={node.clientWidth} heightSize={node.clientHeight} />
        </>
      )
      ReactDOM.render(data, node)
    }
  }, [widgetInfo])

  //모달에서 선택한 TagInfoArr
  React.useEffect(() => {
    if (SelectTagInfo.length !== 0) {
      console.log('[ 모달에서 선택한 Tag Array ] ', SelectTagInfo)
      console.log('[ boxTargetId ] ', boxTargetId)
      const node: any = document.getElementById(boxTargetId)

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
    console.log('[ Index Number ] ', indexNumber)
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
    console.log(e.target.className)
    // if (e.target.className.includes('widget-setting-btn')) {
    //   const boxTargetId = e.target.offsetParent.offsetParent.children[0].childNodes[1].id
    //   console.log('----------------------------')
    //   console.log(boxTargetId)
    //   console.log('----------------------------')
    //   setBoxTargetId(boxTargetId)

    //   const data = e.target.offsetParent.offsetParent.children[0].childNodes[1].childNodes[0].data
    //   console.log(data)
    //   let autoRange: any = null
    //   if (e.target.offsetParent.offsetParent.children[0].childNodes[1].childNodes[0].layout.xaxis !== undefined) {
    //     autoRange = e.target.offsetParent.offsetParent.children[0].childNodes[1].childNodes[0].layout.xaxis.autorange
    //   }
    //   const id = e.target.offsetParent.offsetParent.children[0].childNodes[1].id
    //   const type = e.target.offsetParent.offsetParent.children[0].childNodes[1].childNodes[0].data[0].type
    //   if (data !== undefined) {
    //     if (autoRange === false) {
    //       // setLineChartShowDrawer(true)
    //       setWidgetInfo('Line')
    //       setBoxTargetId(id)
    //     } else if (type === 'pie') {
    //       // setPieChartShowDrawer(true)
    //       setWidgetInfo('Pie')
    //       setBoxTargetId(id)
    //     } else if (type === 'bar') {
    //       // setBarChartShowDrawer(true)
    //       setWidgetInfo('Bar')
    //       setBoxTargetId(id)
    //     } else if (autoRange === true) {
    //       // setTimeSeriesShowDrawer(true)
    //       setWidgetInfo('Time Series')
    //       setBoxTargetId(id)
    //     }
    //   } else {
    //     const className = e.target.offsetParent.offsetParent.children[0].childNodes[1].childNodes[1].className
    //     const id = e.target.offsetParent.offsetParent.children[0].childNodes[1].id
    //     if (className !== undefined) {
    //       if (className.includes('ag')) {
    //         setWidgetInfo('Table')
    //         setBoxTargetId(id)
    //       }
    //     }
    //   }
    // } else
    /**2023-06-13
     * 윤희 수정 작업 중
     */
    //Data Connection 버튼 클릭한 경우
    if (e.target.className.includes('connection-chart-data')) {
      const className = e.target.offsetParent.offsetParent.children[0].children[1].className
      console.log('[ Connection Chart Data] : ', className)
      if (className !== undefined) {
        setDataConnectionModal(true)
      }
      //Widget 버튼 클릭한 경우
    } else if (e.target.className.includes('widget-setting-btn')) {
      const box_target_id = e.target.offsetParent.offsetParent.children[0].children[1].id
      setshowWidgetModalState(true)
      setBoxTargetId(box_target_id)
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

  /**
   *
   * 2023-06-13 박윤희
   * SaveLayout시 수정 작업 진행
   */
  // save시 저장할 tag list parameter
  const getWidgetSelectTagList = (WidgetType: string, id: string) => {
    const tag_list_result: any = []

    // if (window.localStorage.getItem('SelectedDashboardInfo') !== 'new') {
    //   for (let i = 0, len = SaveTagDataList.length; i < len; i++) {
    //     if (WidgetType === SaveTagDataList[i].type) {
    //       for (let k = 0, len = SaveTagDataList[i].tag_data.length; k < len; k++) {
    //         if (SaveTagDataList[i].tag_data[k].length != 0) {
    //           if (SaveTagDataList[i].tag_data[k][0].id.split('_')[0] === id) {
    //             tag_list_result = SaveTagDataList[i].tag_data[k][0].tag_list
    //           } else {
    //             const prev_data: any = JSON.parse(window.localStorage.getItem('SelectedDashboardInfo'))
    //             for (let j = 0, len = prev_data.data.length; j < len; j++) {
    //               if (prev_data.data[j].grid_index === id) {
    //                 tag_list_result = prev_data.data[j]
    //               }
    //             }
    //           }
    //         }
    //       }
    //     }
    //   }
    // } else {
    //   for (let i = 0, len = SaveTagDataList.length; i < len; i++) {
    //     if (WidgetType === SaveTagDataList[i].type) {
    //       for (let k = 0, len = SaveTagDataList[i].tag_data.length; k < len; k++) {
    //         if (SaveTagDataList[i].tag_data[k].length != 0) {
    //           if (SaveTagDataList[i].tag_data[k][0].id.split('_')[0] === id) {
    //             tag_list_result = SaveTagDataList[i].tag_data[k][0].tag_list
    //           }
    //         }
    //       }
    //     }
    //   }
    // }

    return tag_list_result
  }

  //layoutlist api 연결
  const getLayoutList = () => {
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

        이미지저장함수.SaveLayoutImage(response.data[Number(response.data.length) - 1].lay_id)
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

      axios
        .post(process.env.REACT_APP_API_SERVER_URL + '/api/hmid/layout', params)
        .then((response) => {
          console.log('[ SaveDashboard Response Data ] : ')
          console.log(response.data)

          if (response.data.detail === 'success') {
            setAlertMessage('레이아웃 저장이 완료 되었습니다.')
            setShowAlertModal(true)

            getLayoutList()
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

            이미지저장함수.SaveLayoutImage(Number(window.localStorage.getItem('layout_id')))
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
   * 2023-04-18 박윤희
   * 레이아웃 저장
   *
   */
  const getSaveLayoutInfo = (SaveInfo: string) => {
    if (SaveInfo === 'unSave') {
      setOpenSaveLayoutModal(false)
    } else {
      if (window.localStorage.getItem('SelectedDashboardInfo') === 'new') {
        let company_nm: any = window.localStorage.getItem('company_info')
        company_nm = JSON.parse(company_nm)

        setOpenSaveLayoutModal(false)
        //capture

        let grid_obj: any = new Object()
        const grid_arr: any = []

        if (dashboardObj !== undefined) {
          const data: any = dashboardObj

          for (let i = 0, len = dashboardObj.element.children.length; i < len; i++) {
            if (dashboardObj.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0] !== undefined) {
              grid_obj.grid_index = Number(dashboardObj.element.children[i].id)

              if (data.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0].layout !== undefined) {
                if (
                  data.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0].layout.xaxis.rangeslider !==
                  undefined
                ) {
                  if (
                    data.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0].layout.xaxis.rangeslider
                      .autorange === true
                  ) {
                    grid_obj.widget_type = 'TimeSeries'
                    const input_element: any = document.querySelector('#input' + i)
                    grid_obj.grid_nm = input_element.value
                    grid_obj.width = data.element.childNodes[i].childNodes[0].childNodes[1].offsetWidth
                    grid_obj.height = data.element.childNodes[i].childNodes[0].childNodes[1].offsetHeight

                    const ChartDataOption: any =
                      data.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0].data

                    for (const i in ChartDataOption) {
                      for (const j in ChartDataOption[i]) {
                        if (j === 'x') {
                          delete ChartDataOption[i].x
                        }
                        if (j === 'y') {
                          delete ChartDataOption[i].y
                        }
                        if (j === 'text') {
                          delete ChartDataOption[i].text
                        }
                      }
                    }

                    grid_obj.data_option = JSON.stringify(ChartDataOption)
                    grid_obj.layout_option = JSON.stringify([
                      data.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0].layout,
                    ])

                    grid_obj.tag_list = getWidgetSelectTagList('Time Series', data.element.childNodes[i].id)
                  }
                } else {
                  if (data.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0].data[0].type === 'bar') {
                    grid_obj.widget_type = 'Bar'
                    const input_element: any = document.querySelector('#input' + i)
                    grid_obj.grid_nm = input_element.value
                    grid_obj.width = data.element.childNodes[i].childNodes[0].childNodes[1].offsetWidth
                    grid_obj.height = data.element.childNodes[i].childNodes[0].childNodes[1].offsetHeight

                    const BarChartDataOption: any =
                      data.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0].data

                    for (let i = 0, len = BarChartDataOption.length; i < len; i++) {
                      delete BarChartDataOption[i].x
                      delete BarChartDataOption[i].y
                    }

                    grid_obj.data_option = JSON.stringify(BarChartDataOption)
                    grid_obj.layout_option = JSON.stringify([
                      data.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0].layout,
                    ])

                    grid_obj.tag_list = getWidgetSelectTagList(grid_obj.widget_type, data.element.childNodes[i].id)
                  } else if (
                    data.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0].data[0].type === 'pie'
                  ) {
                    grid_obj.widget_type = 'Pie'
                    const input_element: any = document.querySelector('#input' + i)
                    grid_obj.grid_nm = input_element.value
                    grid_obj.width = data.element.childNodes[i].childNodes[0].childNodes[1].offsetWidth
                    grid_obj.height = data.element.childNodes[i].childNodes[0].childNodes[1].offsetHeight

                    const PieChartDataOption: any =
                      data.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0].data
                    delete PieChartDataOption[0].values
                    delete PieChartDataOption[0].labels

                    grid_obj.data_option = JSON.stringify(PieChartDataOption)
                    grid_obj.layout_option = JSON.stringify([
                      data.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0].layout,
                    ])

                    grid_obj.tag_list = getWidgetSelectTagList(grid_obj.widget_type, data.element.childNodes[i].id)
                  } else if (
                    data.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0].data[0].type === 'scatter'
                  ) {
                    grid_obj.widget_type = 'Line'
                    const input_element: any = document.querySelector('#input' + i)
                    grid_obj.grid_nm = input_element.value
                    grid_obj.width = data.element.childNodes[i].childNodes[0].childNodes[1].offsetWidth
                    grid_obj.height = data.element.childNodes[i].childNodes[0].childNodes[1].offsetHeight

                    const LineChartDataOption: any =
                      data.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0].data

                    for (let i = 0, len = LineChartDataOption.length; i < len; i++) {
                      delete LineChartDataOption[i].x
                      delete LineChartDataOption[i].y
                    }

                    grid_obj.data_option = JSON.stringify(LineChartDataOption)
                    grid_obj.layout_option = JSON.stringify([
                      data.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0].layout,
                    ])

                    grid_obj.tag_list = getWidgetSelectTagList(grid_obj.widget_type, data.element.childNodes[i].id)
                  }
                }
              } else {
                grid_obj.widget_type = 'Table'
                const input_element: any = document.querySelector('#input' + i)
                grid_obj.grid_nm = input_element.value
                grid_obj.width = data.element.childNodes[i].childNodes[0].childNodes[1].offsetWidth
                grid_obj.height = data.element.childNodes[i].childNodes[0].childNodes[1].offsetHeight
                grid_obj.layout_option = []
                grid_obj.data_option = []
                grid_obj.tag_list = getWidgetSelectTagList(grid_obj.widget_type, data.element.childNodes[i].id)
              }

              grid_arr.push(grid_obj)
              grid_obj = new Object()
            }
          }
          setOpenSaveLayoutModal(false)

          SaveDashboard(grid_arr)
        }
      } else {
        let grid_obj: any = new Object()
        const grid_arr: any = []
        const data: any = dashboardObj

        for (let i = 0, len = dashboardObj.element.children.length; i < len; i++) {
          if (dashboardObj.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0] !== undefined) {
            grid_obj.grid_index = Number(dashboardObj.element.children[i].id)

            if (data.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0].layout !== undefined) {
              if (data.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0].layout.xaxis !== undefined) {
                if (
                  data.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0].layout.xaxis.rangeslider !==
                  undefined
                ) {
                  if (
                    data.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0].layout.xaxis.rangeslider
                      .autorange === true
                  ) {
                    grid_obj.widget_type = 'TimeSeries'
                    const input_element: any = document.querySelector('#input' + i)
                    grid_obj.grid_nm = input_element.value
                    grid_obj.width = data.element.childNodes[i].childNodes[0].childNodes[1].offsetWidth
                    grid_obj.height = data.element.childNodes[i].childNodes[0].childNodes[1].offsetHeight

                    const ChartDataOption: any =
                      data.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0].data

                    for (const i in ChartDataOption) {
                      for (const j in ChartDataOption[i]) {
                        if (j === 'x') {
                          delete ChartDataOption[i].x
                        }
                        if (j === 'y') {
                          delete ChartDataOption[i].y
                        }
                        if (j === 'text') {
                          delete ChartDataOption[i].text
                        }
                      }
                    }

                    grid_obj.data_option = JSON.stringify(ChartDataOption)
                    grid_obj.layout_option = JSON.stringify([
                      data.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0].layout,
                    ])

                    const tag_arr: any = []
                    for (let i = 0, len = ChartDataOption.length; i < len; i++) {
                      tag_arr.push(ChartDataOption[i].name)
                    }

                    grid_obj.tag_list = tag_arr
                    // grid_obj.tag_list = getWidgetSelectTagList(grid_obj.widget_type, data.element.childNodes[i].id)
                  }
                } else {
                  if (data.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0].data[0].type === 'bar') {
                    grid_obj.widget_type = 'Bar'
                    const input_element: any = document.querySelector('#input' + i)
                    grid_obj.grid_nm = input_element.value
                    grid_obj.width = data.element.childNodes[i].childNodes[0].childNodes[1].offsetWidth
                    grid_obj.height = data.element.childNodes[i].childNodes[0].childNodes[1].offsetHeight

                    const BarChartDataOption: any =
                      data.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0].data

                    const tag_arr: any = []
                    for (let i = 0, len = BarChartDataOption.length; i < len; i++) {
                      for (let j = 0, len = BarChartDataOption[i].x.length; j < len; j++) {
                        tag_arr.push(BarChartDataOption[i].x[j])
                      }
                    }
                    grid_obj.tag_list = tag_arr

                    for (let i = 0, len = BarChartDataOption.length; i < len; i++) {
                      delete BarChartDataOption[i].x
                      delete BarChartDataOption[i].y
                    }

                    grid_obj.data_option = JSON.stringify(BarChartDataOption)
                    grid_obj.layout_option = JSON.stringify([
                      data.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0].layout,
                    ])

                    // grid_obj.tag_list = getWidgetSelectTagList(grid_obj.widget_type, data.element.childNodes[i].id)
                  } else if (
                    data.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0].data[0].type === 'pie'
                  ) {
                    grid_obj.widget_type = 'Pie'
                    const input_element: any = document.querySelector('#input' + i)
                    grid_obj.grid_nm = input_element.value
                    grid_obj.width = data.element.childNodes[i].childNodes[0].childNodes[1].offsetWidth
                    grid_obj.height = data.element.childNodes[i].childNodes[0].childNodes[1].offsetHeight

                    const PieChartDataOption: any =
                      data.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0].data

                    let tag_arr: any = []
                    for (let i = 0, len = PieChartDataOption.length; i < len; i++) {
                      tag_arr = PieChartDataOption[i].labels
                    }

                    grid_obj.tag_list = tag_arr

                    delete PieChartDataOption[0].values
                    delete PieChartDataOption[0].labels

                    grid_obj.data_option = JSON.stringify(PieChartDataOption)
                    grid_obj.layout_option = JSON.stringify([
                      data.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0].layout,
                    ])

                    //grid_obj.tag_list = getWidgetSelectTagList(grid_obj.widget_type, data.element.childNodes[i].id)
                  } else if (
                    data.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0].data[0].type === 'scatter'
                  ) {
                    grid_obj.widget_type = 'Line'
                    const input_element: any = document.querySelector('#input' + i)
                    grid_obj.grid_nm = input_element.value
                    grid_obj.width = data.element.childNodes[i].childNodes[0].childNodes[1].offsetWidth
                    grid_obj.height = data.element.childNodes[i].childNodes[0].childNodes[1].offsetHeight

                    const LineChartDataOption: any =
                      data.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0].data

                    const tag_arr: any = []
                    for (let i = 0, len = LineChartDataOption.length; i < len; i++) {
                      tag_arr.push(LineChartDataOption[i].name)
                    }

                    grid_obj.tag_list = tag_arr

                    for (let i = 0, len = LineChartDataOption.length; i < len; i++) {
                      delete LineChartDataOption[i].x
                      delete LineChartDataOption[i].y
                    }

                    grid_obj.data_option = JSON.stringify(LineChartDataOption)
                    grid_obj.layout_option = JSON.stringify([
                      data.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0].layout,
                    ])

                    // grid_obj.tag_list = getWidgetSelectTagList(grid_obj.widget_type, data.element.childNodes[i].id)
                  }
                }

                // grid_arr.push(grid_obj)
                // grid_obj = new Object()
              }
            } else {
              grid_obj.widget_type = 'Table'
              const input_element: any = document.querySelector('#input' + i)
              grid_obj.grid_nm = input_element.value
              grid_obj.width = data.element.childNodes[i].childNodes[0].childNodes[1].offsetWidth
              grid_obj.height = data.element.childNodes[i].childNodes[0].childNodes[1].offsetHeight
              grid_obj.layout_option = []
              grid_obj.data_option = []

              grid_obj.tag_list = getWidgetSelectTagList(grid_obj.widget_type, data.element.childNodes[i].id)

              // grid_arr.push(grid_obj)
              // grid_obj = new Object()
            }

            grid_arr.push(grid_obj)
            grid_obj = new Object()
          }
        }

        setOpenSaveLayoutModal(false)

        // const prev_data: any = JSON.parse(window.localStorage.getItem('SelectedDashboardInfo'))
        // const state_data = SaveTagDataList
        // for (let i = 0, len = prev_data.data.length; i < len; i++) {
        //   if (prev_data.data[i].widget_type === prev_data.data[i].widget_type) {
        //     for (let j = 0, len = SaveTagDataList.length; j < len; j++) {
        //       if (SaveTagDataList[j].type === prev_data[i].widget_type) {
        //         state_data[i].tag_list = prev_data.data[i].tag_list
        //       }
        //     }
        //   }
        // }
        SaveDashboard(grid_arr)
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
