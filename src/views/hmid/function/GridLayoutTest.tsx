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
import { useColorModeValue } from '@chakra-ui/react'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import { panelData } from './data/panel-data'
import './style/style.css'
import WidgetModal from '../components/Modal/WidgetModal'
import SaveConfirmModal from '../components/Modal/SaveConfirm'
import Plot from 'react-plotly.js'
import * as d3 from 'd3'

//Data Connection Modal
import DataConnection from '../components/Modal/DataConnection'

import LineChartComponent from '../components/Chart/Line/LineChartComponent'
import PieChartComponent from '../components/Chart/Pie/PieChartComponent'
import BarChartComponent from '../components/Chart/Bar/BarChartComponent'
import TimeSeriesComponents from '../components/Chart/TimeSeries/TimeSeriesComponents'
import WidgetDataTable from '../components/DataGrid/DataGrid'
import { Select, Spin } from 'antd'
import '../components/Modal/style/style.css'

// import { Alert, AlertIcon, AlertDescription, CloseButton, Box } from '@chakra-ui/react'

interface GridLayoutProps {
  target: any
  SaveConfirmIsOpen: boolean
  SaveInfo: string
  setSaveConfirmIsOpen: (isOpen: boolean) => void
}

export const PredefinedLayouts: React.FC<GridLayoutProps> = (props: any) => {
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

  //Save Confirm Modal
  const [SaveGridModalIsOpen, setSaveGridModalIsOpen] = React.useState(false)

  React.useEffect(() => {
    setSaveGridModalIsOpen(props.SaveConfirmIsOpen)
  }, [props.SaveConfirmIsOpen])

  //theme color mode
  const dashboardBoxColor = useColorModeValue('white', 'dark')
  console.log(dashboardBoxColor)

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
      console.log(DataArr)
      console.log(SelectTagInfo)
      console.log('-------------------------')
      const ReDrawData: any = []
      const x: Date[] = []
      const y: any[] = []

      for (let i = 0, len = SelectTagInfo.length; i < len; i++) {
        for (let j = 0, jlen = DataArr.length; j < jlen; j++) {
          if (SelectTagInfo[i] === DataArr[j].name) {
            ReDrawData.push(DataArr[j])
          }
        }
      }

      console.log('****************************')
      console.log(ReDrawData)
      console.log(BoxTargetId)
      console.log(TimeSeriesLayoutOption)
      console.log(TimeSeriesDataOption)
      console.log('****************************')

      ReDrawData.forEach(function (datum: { [x: string]: any }, i: any) {
        // console.log(datum['x'])
        for (let i = 0, len = datum['x'].length; i < len; i++) {
          datum['x'][i] = new Date(datum['x'][i])
        }
      })

      console.log(ReDrawData)
      setTimeSeriesDataOption(ReDrawData)

      DrawPlotlyChart(TimeSeriesLayoutOption, ReDrawData, BoxTargetId)
    }
  }, [SelectTagInfo])

  React.useEffect(() => {
    const updatePanels: PanelModel[] = []
    const index = 0
    const panel: any = Object.keys(panels[index]).map((panelIndex: string) => {
      return panels[index][panelIndex]
    })

    count = panel.length

    for (let i = 0; i < panel.length; i++) {
      const panelModelValue: PanelModel = {
        id: i.toString(),
        row: panel[i].row,
        col: panel[i].col,
        sizeX: panel[i].sizeX,
        sizeY: panel[i].sizeY,
        header: `<div class="e-header-text"> <button class="grid-setting-btn">
      </button><button class="connection-chart-data">
      </button></div><div class="header-border"></div>`,
        content: '<div class="panel-content ${dashboardBoxColor}">Content Area</div>',
      }
      updatePanels.push(panelModelValue)
    }
    dashboardObj.panels = updatePanels
  }, [])

  React.useEffect(() => {
    if (props.target !== undefined) {
      updateSampleSection()
      rendereComplete(props.target)
    }
  }, [dashboardObj, props.target])

  const DrawPlotlyChart = (ChartLayoutOption: any, ChartDataOption: any, BoxTargetId: any) => {
    console.log('[ Draw Plotly Chart Function ] : ')
    console.log(BoxTargetId)
    console.log(ChartLayoutOption)
    console.log(ChartDataOption)

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

  //동일한 값을 선택 한 경우...
  // React.useEffect(() => {
  //   console.log(' [ Rerenderling 될 때 마다 ] : ')
  //   console.log(WidgetInfo)
  //   if (WidgetInfo === 'Line') {
  //     console.log(LineChartLayoutOption)
  //     console.log(LineChartDataOption)
  //     DrawPlotlyChart(LineChartLayoutOption, LineChartDataOption, BoxTargetId)
  //   }
  // })

  React.useEffect(() => {
    if (WidgetInfo === 'Line') {
      // console.log('[ Grid Layout 에서 받은 Line Chart Option ] : ')
      // console.log(LineChartLayoutOption)
      // console.log(LineChartDataOption)
      // console.log('--------------------------------------------')
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
   */
  //grid box add
  function btnClick(): void {
    const panel: PanelModel[] = [
      {
        id: count.toString() + '_layout',
        sizeX: 1,
        sizeY: 1,
        row: 0,
        col: 0,
        header: `<div class="e-header-text"> <button class="grid-setting-btn">
      </button><button class="connection-chart-data">
      </button></div><div class="header-border"></div>`,
        content: '<div class="panel-content">Content Area</div>',
      },
    ]
    ;(dashboardObj as any).addPanel(panel[0])
    const closeIcon: any = document.getElementById(count.toString() + '_layout').querySelector('.e-clear-icon')
    // closeIcon.addEventListener('click', onCloseIconHandler.bind(this))
    count = count + 1
  }

  function onPanelResize(args: ResizeArgs): void {
    if (args.element && args.element.querySelector('.e-panel-container .e-panel-content div div')) {
      const chartObj: any = (args.element.querySelector('.e-panel-container .e-panel-content div div') as any)
        .ej2_instances[0]
      chartObj.height = '95%'
      chartObj.width = '100%'
      chartObj.refresh()
    }
  }
  function reset(): void {
    // const selectedElement: any = document.getElementsByClassName('e-selected-style')
    // initializeTemplate(selectedElement[0], dashboardObj)
    dashboardObj.removeAll()
  }

  function initializeTemplate(element: any, dashboardObj: any): void {
    const updatePanels: PanelModel[] = []
    const index: number = parseInt(element.getAttribute('data-id'), 10) - 1
    const panel: any = Object.keys(panels[index]).map((panelIndex: string) => {
      return panels[index][panelIndex]
    })

    count = panel.length

    for (let i = 0; i < panel.length; i++) {
      const panelModelValue: PanelModel = {
        id: i.toString(),
        row: panel[i].row,
        col: panel[i].col,
        sizeX: panel[i].sizeX,
        sizeY: panel[i].sizeY,
        header: `<div class="e-header-text"> <button class="grid-setting-btn">
      </button> <button class="connection-chart-data">
      </button></div><div class="header-border"></div>`,
        content: '<div class="panel-content">Content Area</div>',
      }
      updatePanels.push(panelModelValue)
    }

    // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
    // console.log(dashboardObj)
    // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
    dashboardObj.panels = updatePanels
  }

  // const renderAlert = () => {
  //   const component: any = []

  //   return AlertVisibility ? (
  //     <Alert status="error">
  //       <AlertIcon />
  //       <Box>
  //         <AlertDescription>위젯을 가져와주세요.</AlertDescription>
  //       </Box>
  //       <CloseButton
  //         alignSelf="flex-end"
  //         position="relative"
  //         right={'-86%'}
  //         top={-1}
  //         onClick={(e: any) => {
  //           setAlertVisibility(false)
  //         }}
  //       />
  //     </Alert>
  //   ) : (
  //     <div></div>
  //   )
  // }

  const ClickDashBoardComponent = (e: any) => {
    if (e.target.id.length === 0) {
      //chart & table인 경우...
      // console.log('&&&&&&&&&&&&&&&&&&&&&&&')
      // console.log(e.target.className)
      if (e.target.className.includes('ag')) {
        console.log('ag')
      } else {
        if (e.target.className.includes('grid-setting-btn')) {
          console.log(e)
          // console.log(e.target.offsetParent.offsetParent.children[0].childNodes[1].childNodes[0].data)

          if (e.target.offsetParent.offsetParent.children[0].childNodes[1].childNodes[0].data !== undefined) {
            // console.log(e.target.offsetParent.offsetParent.children[0].childNodes[1].childNodes[0].data[0].type)
            // console.log(WidgetInfo)
            if (e.target.offsetParent.offsetParent.children[0].childNodes[1].childNodes[0].data[0].type === 'scatter') {
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
            }
            {
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
          setIsOpenDataConnectionModal(true)
        }
      }
    } else {
      if (e.target.id === 'predefine_dashboard' || e.target.id.includes('input')) {
        console.log('else ...')
      } else {
        console.log(e.target.id)
        setBoxTargetId(e.target.id)
        setIsOpenWidgetModal(true)
      }
    }
  }

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
   * Get Chart Option
   */
  const getLineChartLayout = (props: any) => {
    if (WidgetInfo === 'Line') {
      setLineChartLayoutOption(props)
    }
  }

  const getPieChartLayout = (props: any) => {
    if (WidgetInfo === 'Pie') {
      setPieChartLayoutOption(props)
    }
  }

  const getBarChartLayout = (props: any) => {
    if (WidgetInfo === 'Bar') {
      setBarChartLayoutOption(props)
    }
  }

  const getTimeSeriesLayout = (props: any) => {
    if (WidgetInfo === 'Time Series') {
      setTimeSeriesLayoutOption(props)
    }
  }

  const getLineChartData = (props: any) => {
    let ChartDataObj: any = {}
    const ChartDataArr: any = []

    if (WidgetInfo === 'Line') {
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
          ...props,
          x: data[i].x,
          y: data[i].y,
        }

        ChartDataArr.push(ChartDataObj)

        ChartDataObj = new Object()
      }

      setLineChartDataOption(ChartDataArr)
    }
  }

  const getPieChartData = (props: any) => {
    let ChartDataObj: any = {}
    const ChartDataArr: any = []

    if (WidgetInfo === 'Pie') {
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
          ...props,
          values: data[i].values,
          labels: data[i].labels,
        }

        ChartDataArr.push(ChartDataObj)

        ChartDataObj = new Object()
      }
      setPieChartDataOption(ChartDataArr)
    }
  }

  const getBarChartData = (props: any) => {
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
          ...props,
          x: data[i].x,
          y: data[i].y,
        }

        ChartDataArr.push(ChartDataObj)

        ChartDataObj = new Object()
      }
      setBarChartDataOption(ChartDataArr)
    }
  }

  // const getPrepData = (rawData: any) => {
  //   console.log('#########################')
  //   console.log(rawData)

  //   const x: any[] = []
  //   const y: any[] = []

  //   const xField: any = 'Date'
  //   const yField: any = 'Mean_TemperatureC'

  //   rawData.forEach(function (datum: any[], i: any) {
  //     x.push(new Date(datum[xField]))
  //     y.push(datum[yField])
  //   })

  //   return [
  //     {
  //       mode: 'lines',
  //       x: x,
  //       y: y,
  //     },
  //   ]
  // }
  // const unpack = (rows: any[] | any, key: string) => {
  //   return rows.map(function (row: { [x: string]: any }) {
  //     return row[key]
  //   })
  // }

  const prepData = (rawData: any[]) => {
    // console.log(' raw Data !!!!!!!!!!!!!! ')
    // console.log(rawData)

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

  const getTimeSeriesData = async (props: any) => {
    let ChartDataObj: any = {}
    const ChartDataArr: any = []

    if (WidgetInfo === 'Time Series') {
      const data = await d3.csv(
        'https://raw.githubusercontent.com/plotly/datasets/master/2016-weather-data-seattle.csv'
      )

      const trace1 = prepData(data)

      // const trace1 = {
      //   type: 'scatter',
      //   mode: 'lines',
      //   x: unpack(data, 'Date'),
      //   y: unpack(data, 'Mean_TemperatureC'),
      // }
      // const trace2 = {
      //   type: 'scatter',
      //   mode: 'lines',
      //   name: 'AAPL Low',
      //   x: unpack(data, 'Date'),
      //   y: unpack(data, 'AAPL.Low'),
      //   line: { color: '#7F7F7F' },
      // }

      // const Chartdata = [trace1]

      for (let i = 0, len = trace1.length; i < len; i++) {
        ChartDataObj = {
          ...props,
          x: trace1[i].x,
          y: trace1[i].y,
        }
        ChartDataArr.push(ChartDataObj)
        ChartDataObj = new Object()
      }

      setTimeSeriesDataOption(ChartDataArr)
    }
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

  const getDataBySelctedCompany = (company: string) => {
    // console.log(company)
    if (company === 'Dongwon') {
      setShowLoading(true)
      axios
        .get('http://192.168.1.27:8000/hmid/chartData?day=' + 3, {
          headers: {
            Accept: '*/*',
            'Content-Type': 'application/x-www-form-urlencoded;',
          },
          timeout: 500000,
        })
        .then((response) => {
          console.log('[ Chart response data ] : ')
          console.log(response.data)

          setDataArr(response.data)
          setShowLoading(false)

          const data = response.data
          const DataTagList: string[] = []

          data.forEach((element: any, i: any) => {
            DataTagList.push(element['name'])
          })

          setTagListArr(DataTagList)

          // data.forEach(function (datum: { [x: string]: any }, i: any) {
          //   x.push(new Date(datum[xField]))
          //   y.push(datum[yField])
          // })
        })
        .catch((error) => {
          console.log(error)
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

    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>')
    console.log(WidgetInfo)
    console.log(BoxTargetId)
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>')

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
  }

  const getSaveLayoutInfo = (SaveInfo: string) => {
    console.log('[ Save Layout Info ] : ', SaveInfo)

    if (SaveInfo === 'unSave') {
      setSaveGridModalIsOpen(false)
    } else {
      console.log('############ save !!! ')
    }
  }

  const getCloseLayoutModal = (IsOpen: boolean) => {
    console.log('[ Save Confirm Modal Is Open ] : ', IsOpen)
    props.setSaveConfirmIsOpen(false)
    setSaveGridModalIsOpen(false)
  }

  return (
    <>
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
      <SaveConfirmModal
        SaveGridisOpen={SaveGridModalIsOpen}
        setSaveLayoutTitle={getSaveLayoutTitle}
        setSaveLayoutInfo={getSaveLayoutInfo}
        setCloseSaveLayoutModal={getCloseLayoutModal}
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
          getDataBySelctedCompany(dataInfo)
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
              ref={(scope) => {
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
