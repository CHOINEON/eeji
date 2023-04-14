/**
 * INFINITE OPTIMAL
 * 메뉴 : HMI Designer - GridLayout
 * 시작 날짜 : 2023-03-10
 * 최종 수정 날짜 : 2023-04-06
 * 개발자 : 박윤희 (BAK YUN HEE)
 */

import * as ReactDOM from 'react-dom'
import * as React from 'react'
import { updateSampleSection } from './base'
import { DashboardLayoutComponent, PanelModel, ResizeArgs } from '@syncfusion/ej2-react-layouts'
import axios from 'axios'
import { MdOutlineGridView, MdOutlineSettingsInputComposite, MdSave, MdOutlineRestartAlt } from 'react-icons/md'
import { Box, useColorModeValue, Stack, Button, Checkbox } from '@chakra-ui/react'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import { panelData } from '../data/panel-data'
import '../style/style.css'
import WidgetModal from '../../hmid/components/Modal/WidgetModal'
import SaveConfirmModal from '../../hmid/components/Modal/SaveConfirm'
import LayoutModal from '../../hmid/components/Modal/LayoutListModal'
import Plot from 'react-plotly.js'
import * as d3 from 'd3'

//Data Connection Modal
import DataConnection from '../../hmid/components/Modal/DataConnection'

import LineChartComponent from '../../hmid/components/Chart/Line/LineChartComponent'
import PieChartComponent from '../../hmid/components/Chart/Pie/PieChartComponent'
import BarChartComponent from '../../hmid/components/Chart/Bar/BarChartComponent'
import TimeSeriesComponents from '../../hmid/components/Chart/TimeSeries/TimeSeriesComponents'
import WidgetDataTable from '../../hmid/components/DataGrid/DataGrid'
import { Select, Spin } from 'antd'
import '../../hmid/components/Modal/style/style.css'

//capture & filesaver
import domtoimage from 'dom-to-image'
import { saveAs } from 'file-saver'

// import reducer from '../reducer/reducer'
// import initialState from '../reducer/initialState'

// import { Alert, AlertIcon, AlertDescription, CloseButton, Box } from '@chakra-ui/react'

interface GridLayoutProps {
  // target: any
  CompanyId: string
  SaveConfirmIsOpen: boolean
  SaveInfo: string
  setSaveConfirmIsOpen: (isOpen: boolean) => void
}

export const PredefinedLayouts: React.FC<GridLayoutProps> = (props: any) => {
  //const [state, dispatch] = React.useReducer(reducer, initialState)

  //state
  const [isOpenWidgetModal, setIsOpenWidgetModal] = React.useState<boolean>(false)
  const [WidgetInfo, setWidgetInfo] = React.useState<string>('')

  const [isOpenDataConnectionModal, setIsOpenDataConnectionModal] = React.useState<boolean>(false)

  const [BoxTargetId, setBoxTargetId] = React.useState<any>()

  const [LineChartLayoutOption, setLineChartLayoutOption] = React.useState<any>('')
  const [LineChartDataOption, setLineChartDataOption] = React.useState<any>('')

  const [PieChartLayoutOption, setPieChartLayoutOption] = React.useState<any>('')
  const [PieChartDataOption, setPieChartDataOption] = React.useState<any>('')

  const [BarChartLayoutOption, setBarChartLayoutOption] = React.useState<any>('')
  const [BarChartDataOption, setBarChartDataOption] = React.useState<any>('')

  const [TimeSeriesLayoutOption, setTimeSeriesLayoutOption] = React.useState<any>('')
  const [TimeSeriesDataOption, setTimeSeriesDataOption] = React.useState<any>('')

  const [AlertVisibility, setAlertVisibility] = React.useState(true)

  const [LineChartShowDrawer, setLineChartShowDrawer] = React.useState(false)
  const [PieChartShowDrawer, setPieChartShowDrawer] = React.useState(false)
  const [BarChartShowDrawer, setBarChartShowDrawer] = React.useState(false)
  const [TimeSeriesShowDrawer, setTimeSeriesShowDrawer] = React.useState(false)

  const [TagListArr, setTagListArr] = React.useState<any>('')
  const [DataArr, setDataArr] = React.useState<any>('')

  const [SelectTagInfo, setSelectTagInfo] = React.useState<any>()

  const [ShowLoading, setShowLoading] = React.useState(false)

  //상단바 -- admin index에서 가져옴
  const [ButtonDisabled, setButtonDisabled] = React.useState<boolean>(true)
  const [OpenLayoutModal, setOpenLayoutModal] = React.useState<boolean>(false)
  const [GridInfo, setGridInformation] = React.useState<string>()
  const [ItemColor, setItemColor] = React.useState('#0044620f')

  //권한
  const [AdminInfo, setAdminInfo] = React.useState('block')

  //실시간 데이터
  const [realTimeBtnColor, setRealTimeBtnColor] = React.useState('#8F9BBA')
  const [realTimeBtnFont, setRealTimeBtnFont] = React.useState('#fff')

  //레이아웃 저장 confirm 창 & info
  const [OpenSaveLayout, setOpenSaveLayout] = React.useState<boolean>(false)

  //box title
  // const [BoxTitle, setBoxTitle] = React.useState<string>('타이틀')
  //box title input disabled
  const [BoxTitleDisabled, setBoxTitleDisabled] = React.useState<any>()

  const [PanelElement, setPanelElement] = React.useState<any>()

  const [DashboardObj, setDashboardObj] = React.useState<any>()

  // React.useEffect(() => {
  //   // console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$')
  //   // console.log(state)
  //   // console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$')
  // }, [state.COMPANY_ID, state.GRID_ID, state.ELEMENT])

  React.useEffect(() => {
    setOpenSaveLayout(props.SaveConfirmIsOpen)
  }, [props.SaveConfirmIsOpen])

  // React.useEffect(() => {
  //   dispatch({ type: 'COMPANY_ID', data: window.localStorage.getItem('companyId') })
  // }, [])

  //theme color mode
  const dashboardBoxColor = useColorModeValue('white', 'dark')

  const TableRows: any = [
    { make: 'Porsche', model: 'Boxter', price: 72000 },
    { make: 'Ford', model: 'Mondeo', price: 32000 },
    { make: 'Ford', model: 'Mondeo', price: 32000 },
    { make: 'Toyota', model: 'Celica', price: 35000 },
    { make: 'Toyota', model: 'Celica', price: 35000 },
    { make: 'Porsche', model: 'Boxter', price: 72000 },
    { make: 'Toyota', model: 'Celica', price: 35000 },
    { make: 'Toyota', model: 'Celica', price: 35000 },
    { make: 'Porsche', model: 'Boxter', price: 72000 },
    { make: 'Porsche', model: 'Boxter', price: 72000 },
    { make: 'Porsche', model: 'Boxter', price: 72000 },
    { make: 'Toyota', model: 'Celica', price: 35000 },
    { make: 'Porsche', model: 'Boxter', price: 72000 },
    { make: 'Ford', model: 'Mondeo', price: 32000 },
    { make: 'Ford', model: 'Mondeo', price: 32000 },
  ]

  const TableColumns: any = [{ field: 'make', filter: true }, { field: 'model', filter: true }, { field: 'price' }]

  const headerCount = 1
  const panels: any = panelData
  let dashboardObj: DashboardLayoutComponent
  const cellSpacing: number[] = [5, 5]
  let count = 0

  React.useEffect(() => {
    if (SelectTagInfo !== undefined) {
      console.log('-------------------------')
      // console.log(DataArr)
      console.log(SelectTagInfo)
      console.log('-------------------------')

      const ReDrawData: any = []
      const x: Date[] = []
      const y: any[] = []

      const DataArr = getDataBySelctedCompany('Dongwon', SelectTagInfo)

      console.log(DataArr)

      // for (let i = 0, len = SelectTagInfo.length; i < len; i++) {
      //   for (let j = 0, jlen = DataArr.length; j < jlen; j++) {
      //     if (SelectTagInfo[i] === DataArr[j].name) {
      //       ReDrawData.push(DataArr[j])
      //     }
      //   }
      // }

      // console.log('****************************')
      // console.log(ReDrawData)
      // console.log(BoxTargetId)
      // console.log(TimeSeriesLayoutOption)
      // console.log(TimeSeriesDataOption)
      // console.log('****************************')

      // ReDrawData.forEach(function (datum: { [x: string]: any }, i: any) {
      //   // console.log(datum['x'])
      //   for (let i = 0, len = datum['x'].length; i < len; i++) {
      //     datum['x'][i] = new Date(datum['x'][i])
      //   }
      // })

      // console.log(ReDrawData)
      // setTimeSeriesDataOption(ReDrawData)

      // DrawPlotlyChart(TimeSeriesLayoutOption, ReDrawData, BoxTargetId)
    }
  }, [SelectTagInfo])

  //레이아웃 만들 경우 default값 나타내기
  React.useEffect(() => {
    let panelModelValue: PanelModel = {}
    const updatePanels: PanelModel[] = []
    const index = 0
    const panel: any = Object.keys(panels[index]).map((panelIndex: string) => {
      return panels[index][panelIndex]
    })

    // dispatch({ type: 'GRID_ID', data: index })

    count = panel.length

    console.log('초기 값 : ')
    console.log(panel)

    for (let i = 0; i < panel.length; i++) {
      panelModelValue = {
        id: i.toString(),
        row: panel[i].row,
        col: panel[i].col,
        sizeX: panel[i].sizeX,
        sizeY: panel[i].sizeY,
        header: `
        <div class="e-header-text">
          <input value=${'타이틀'} ${BoxTitleDisabled} placeholder="타이틀을 입력 해주세요." id=${
          'input' + i.toString()
        }
        > 
          <button class="widget-setting-btn"></button>
          <button class="grid-setting-btn"></button>
          <button class="connection-chart-data"></button>
        </div>
        <div class="header-border"></div>`,
        content: '<div class="panel-content ${dashboardBoxColor}">Content Area</div>',
      }
      updatePanels.push(panelModelValue)
    }

    dashboardObj.panels = updatePanels
    setDashboardObj(dashboardObj)
  }, [])

  React.useEffect(() => {
    AddGridGauid(dashboardObj)
  }, [DashboardObj, PieChartLayoutOption, TimeSeriesLayoutOption, BarChartLayoutOption, LineChartLayoutOption])

  /**
   * 2023-04-14 박윤희
   * 초기 가이드 그리드 위젯 그리기 위한 함수
   */
  const DrawGauidWidget = (widget: string, node: any, option1: any, option2: any) => {
    //설정 값
    const config = {
      displaylogo: false,
      displayModeBar: false,
    }

    if (widget === 'Line' || widget === 'Bar' || widget === 'Pie' || widget === 'TimeSeries') {
      const layout = {
        ...option2,
        width: node.clientWidth,
        height: node.clientHeight,
        plot_bgcolor: 'rgba(255,255,255,0)',
        paper_bgcolor: 'rgba(255,255,255,0)',
      }

      const data = <Plot data={option1} layout={layout} config={config} />
      const element = React.createElement(data.type, {
        data: data.props.data,
        layout: data.props.layout,
        config: data.props.config,
      })
      ReactDOM.render(element, node)
    } else {
      const data = <WidgetDataTable rows={option1} columns={option2} />
      console.log(data)
      const element = React.createElement(data.type, {
        rows: data.props.rows,
        columns: data.props.columns,
      })

      ReactDOM.render(element, node)
    }
  }

  /**
   * 2023-04-14 박윤희
   * Grid Gauid
   * 그리드 박스가 그려지고 난 후 실행 되도록
   */
  const AddGridGauid = (e: any) => {
    const index = 0
    const panel: any = Object.keys(panels[index]).map((panelIndex: string) => {
      return panels[index][panelIndex]
    })

    if (e.panelCollection.length !== 0) {
      console.log('[ PanelCollection 정보 ] :')
      console.log(e.panelCollection)

      // 그려지고 난 후 실행하기
      for (let j = 0, len = e.panelCollection.length; j < len; j++) {
        if (panel[j].widget === 'Line') {
          setWidgetInfo('Pie')
          const result: any = ChangeLineDataArr(LineChartDataOption)
          result.then(function (args: any) {
            const node: any = document.getElementById(e.panelCollection[j].children[0].childNodes[1].id)
            DrawGauidWidget(panel[j].widget, node, args, LineChartLayoutOption)
          })
        } else if (panel[j].widget === 'Bar') {
          setWidgetInfo('Pie')
          const result: any = ChangeBarDataArr(BarChartDataOption)
          result.then(function (args: any) {
            const node: any = document.getElementById(e.panelCollection[j].children[0].childNodes[1].id)
            DrawGauidWidget(panel[j].widget, node, args, BarChartLayoutOption)
          })
        } else if (panel[j].widget === 'Pie') {
          setWidgetInfo('Pie')
          const result: any = ChangePieDataArr(PieChartDataOption)
          result.then(function (args: any) {
            const node: any = document.getElementById(e.panelCollection[j].children[0].childNodes[1].id)
            DrawGauidWidget(panel[j].widget, node, args, PieChartLayoutOption)
          })
        } else if (panel[j].widget === 'TimeSeries') {
          setWidgetInfo('Time Series')
          const result: any = ChangeTimeSeriesDataArr(TimeSeriesDataOption)
          result.then(function (args: any) {
            const node: any = document.getElementById(e.panelCollection[j].children[0].childNodes[1].id)
            DrawGauidWidget(panel[j].widget, node, args, TimeSeriesLayoutOption)
          })
        } else if (panel[j].widget === 'Table') {
          console.log(e.panelCollection)
          const node: any = document.getElementById(e.panelCollection[j].children[0].childNodes[1].id)
          DrawGauidWidget(panel[j].widget, node, TableRows, TableColumns)
        }
      }
    }
  }

  //grid 선택해서 레이아웃 변경 한 경우
  React.useEffect(() => {
    if (GridInfo !== undefined) {
      updateSampleSection()
      rendereComplete(GridInfo)
    }
  }, [dashboardObj, GridInfo])

  /**
   * 위젯이 변경되는 경우 PlotlyChart Draw하기
   */
  const DrawPlotlyChart = (ChartLayoutOption: any, ChartDataOption: any, BoxTargetId: any) => {
    if (BoxTargetId !== undefined) {
      if (ChartLayoutOption.length !== 0 && ChartDataOption.length !== 0) {
        const node: any = document.getElementById(BoxTargetId)
        console.log(node)
        const config = {
          displaylogo: false,
          displayModeBar: false,
        }

        const Layout: any = {
          ...ChartLayoutOption,
          width: node.clientWidth,
          height: node.clientHeight,
          plot_bgcolor: 'rgba(255,255,255,0)',
          paper_bgcolor: 'rgba(255,255,255,0)',
        }
        const data = <Plot data={ChartDataOption} layout={Layout} config={config} />
        const element = React.createElement(data.type, {
          data: data.props.data,
          layout: data.props.layout,
          config: data.props.config,
        })
        ReactDOM.render(element, node)
      }
    }
  }

  React.useEffect(() => {
    if (WidgetInfo === 'Line') {
      DrawPlotlyChart(LineChartLayoutOption, LineChartDataOption, BoxTargetId)
    } else if (WidgetInfo === 'Pie') {
      DrawPlotlyChart(PieChartLayoutOption, PieChartDataOption, BoxTargetId)
    } else if (WidgetInfo === 'Bar') {
      DrawPlotlyChart(BarChartLayoutOption, BarChartDataOption, BoxTargetId)
    } else if (WidgetInfo === 'Time Series') {
      DrawPlotlyChart(TimeSeriesLayoutOption, TimeSeriesDataOption, BoxTargetId)
    } else if (WidgetInfo === 'Table') {
      console.log(BoxTargetId)
      if (BoxTargetId !== undefined) {
        const node: any = document.getElementById(BoxTargetId)
        console.log(node)

        const data = <WidgetDataTable rows={TableRows} columns={TableColumns} />
        const element = React.createElement(data.type, { rows: data.props.rows, columns: data.props.columns })

        console.log(element)

        ReactDOM.render(element, node)
      }
    }
  }, [
    WidgetInfo,
    LineChartLayoutOption,
    LineChartDataOption,
    PieChartLayoutOption,
    PieChartDataOption,
    BarChartLayoutOption,
    BarChartDataOption,
    TimeSeriesLayoutOption,
    TimeSeriesDataOption,
  ])

  /**
   * GridLayout Evt
   * Grid Box Add
   */
  function btnClick(): void {
    const panel: PanelModel[] = [
      {
        id: count.toString() + '_layout',
        sizeX: 1,
        sizeY: 1,
        row: 0,
        col: 0,
        header: `
        <div class="e-header-text"> 
        <input value=${'타이틀'} ${BoxTitleDisabled} placeholder="타이틀을 입력 해주세요." ref={BoxTitleRef}> 
          <button class="widget-setting-btn"></button>
          <button class="grid-setting-btn"></button>
          <button class="connection-chart-data"></button>
        </div>
        <div class="header-border"></div>`,
        content: '<div class="panel-content">Content Area</div>',
      },
    ]
    ;(dashboardObj as any).addPanel(panel[0])
    const closeIcon: any = document.getElementById(count.toString() + '_layout').querySelector('.e-clear-icon')
    // closeIcon.addEventListener('click', onCloseIconHandler.bind(this))
    count = count + 1
  }

  /**
   * Panel이 Resize되는 경우
   */
  function onPanelResize(args: ResizeArgs): void {
    if (args.element && args.element.querySelector('.e-panel-container .e-panel-content div div')) {
      const chartObj: any = (args.element.querySelector('.e-panel-container .e-panel-content div div') as any)
        .ej2_instances[0]
      chartObj.height = '95%'
      chartObj.width = '100%'
      chartObj.refresh()
    }
  }

  /**
   * Reset 버튼 클릭
   */
  function reset(): void {
    // const selectedElement: any = document.getElementsByClassName('e-selected-style')
    // initializeTemplate(selectedElement[0], dashboardObj)
    dashboardObj.removeAll()
  }

  // 그리드 레이아웃 선택 시 그리드 다시 그림
  function initializeTemplate(element: any, dashboardObj: any): void {
    const updatePanels: PanelModel[] = []
    const index: number = parseInt(element.getAttribute('data-id'), 10) - 1
    const panel: any = Object.keys(panels[index]).map((panelIndex: string) => {
      return panels[index][panelIndex]
    })

    //reducer Element
    // dispatch({ type: 'ELEMENT', data: element })

    // console.log('-------------------- [ Panel Data ] --------------------')
    // console.log(panel)
    // console.log(element)
    // setPanelElement(element)
    // console.log('--------------------------------------------------------')

    count = panel.length

    for (let i = 0; i < panel.length; i++) {
      const panelModelValue: PanelModel = {
        id: i.toString(),
        row: panel[i].row,
        col: panel[i].col,
        sizeX: panel[i].sizeX,
        sizeY: panel[i].sizeY,
        header: `
        <div class="e-header-text"> 
        <input value=${'타이틀'} ${BoxTitleDisabled} placeholder="타이틀을 입력 해주세요." ref={BoxTitleRef}> 
          <button class="widget-setting-btn"></button>
          <button class="grid-setting-btn"></button> 
          <button class="connection-chart-data"></button>
        </div>
        <div class="header-border"></div>`,
        content: '<div class="panel-content">Content Area</div>',
      }
      updatePanels.push(panelModelValue)
    }
    dashboardObj.panels = updatePanels
  }

  /**
   * 2023-04-14 박윤희
   * DashboardComponent Click 이벤트 함수
   * 추후 코드 정리 작업 예정
   */
  const ClickDashBoardComponent = (e: any) => {
    if (e.target.id.length === 0 && typeof e.target.className !== 'object') {
      if (e.target.className.includes('ag')) {
        console.log('ag')
      } else {
        if (e.target.className.includes('grid-setting-btn')) {
          console.log(e)
          // console.log(e.target.offsetParent.offsetParent.children[0].childNodes[1].childNodes[0].data)

          if (e.target.offsetParent.offsetParent.children[0].childNodes[1].childNodes[0].data !== undefined) {
            // console.log(e.target.offsetParent.offsetParent.children[0].childNodes[1].childNodes[0].data[0].type)
            // console.log(WidgetInfo)
            console.log(e.target)
            // if (e.target.offsetParent.offsetParent.children[0].childNodes[1].childNodes[0].data[0].type === 'scatter') {
            if (
              e.target.offsetParent.offsetParent.children[0].childNodes[1].childNodes[0].layout.xaxis.autorange ===
              false
            ) {
              setLineChartShowDrawer(true)
              setWidgetInfo('Line')
              setBoxTargetId(e.target.offsetParent.offsetParent.children[0].childNodes[1].id)
              console.log(e)
            } else if (
              e.target.offsetParent.offsetParent.children[0].childNodes[1].childNodes[0].data[0].type === 'pie'
            ) {
              setPieChartShowDrawer(true)
              setWidgetInfo('Pie')
              setBoxTargetId(e.target.offsetParent.offsetParent.children[0].childNodes[1].id)
            } else if (
              e.target.offsetParent.offsetParent.children[0].childNodes[1].childNodes[0].data[0].type === 'bar'
            ) {
              setBarChartShowDrawer(true)
              setWidgetInfo('Bar')
              setBoxTargetId(e.target.offsetParent.offsetParent.children[0].childNodes[1].id)
            } else if (
              e.target.offsetParent.offsetParent.children[0].childNodes[1].childNodes[0].layout.xaxis.autorange === true
            ) {
              setBarChartShowDrawer(true)
              setWidgetInfo('Time Series')
              setBoxTargetId(e.target.offsetParent.offsetParent.children[0].childNodes[1].id)
            }
          } else {
            if (e.target.offsetParent.offsetParent.children[0].childNodes[1].childNodes[1].className !== undefined) {
              console.log(e.target.offsetParent.offsetParent.children[0].childNodes[1].childNodes[1].className)
              if (e.target.offsetParent.offsetParent.children[0].childNodes[1].childNodes[1].className.includes('ag')) {
                console.log('ag grid setting')
                setWidgetInfo('Table')
                setBoxTargetId(e.target.offsetParent.offsetParent.children[0].childNodes[1].id)
              }
            }
            setAlertVisibility(false)
          }
        } else if (e.target.className.includes('connection-chart-data')) {
          //console.log(' modal 열기')
          // console.log(e)
          // console.log(e.target.offsetParent.offsetParent.children[0].children[1].children[0].className)
          if (e.target.offsetParent.offsetParent.children[0].children[1].children[0].className !== undefined) {
            if (e.target.offsetParent.offsetParent.children[0].children[1].children[0].className !== 'js-plotly-plot') {
              console.log(' Table 용 모달 창')
            } else {
              setIsOpenDataConnectionModal(true)
            }
          }
        } else if (e.target.className.includes('widget-setting-btn')) {
          setIsOpenWidgetModal(true)

          //box target id 값 가져오기
          setBoxTargetId(e.target.offsetParent.offsetParent.children[0].children[1].id)
        }
      }
    } else {
      if (e.target.id === 'predefine_dashboard' || e.target.id.includes('input')) {
        // console.log(e)
        // console.log(e.target)
        // console.log(e.target.id)
      } else if (e.target.nodeName === 'INPUT') {
        console.log('Input')
        const id = e.target.id
        // document.querySelector(id).focus()
      } else {
        console.log(e)
        console.log(e.target.id)
      }
    }
  }

  //다시 그리드 rendering
  //기존 dashboardObj 지우고, 다시 init 함
  const rendereComplete = (args: any) => {
    if (args !== 'reset') {
      if (args.className.includes('image-pattern-style')) {
        dashboardObj.removeAll()
        initializeTemplate(args, dashboardObj)
      }
    } else {
      reset()
    }
  }

  /**
   * Get Chart Layout Option
   */
  const getLineChartLayout = (props: any) => {
    setLineChartLayoutOption(props)
  }

  const getPieChartLayout = (props: any) => {
    setPieChartLayoutOption(props)
  }

  const getBarChartLayout = (props: any) => {
    setBarChartLayoutOption(props)
  }

  const getTimeSeriesLayout = (props: any) => {
    setTimeSeriesLayoutOption(props)
  }

  /**
   * 2023-04-14 박윤희
   * LineData 가공 함수로 분리
   */
  const ChangeLineDataArr = async (dataOption: any) => {
    let ChartDataObj: any = {}
    const ChartDataArr: any = []

    const data = [
      {
        x: [1, 2, 3, 4, 5, 6, 7, 8],
        y: [10, 15, null, 17, 14, 12, 10, null, 15],
      },
      {
        x: [1, 2, 3, 4, 5, 6, 7, 8],
        y: [16, null, 13, 10, 8, null, 11, 12],
      },
    ]

    for (let i = 0, len = data.length; i < len; i++) {
      ChartDataObj = {
        ...dataOption,
        x: data[i].x,
        y: data[i].y,
      }

      ChartDataArr.push(ChartDataObj)

      ChartDataObj = new Object()
    }

    setLineChartDataOption(ChartDataArr)
    return ChartDataArr
  }

  const getLineChartData = (props: any) => {
    setLineChartDataOption(props)
  }

  /**
   * 2023-04-14 박윤희
   * PieData 가공 함수로 분리
   */
  const ChangePieDataArr = async (dataOption: any) => {
    let ChartDataObj: any = {}
    const ChartDataArr: any = []

    const data = [
      {
        values: [27, 11, 25, 8, 1, 3, 25],
        labels: ['US', 'China', 'European Union', 'Russian Federation', 'Brazil', 'India', 'Rest of World'],
        domain: { column: 1 },
        text: 'CO2',
      },
    ]

    for (let i = 0, len = data.length; i < len; i++) {
      ChartDataObj = {
        ...dataOption,
        values: data[i].values,
        labels: data[i].labels,
      }

      ChartDataArr.push(ChartDataObj)

      ChartDataObj = new Object()
    }

    setPieChartDataOption(ChartDataArr)
    return ChartDataArr
  }

  const getPieChartData = async (props: any) => {
    setPieChartDataOption(props)
  }

  /**
   * 2023-04-14 박윤희
   * BarData 가공 함수로 분리
   */
  const ChangeBarDataArr = async (dataOption: any) => {
    let ChartDataObj: any = {}
    const ChartDataArr: any = []

    if (WidgetInfo === 'Bar') {
      const data = [
        {
          x: ['giraffes', 'orangutans', 'monkeys'],
          y: [20, 14, 23],
          name: 'SF Zoo',
          type: 'bar',
        },
        {
          x: ['giraffes', 'orangutans', 'monkeys'],
          y: [12, 18, 29],
          name: 'LA Zoo',
          type: 'bar',
        },
      ]

      for (let i = 0, len = data.length; i < len; i++) {
        ChartDataObj = {
          ...dataOption,
          x: data[i].x,
          y: data[i].y,
        }

        ChartDataArr.push(ChartDataObj)

        ChartDataObj = new Object()
      }
      setBarChartDataOption(ChartDataArr)
      return ChartDataArr
    }
  }

  const getBarChartData = (props: any) => {
    setBarChartDataOption(props)
  }

  /**
   * 2023-04-14 박윤희
   * TimeSeriesData 가공 함수로 분리
   */
  const prepData = (rawData: any[]) => {
    const xField = 'Date'
    const yField = 'Mean_TemperatureC'

    const x: Date[] = []
    const y: any[] = []

    rawData.forEach(function (datum: { [x: string]: any }, i: any) {
      x.push(new Date(datum[xField]))
      y.push(datum[yField])
    })

    return [
      {
        mode: 'lines',
        x: x,
        y: y,
      },
    ]
  }

  const ChangeTimeSeriesDataArr = async (dataOption: any) => {
    let ChartDataObj: any = {}
    const ChartDataArr: any = []

    // if (WidgetInfo === 'Time Series') {
    const data = await d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/2016-weather-data-seattle.csv')

    const trace1 = prepData(data)

    for (let i = 0, len = trace1.length; i < len; i++) {
      ChartDataObj = {
        ...dataOption,
        x: trace1[i].x,
        y: trace1[i].y,
      }
      ChartDataArr.push(ChartDataObj)
      ChartDataObj = new Object()
    }

    setTimeSeriesDataOption(ChartDataArr)

    return ChartDataArr
  }

  const getTimeSeriesData = async (props: any) => {
    setTimeSeriesDataOption(props)
  }

  const getLineChartShowDrawer = (ShowDrawer: boolean) => {
    setLineChartShowDrawer(ShowDrawer)
  }

  const getPieChartShowDrawer = (ShowDrawer: boolean) => {
    setPieChartShowDrawer(ShowDrawer)
  }

  const getBarChartShowDrawer = (ShowDrawer: boolean) => {
    setBarChartShowDrawer(ShowDrawer)
  }

  const getTimeSeriesShowDrawer = (ShowDrawer: boolean) => {
    setTimeSeriesShowDrawer(ShowDrawer)
  }

  //전체 태그 리스트
  const getTagList = () => {
    axios
      .get('http://192.168.1.27:8000/api/tag/list', {
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/x-www-form-urlencoded;',
        },
        timeout: 500000,
      })
      .then((response) => {
        console.log('[ Tag List Response Data ] : ')
        console.log(response.data)

        setTagListArr(response.data)
      })
      .catch((error) => {
        console.log(error)
        setShowLoading(false)
      })
  }

  const getDataBySelctedCompany = (company: string, TagList: any) => {
    // console.log(company)
    if (company === 'Dongwon') {
      let TagString = ''

      setShowLoading(true)

      //tag list to string
      for (let i = 0, len = TagList.length; i < len; i++) {
        TagString += '`' + TagList[i] + '`,'
      }

      console.log('[ Tag String ] >>> ')
      console.log(TagString.slice(0, -1))

      axios
        .get('http://220.94.157.27:59871/api/hmid/chartData?chart=' + TagString.slice(0, -1), {
          headers: {
            Accept: '*/*',
            'Content-Type': 'application/x-www-form-urlencoded;',
          },
          timeout: 500000,
        })
        .then((response) => {
          console.log('[ Chart response data ] : ')
          console.log(response.data)

          // setDataArr(response.data)
          setShowLoading(false)

          return response.data

          // data.forEach(function (datum: { [x: string]: any }, i: any) {
          //   x.push(new Date(datum[xField]))
          //   y.push(datum[yField])
          // })
        })
        .catch((error) => {
          console.log(error)

          alert('Error. 담당자에게 문의 바랍니다.')
          setShowLoading(false)
        })
    }
  }

  // resize 이번트 시 chart 크기 조정
  // const onResize = (e: any) => {
  //   console.log(' resize >>>>>>>>>>>>>> ')
  //   // console.log(e)
  // }

  // const onResizeStart = (e: any) => {
  //   console.log(' resize start !!!!!!!!!!!!!!!!')
  //   // console.log(e)
  // }

  const onResizeStop = (e: any) => {
    console.log(WidgetInfo)
    console.log(e)
    // console.log(' resize stop !!!!!!!!!!!!!!!!')
    // // console.log(e)
    // console.log(e.element.children[0].children[1].clientWidth)
    // console.log(e.element.children[0].children[1].clientHeight)
    // console.log('-------------------------------------------------')
    // console.log(WidgetInfo)
    // console.log(TimeSeriesLayoutOption)
    // console.log(TimeSeriesDataOption)
    // console.log(BoxTargetId)
    // console.log('-------------------------------------------------')
    // if(WidgetInfo)

    setWidgetInfo(e.element.children[0].children[1].children[0].data[0].type)
    setBoxTargetId(e.element.children[0].children[1].id)

    onPanelResize.bind(e)

    // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>')
    // console.log(WidgetInfo)
    // console.log(BoxTargetId)
    // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>')

    if (WidgetInfo === 'Bar') {
      DrawPlotlyChart(BarChartLayoutOption, BarChartDataOption, BoxTargetId)
    } else if (WidgetInfo === 'Line') {
      DrawPlotlyChart(LineChartLayoutOption, LineChartDataOption, BoxTargetId)
    } else if (WidgetInfo === 'Pie') {
      DrawPlotlyChart(PieChartLayoutOption, PieChartDataOption, BoxTargetId)
    } else if (WidgetInfo === 'Time Series') {
      DrawPlotlyChart(TimeSeriesLayoutOption, TimeSeriesDataOption, BoxTargetId)
    }
  }

  //SaveLayoutModal
  const getSaveLayoutTitle = (title: string) => {
    console.log('[ Save Layout Title ] : ', title)
    // dispatch({ type: 'LAYOUT_NAME', data: title })
  }

  const getSaveLayoutInfo = (SaveInfo: string) => {
    console.log('[ Save Layout Info ] : ', SaveInfo)

    if (SaveInfo === 'unSave') {
      // setSaveGridModalIsOpen(false)
      setOpenSaveLayout(false)
    } else {
      domtoimage.toBlob(document.querySelector('#DashboardBox')).then((blob) => {
        saveAs(blob, 'dashboard.png')
      })

      console.log('############ save !!! ')
      console.log(localStorage.getItem('companyId'))
      console.log(props.CompanyId)
      console.log(PanelElement)
      console.log(parseInt(PanelElement.getAttribute('data-id'), 10) - 1)
    }
  }

  const getCloseLayoutModal = (IsOpen: boolean) => {
    console.log('[ Save Confirm Modal Is Open ] : ', IsOpen)
    props.setSaveConfirmIsOpen(false)
    setOpenSaveLayout(false)
  }

  return (
    <>
      <LayoutModal
        isOpen={OpenLayoutModal}
        setClose={(isClose: boolean) => {
          if (isClose) {
            setOpenLayoutModal(false)
          }
        }}
        setGridInfo={(gridInfo: string) => {
          if (gridInfo !== undefined) {
            console.log(gridInfo)
            setGridInformation(gridInfo)
            setButtonDisabled(false)
          }
        }}
      />
      <SaveConfirmModal
        SaveGridisOpen={OpenSaveLayout}
        setSaveLayoutTitle={getSaveLayoutTitle}
        setSaveLayoutInfo={getSaveLayoutInfo}
        setCloseSaveLayoutModal={getCloseLayoutModal}
      />
      <Box style={{ position: 'relative', zIndex: 1000 }}>
        <Stack direction="row" spacing={4} pl={3} display={AdminInfo}>
          <Button
            leftIcon={<MdOutlineGridView />}
            variant="brand"
            onClick={() => {
              setOpenLayoutModal(true)
            }}
          >
            Grid
          </Button>
          <Button
            leftIcon={<MdOutlineRestartAlt />}
            variant="brand"
            onClick={() => {
              setGridInformation('reset')
            }}
          >
            Reset
          </Button>
          <Button
            leftIcon={<MdSave />}
            variant="brand"
            onClick={() => {
              setOpenSaveLayout(true)
            }}
          >
            Save
          </Button>
          <Button
            leftIcon={<MdOutlineRestartAlt />}
            style={{ backgroundColor: realTimeBtnColor, color: realTimeBtnFont }}
            onClick={() => {
              setRealTimeBtnColor('#00ae2f')
            }}
          >
            실시간 데이터
          </Button>
        </Stack>
      </Box>
      <Spin tip="Loading" size="large" spinning={ShowLoading}>
        <div className="content" />
      </Spin>
      {/* {renderAlert()} */}
      <WidgetModal
        WidgetModalisOpen={isOpenWidgetModal}
        setCloseWidgetModal={(isClose: boolean) => {
          if (isClose) {
            setIsOpenWidgetModal(false)
          }
        }}
        setWidgetInfo={(WidgetInfo: string) => {
          if (WidgetInfo !== undefined) {
            setWidgetInfo(WidgetInfo)
          }
        }}
      />
      <DataConnection
        DataTagList={TagListArr}
        DataConnectionModalisOpen={isOpenDataConnectionModal}
        setCloseDataConnectionModal={(isClose: boolean) => {
          if (isClose) {
            setIsOpenDataConnectionModal(false)
          }
        }}
        setDataConnectionInfo={(dataInfo: string) => {
          // getDataBySelctedCompany(dataInfo)
          getTagList()
        }}
        setTagInfo={(TagInfo: any) => {
          setSelectTagInfo(TagInfo)
        }}
      />
      <LineChartComponent
        ChartType={WidgetInfo}
        ChartLayout={getLineChartLayout}
        ChartData={getLineChartData}
        ShowDrawer={LineChartShowDrawer}
        setShowDrawer={getLineChartShowDrawer}
      />
      <PieChartComponent
        ChartType={WidgetInfo}
        ChartLayout={getPieChartLayout}
        ChartData={getPieChartData}
        ShowPieDrawer={PieChartShowDrawer}
        setShowDrawer={getPieChartShowDrawer}
      />
      <BarChartComponent
        ChartType={WidgetInfo}
        ChartLayout={getBarChartLayout}
        ChartData={getBarChartData}
        ShowBarDrawer={BarChartShowDrawer}
        setShowDrawer={getBarChartShowDrawer}
      />
      <TimeSeriesComponents
        ChartType={WidgetInfo}
        ChartLayout={getTimeSeriesLayout}
        ChartData={getTimeSeriesData}
        ShowTimeSeriesDrawer={TimeSeriesShowDrawer}
        setShowDrawer={getTimeSeriesShowDrawer}
      />
      <div id="DashboardBox" style={{ position: 'relative' }}>
        <div className="addContainer">
          <ButtonComponent id="add" cssClass="e-info" onClick={btnClick.bind(this)}>
            Add Panel
          </ButtonComponent>
        </div>
        <div className="col-lg-8 control-section" id="control_dash">
          <div className="content-wrapper" style={{ maxWidth: '100%' }}>
            <DashboardLayoutComponent
              id="api_dashboard"
              // resize={(e: any) => onResize(e)}
              // resizeStart={(e: any) => onResizeStart(e)}
              resizeStop={(e: any) => onResizeStop(e)}
              cellSpacing={cellSpacing}
              allowFloating={true}
              allowResizing={true}
              draggableHandle={'.e-panel-header'}
              // created={onCreate.bind(this)}
              onClick={(e: any) => {
                ClickDashBoardComponent(e)
              }}
              columns={8}
              ref={(scope: any) => {
                ;(dashboardObj as any) = scope
              }}
              // resizeStop={onPanelResize.bind(this)}
              // allowDragging={true}
            >
              {/* <PanelsDirective>
              <PanelDirective
                row={0}
                col={0}
                sizeX={4}
                sizeY={3}
                content="<div class='panel-content'>Content Area</div>"
                header="<div class='e-header-text'>Header Area</div><div class='header-border'></div>"
              ></PanelDirective>
              <PanelDirective
                row={0}
                col={4}
                sizeX={2}
                sizeY={3}
                content="<div class='panel-content'>Content Area</div>"
                header="<div class='e-header-text'>Header Area</div><div class='header-border'></div>"
              ></PanelDirective>
              <PanelDirective
                row={3}
                col={0}
                sizeX={6}
                sizeY={3}
                content="<div class='panel-content'>Content Area</div>"
                header="<div class='e-header-text'>Header Area</div><div class='header-border'></div>"
              ></PanelDirective>
            </PanelsDirective> */}
            </DashboardLayoutComponent>
          </div>
        </div>
        {/* <div className="col-lg-4 property-section dashboard" id="dash_property">
        <div className="property-panel-header">Properties</div>
        <div className="row property-panel-content">
          <div className="row row-header">Choose dashboard layout</div>
          <div id="templateContainer">
            <div className="row" style={{ paddingTop: '3px' }}>
              <div className="image-pattern-style e-selected-style" id="template1" data-id="1" />
              <div className="image-pattern-style" id="template2" data-id="2" />
              <div className="image-pattern-style" id="template3" data-id="3" />
            </div>
            <div className="row" style={{ paddingTop: '3px' }}>
              <div className="image-pattern-style" id="template4" data-id="4" />
              <div className="image-pattern-style" id="template5" data-id="5" />
              <div className="image-pattern-style" id="template6" data-id="6" />
            </div>
          </div>
        </div>
        <div className="col-sm-12 col-xs-12 col-lg-12 col-md-12 reset" style={{ padding: '10px' }}>
          <ButtonComponent id="reset" onClick={reset}>
            Reset
          </ButtonComponent>
        </div>
      </div> */}
      </div>
    </>
  )
}
export default PredefinedLayouts
