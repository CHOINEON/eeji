/**
 * INFINITE OPTIMAL
 * 메뉴 : HMI Designer - GridLayout
 * 시작 날짜 : 2023-03-10
 * 최종 수정 날짜 : 2023-04-06
 * 개발자 : 박윤희 (BAK YUN HEE)
 */

import * as ReactDOM from 'react-dom'
import * as React from 'react'
import styled from '@emotion/styled'
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

/**
 * ag Grid
 */
import { AgGridReact } from 'ag-grid-react'
import {
  RowValueChangedEvent,
  CellValueChangedEvent,
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
} from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css' // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css' // Optional theme CSS

//Data Connection Modal
import DataConnection from '../../hmid/components/Modal/DataConnection'

import LineChartComponent from '../../hmid/components/Chart/Line/LineChartComponent'
import PieChartComponent from '../../hmid/components/Chart/Pie/PieChartComponent'
import BarChartComponent from '../../hmid/components/Chart/Bar/BarChartComponent'
// import { AgGridReact } from 'ag-grid-react'
// import { RowValueChangedEvent, CellValueChangedEvent, ColDef } from 'ag-grid-community'
import TimeSeriesComponents from '../../hmid/components/Chart/TimeSeries/TimeSeriesComponents'
import WidgetDataTable from '../../hmid/components/DataGrid/DataGrid'
import { Select, Spin } from 'antd'
import '../../hmid/components/Modal/style/style.css'

//capture & filesaver
import domtoimage from 'dom-to-image'

import reducer from '../reducer/reducer'
import initialState from '../reducer/initialState'

interface GridLayoutProps {
  // target: any
  CompanyId: string
  SaveConfirmIsOpen: boolean
  SaveInfo: string
  setSaveConfirmIsOpen: (isOpen: boolean) => void
}

const DataGridWrap = styled.div`
  width: 100%;
  height: calc(100% - 1.1vw);
`

export const PredefinedLayouts: React.FC<GridLayoutProps> = (props: any) => {
  const [state, dispatch] = React.useReducer(reducer, initialState)

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
  const [idx, setIdx] = React.useState<any>(0)

  const [render, setRender] = React.useState(null)

  const [arr, setArr] = React.useState<any>([])

  const [SaveTagDataList, setSaveTagDataList] = React.useState<any>([
    {
      type: 'Time Series',
      tag_list: [],
    },
    {
      type: 'Pie',
      tag_list: [],
    },
    {
      type: 'Bar',
      tag_list: [],
    },
    {
      type: 'Line',
      tag_list: [],
    },
    {
      type: 'Table',
      tag_list: [],
    },
  ])

  const [PieChartDataType, setPieChartDataType] = React.useState<string>('max')

  const [SaveDashboardInfo, setSaveDashboardInfo] = React.useState<any>()

  /**
   * DataGrid
   * **/
  const gridRef = React.useRef<any>([])
  const [Theme, setTheme] = React.useState('ag-theme-alpine')
  const [gridApi, setGridApi] = React.useState<any>()

  const Array: any = []

  const defaultColDef = React.useMemo<ColDef>(() => {
    return {
      flex: 1,
      editable: true,
    }
  }, [])

  React.useEffect(() => {
    // console.log('change GridApi')
    // console.log(gridApi)
    // console.log(gridApi?.gridOptionsService.gridOptions.rowData)
    // console.log(gridApi?.gridOptionsService.gridOptions.columnDefs)
    let obj: any = new Object()

    obj.rowData = gridApi?.gridOptionsService.gridOptions.rowData
    obj.columnData = gridApi?.gridOptionsService.gridOptions.columnDefs
    Array.push(obj)
    obj = new Object()

    setArr(Array)
  }, [gridApi])

  React.useEffect(() => {
    console.log('change arr')
    console.log(arr)
  }, [arr])

  // Example of consuming Grid Event
  const cellClickedListener = React.useCallback((event: any) => {
    // props.setDataGridData('test')
    console.log('cellClicked', event)
  }, [])

  const rowClickedListener = React.useCallback((event: any) => {
    console.log('rowClicked', event)
    console.log(event.rowIndex)
  }, [])

  const onCellValueChanged = React.useCallback((event: CellValueChangedEvent) => {
    console.log('onCellValueChanged: ' + event.colDef.field + ' = ' + event.newValue)
  }, [])

  const rowValueChanged = React.useCallback((event: RowValueChangedEvent) => {
    console.log('rowValueChanged', event)
    const data = event.data
    // console.log('>>>>>>>>>>>>>>>>>>>>>>>>')
    // console.log(data)
    // console.log('>>>>>>>>>>>>>>>>>>>>>>>>')
  }, [])

  /**
   * DataGrid
   * **/

  React.useEffect(() => {
    console.log('------- [ State 변경 ] -------')
    console.log(state)
    console.log('------------------------------')
    setSaveDashboardInfo({
      layout_name: state.LAYOUT_NAME,
      company_id: state.COMPANY_ID,
      grid_id: state.GRID_ID,
      grid_data: state.GRID_DATA,
    })
  }, [state.LAYOUT_NAME, state.COMPANY_ID, state.LAYOUT_ID, state.GRID_ID, state.GRID_DATA])

  React.useEffect(() => {
    setOpenSaveLayout(props.SaveConfirmIsOpen)
  }, [props.SaveConfirmIsOpen])

  //company id
  React.useEffect(() => {
    dispatch({ type: 'COMPANY_ID', data: window.localStorage.getItem('companyId') })
  }, [])

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
      const ReDrawData: any = []
      const x: Date[] = []
      const y: any[] = []

      console.log('-------------------------------------------------')
      console.log('[ Data Connection Widget Info ] >>> ' + WidgetInfo)
      console.log('-------------------------------------------------')

      getDataBySelctedCompany('Dongwon', SelectTagInfo, WidgetInfo)
      // console.log(DataArr)

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

  React.useEffect(() => {
    if (DashboardObj !== undefined) {
      if (window.localStorage.getItem('SelectedDashboardInfo') !== 'new') {
        console.log(dashboardObj)
        const Layoutdata: any = JSON.parse(window.localStorage.getItem('SelectedDashboardInfo'))
        const index = Number(Layoutdata[0].grid_id)
        const panel: any = Object.keys(panels[index]).map((panelIndex: string) => {
          return panels[index][panelIndex]
        })

        console.log('[ Layout Data ] : ')
        console.log(Layoutdata)
        console.log(panel)

        for (let i = 0, len = Layoutdata.length; i < len; i++) {
          for (let j = 0, len = panel.length; j < len; j++) {
            if (Layoutdata[i].grid_index === Number(panel[j].id.split('_')[0])) {
              // console.log(LayoutData[i].grid_index)
              // console.log(Number(panel[j].id.split('_')[0]))
              const node: any = document.getElementById(panel[j].id)
              if (Layoutdata[i].widget_type === 'Line') {
                // DrawGauidWidget(
                //   LayoutData[i].widget_type,
                //   node,
                //   JSON.parse(LayoutData[i].layout_option),
                //   JSON.parse(LayoutData[i].data_option)
                // )
                getDataList(
                  Layoutdata[i].tag_list,
                  Layoutdata[i].widget_type,
                  node,
                  JSON.parse(Layoutdata[i].layout_option),
                  JSON.parse(Layoutdata[i].data_option)
                )
              } else if (Layoutdata[i].widget_type === 'Bar') {
                // DrawGauidWidget(
                //   LayoutData[i].widget_type,
                //   node,
                //   JSON.parse(LayoutData[i].layout_option),
                //   JSON.parse(LayoutData[i].data_option)
                // )
                getDataList(
                  Layoutdata[i].tag_list,
                  Layoutdata[i].widget_type,
                  node,
                  JSON.parse(Layoutdata[i].layout_option),
                  JSON.parse(Layoutdata[i].data_option)
                )
              } else if (Layoutdata[i].widget_type === 'Pie') {
                // DrawGauidWidget(
                //   LayoutData[i].widget_type,
                //   node,
                //   JSON.parse(LayoutData[i].layout_option),
                //   JSON.parse(LayoutData[i].data_option)
                // )
                getDataList(
                  Layoutdata[i].tag_list,
                  Layoutdata[i].widget_type,
                  node,
                  JSON.parse(Layoutdata[i].layout_option),
                  JSON.parse(Layoutdata[i].data_option)
                )
              } else if (Layoutdata[i].widget_type === 'TimeSeries') {
                console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
                console.log('Time Series !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
                console.log(Layoutdata[i].tag_list)
                console.log(Layoutdata[i].widget_type)
                console.log(node)
                console.log(JSON.parse(Layoutdata[i].layout_option))
                console.log(JSON.parse(Layoutdata[i].data_option))
                console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
                // DrawGauidWidget(
                //   LayoutData[i].widget_type,
                //   node,
                //   JSON.parse(LayoutData[i].layout_option),
                //   JSON.parse(LayoutData[i].data_option)
                // )
                getDataList(
                  Layoutdata[i].tag_list,
                  Layoutdata[i].widget_type,
                  node,
                  JSON.parse(Layoutdata[i].layout_option),
                  JSON.parse(Layoutdata[i].data_option)
                )
              } else if (Layoutdata[i].widget_type === 'Table') {
                // DrawGauidWidget(
                //   LayoutData[i].widget_type,
                //   node,
                //   JSON.parse(LayoutData[i].layout_option),
                //   JSON.parse(LayoutData[i].data_option)
                // )
                getDataList(
                  Layoutdata[i].tag_list,
                  Layoutdata[i].widget_type,
                  node,
                  JSON.parse(Layoutdata[i].layout_option),
                  JSON.parse(Layoutdata[i].data_option)
                )
              }
            }

            const header: any = document.getElementById(panel[j].id).parentElement.children[0].children[0]
            let data: any
            if (Layoutdata[i].grid_nm === null) {
              data = <div style={{ lineHeight: '0', fontWeight: 'bold' }}>{'타이틀'}</div>
            } else {
              data = <div>{Layoutdata[i].grid_nm}</div>
            }
            ReactDOM.render(data, header)
          }
        }
      } else {
        setTimeout(function () {
          AddGridGauid(DashboardObj, idx)
        }, 500)
      }
    }
  }, [DashboardObj, idx])

  //data 불러오기
  const getDataList = (TagList: any, WidgetInfo: string, node: any, layout_option: any, data_option: any) => {
    const TagData: any = []
    console.log(TagList)
    for (let i = 0, len = TagList.length; i < len; i++) {
      TagData.push(TagList[i].tag)
    }

    console.log('[ Tag Data ] : ')
    console.log(TagData)
    console.log(WidgetInfo)

    if (WidgetInfo === 'Table' || WidgetInfo === 'Pie' || WidgetInfo === 'Bar') {
      axios
        .post('http://192.168.1.27:8000/api/tag/describe', TagData)
        .then((response) => {
          console.log('[ Tag Describe data ] : ')
          console.log(response.data)
          // setShowLoading(false)

          if (WidgetInfo === 'Table') {
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

            DrawGauidWidget(WidgetInfo, node, row, column)

            // setTagListArr([])
          }
          if (WidgetInfo === 'Pie') {
            const labels: any = []
            const values: any = []

            const data = data_option
            const layout = layout_option

            // delete layout.title

            for (let i = 0, len = response.data.length; i < len; i++) {
              labels.push(response.data[i].tagName)
              if (PieChartDataType === 'max') {
                layout.title = '선택한 Tag의 Max 값'
                values.push(response.data[i].max)
              } else if (PieChartDataType === 'min') {
                values.push(response.data[i].min)
                layout.title = '선택한 Tag의 Min 값'
              } else {
                values.push(response.data[i].avg)
                layout.title = '선택한 Tag의 Average 값'
              }
            }

            console.log(typeof data)
            console.log(data)
            console.log(data[0])

            data[0].labels = labels
            data[0].values = values

            DrawGauidWidget(WidgetInfo, node, data, layout)
          }

          if (WidgetInfo === 'Bar') {
            const data: any = []
            let dataX: any = []
            let dataY: any = []
            let dataObj: any = new Object()
            const layout: any = new Object()
            const dataType: any = ['max', 'min', 'avg']

            layout.title = '선택한 Tag의 [ Min ,  Max , Average ]'

            for (let j = 0, len = dataType.length; j < len; j++) {
              for (let i = 0, len = response.data.length; i < len; i++) {
                dataX.push(response.data[i].tagName)
                dataY.push(response.data[i][dataType[j]])
                dataObj.name = dataType[j]
              }
              dataObj.type = 'bar'
              dataObj.textposition = 'auto'
              dataObj.x = dataX
              dataObj.y = dataY

              data.push(dataObj)
              dataObj = new Object()
              dataX = []
              dataY = []
            }

            DrawGauidWidget(WidgetInfo, node, data, layout)
          }
        })
        .catch((error) => {
          console.log(error)

          alert('Error. 담당자에게 문의 바랍니다.')
        })
    } else {
      axios
        .post('http://192.168.1.27:8000/api/hmid/chartData?', TagData)
        .then((response) => {
          console.log('Time Sreies!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
          console.log('[ Chart response data ] : ')
          console.log(response.data)

          if (WidgetInfo === 'TimeSeries') {
            layout_option[0].title = '선택한 Tag의 Data'
            DrawGauidWidget(WidgetInfo, node, response.data, layout_option[0])
          } else if (WidgetInfo === 'Line') {
            layout_option[0].title = '선택한 Tag들의 Data'
            DrawGauidWidget(WidgetInfo, node, response.data, layout_option[0])
          }
        })
        .catch((error) => {
          console.log(error)

          alert('Error. 담당자에게 문의 바랍니다.')
          // setShowLoading(false)
        })
    }
  }

  const ChangeInputValue = React.useCallback((event: any) => {
    console.log('changeInput Value >>>>>>  ', event)
  }, [])

  //레이아웃 만들 경우 default값 나타내기
  React.useEffect(() => {
    let panelModelValue: PanelModel = {}
    const updatePanels: PanelModel[] = []
    const index = 0
    const panel: any = Object.keys(panels[index]).map((panelIndex: string) => {
      return panels[index][panelIndex]
    })

    console.log('[ GRID ID ] : ' + index)
    dispatch({ type: 'GRID_ID', data: index })

    count = panel.length

    // console.log('초기 값 : ')
    // console.log(panel)

    for (let i = 0; i < panel.length; i++) {
      panelModelValue = {
        id: i.toString(),
        row: panel[i].row,
        col: panel[i].col,
        sizeX: panel[i].sizeX,
        sizeY: panel[i].sizeY,
        header: `
        <div class="e-header-text">
          <input value=${' '} ${BoxTitleDisabled} placeholder="타이틀을 입력 해주세요." id=${'input' + i.toString()}
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
    // console.log('[ 업데이트 판넬 데이터 ] : ')
    // console.log(updatePanels)
    // console.log(dashboardObj)
    // console.log(dashboardObj.panels)
    setDashboardObj(dashboardObj.panels)
    setIdx(index)
  }, [])

  /**
   * 2023-04-19 박윤희
   * grid ref 값 빋기
   * **/

  // const MyDatGrid = React.forwardRef((props: any, ref: any) => {
  //   console.log('>>>>>>>>>>>>>>>>>>>>>>>>')
  //   console.log(props)
  //   console.log(ref)
  //   console.log('>>>>>>>>>>>>>>>>>>>>>>>>')

  //   return (
  //     <DataGridWrap className={Theme}>
  //       <AgGridReact
  //         ref={(e: any) => {
  //           ref.current = props
  //         }}
  //         rowData={TableRows}
  //         columnDefs={TableColumns}
  //         defaultColDef={defaultColDef}
  //         enableCellChangeFlash={true}
  //         editType={'fullRow'}
  //       />
  //     </DataGridWrap>
  //   )
  // })

  // function WidgetDataTable(props: any) {
  //   console.log('[ Data Grid Table Props ] : ')
  //   console.log(props)
  //   const { myGridRef } = props
  //   console.log(myGridRef)
  //   console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')

  //   return (
  //     <DataGridWrap className={Theme}>
  //       <AgGridReact
  //         ref={(e: any) => {
  //           myGridRef.current = props
  //         }}
  //         rowData={TableRows}
  //         columnDefs={TableColumns}
  //         defaultColDef={defaultColDef}
  //         enableCellChangeFlash={true}
  //         editType={'fullRow'}
  //       />
  //     </DataGridWrap>
  //   )
  // }

  const getDataGridData = (e: any) => {
    console.log('[ 상위에서 넘어온 DataGrid ] : ')
    console.log(e)
  }

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

    console.log('--------------------')
    console.log(node)
    console.log(widget)
    console.log(option1)
    console.log(option2)
    console.log('--------------------')

    if (widget !== 'Table') {
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
      const data = (
        // <WidgetDataTable
        //   rows={option1}
        //   columns={option2}
        //   ref={(el: any) => (GridRef.current = [option1, option2])}
        //   // setDataGridData={(e: any) => {
        //   //   getDataGridData(e)
        //   // }}
        // />
        <DataGridWrap className={Theme}>
          <AgGridReact
            api={gridApi}
            // ref={(el: any) => {
            //   gridRef.current = el
            // }}
            onGridReady={(e: GridReadyEvent) => {
              console.log('grid Ready')
              console.log(e)
              setGridApi(e.api)
            }}
            rowData={option1}
            columnDefs={option2}
            defaultColDef={defaultColDef}
            enableCellChangeFlash={true}
            onCellClicked={cellClickedListener}
            onRowClicked={rowClickedListener}
            editType={'fullRow'}
            onCellValueChanged={onCellValueChanged}
            onRowValueChanged={rowValueChanged}
            pagination={true}
            paginationAutoPageSize={true}
          />
        </DataGridWrap>
      )
      // console.log(data)
      // const element = React.createElement(data.type, {
      //   rows: data.props.rows,
      //   columns: data.props.columns,
      // })

      ReactDOM.render(data, node)
    }
  }

  /**
   * 2023-04-14 박윤희
   * Grid Gauid
   * 그리드 박스가 그려지고 난 후 실행 되도록
   */
  const AddGridGauid = (args: any, idx: number) => {
    if (!render) return
    else {
      // console.log('[ render 확인 및 그리드 가이드 그리기 ]')
      // console.log(render)
      // console.log('[ Add Grid Gauid Idx ] : ' + idx)
      const index = idx
      const panel: any = Object.keys(panels[index]).map((panelIndex: string) => {
        return panels[index][panelIndex]
      })
      // 그려지고 난 후 실행하기
      for (let j = 0, len = panel.length; j < len; j++) {
        const node: any = document.getElementById(panel[j].id)
        if (panel[j].widget === 'Line') {
          setWidgetInfo('Line')
          const result: any = ChangeLineDataArr(LineChartDataOption)
          result.then(function (args: any) {
            DrawGauidWidget(panel[j].widget, node, args, LineChartLayoutOption)
          })
        } else if (panel[j].widget === 'Bar') {
          setWidgetInfo('Bar')
          const result: any = ChangeBarDataArr(BarChartDataOption)
          result.then(function (args: any) {
            // const node: any = document.getElementById(panel[j].id)
            DrawGauidWidget(panel[j].widget, node, args, BarChartLayoutOption)
          })
        } else if (panel[j].widget === 'Pie') {
          setWidgetInfo('Pie')
          const result: any = ChangePieDataArr(PieChartDataOption)
          result.then(function (args: any) {
            // const node: any = document.getElementById(panel[j].id)
            DrawGauidWidget(panel[j].widget, node, args, JSON.parse(PieChartLayoutOption))
          })
        } else if (panel[j].widget === 'TimeSeries') {
          setWidgetInfo('Time Series')
          const result: any = ChangeTimeSeriesDataArr(TimeSeriesDataOption)
          result.then(function (args: any) {
            // const node: any = document.getElementById(panel[j].id)
            DrawGauidWidget(panel[j].widget, node, args, TimeSeriesLayoutOption)
          })
        } else if (panel[j].widget === 'Table') {
          // const node: any = document.getElementById(panel[j].id)
          DrawGauidWidget(panel[j].widget, node, TableRows, TableColumns)
        }
      }
      //}
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
      const result: any = ChangeLineDataArr(LineChartDataOption)
      result.then(function (args: any) {
        DrawPlotlyChart(LineChartLayoutOption, args, BoxTargetId)
      })
    } else if (WidgetInfo === 'Pie') {
      const result: any = ChangePieDataArr(PieChartDataOption)
      result.then(function (args: any) {
        DrawPlotlyChart(PieChartLayoutOption, args, BoxTargetId)
      })
    } else if (WidgetInfo === 'Bar') {
      const result: any = ChangeBarDataArr(BarChartDataOption)
      result.then(function (args: any) {
        DrawPlotlyChart(BarChartLayoutOption, args, BoxTargetId)
      })
    } else if (WidgetInfo === 'Time Series') {
      const result: any = ChangeTimeSeriesDataArr(TimeSeriesDataOption)
      result.then(function (args: any) {
        DrawPlotlyChart(TimeSeriesLayoutOption, args, BoxTargetId)
      })
    } else if (WidgetInfo === 'Table') {
      // console.log(BoxTargetId)
      if (BoxTargetId !== undefined) {
        const node: any = document.getElementById(BoxTargetId)
        // console.log(node)

        const data = (
          // <WidgetDataTable
          //   rows={TableRows}
          //   columns={TableColumns}
          //   ref={(el: any) => (GridRef.current = [TableRows, TableColumns])}
          //   // setDataGridData={(e: any) => {
          //   //   getDataGridData(e)
          //   // }}
          // />
          <DataGridWrap className={Theme}>
            <AgGridReact
              ref={(el: any) => {
                gridRef.current = el
              }}
              rowData={TableRows}
              columnDefs={TableColumns}
              defaultColDef={defaultColDef}
              enableCellChangeFlash={true}
              //   rowSelection="multiple"
              // animateRows={true}
              // loadingCellRenderer={loadingCellRendererListener}
              onCellClicked={cellClickedListener}
              onRowClicked={rowClickedListener}
              editType={'fullRow'}
              onCellValueChanged={onCellValueChanged}
              onRowValueChanged={rowValueChanged}
              pagination={true}
              paginationAutoPageSize={true}
            />
          </DataGridWrap>
        )
        //const element = React.createElement(data.type, { rows: data.props.rows, columns: data.props.columns })

        // console.log(element)
        ReactDOM.render(data, node)
      }
    }
  }, [
    WidgetInfo,
    // LineChartLayoutOption,
    // LineChartDataOption,
    // PieChartLayoutOption,
    // PieChartDataOption,
    // BarChartLayoutOption,
    // BarChartDataOption,
    // TimeSeriesLayoutOption,
    // TimeSeriesDataOption,
  ])

  // /**
  //  * GridLayout Evt
  //  * Grid Box Add
  //  */
  // function btnClick(): void {
  //   const panel: PanelModel[] = [
  //     {
  //       id: count.toString() + '_layout',
  //       sizeX: 1,
  //       sizeY: 1,
  //       row: 0,
  //       col: 0,
  //       header: `
  //       <div class="e-header-text">
  //       <input value=${'타이틀'} ${BoxTitleDisabled} placeholder="타이틀을 입력 해주세요." ref={BoxTitleRef}>
  //         <button class="widget-setting-btn"></button>
  //         <button class="grid-setting-btn"></button>
  //         <button class="connection-chart-data"></button>
  //       </div>
  //       <div class="header-border"></div>`,
  //       content: '<div class="panel-content">Content Area</div>',
  //     },
  //   ]
  //   ;(dashboardObj as any).addPanel(panel[0])
  //   const closeIcon: any = document.getElementById(count.toString() + '_layout').querySelector('.e-clear-icon')
  //   count = count + 1
  // }

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
  async function initializeTemplate(element: any, dashboardObj: any) {
    let panelModelValue: PanelModel = {}
    const updatePanels: PanelModel[] = []
    const index: number = parseInt(element.getAttribute('data-id'), 10) - 1
    setIdx(index)
    const panel: any = Object.keys(panels[index]).map((panelIndex: string) => {
      return panels[index][panelIndex]
    })

    count = panel.length

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
    setDashboardObj(dashboardObj.panels)

    return dashboardObj
  }

  /**
   * 2023-04-14 박윤희
   * DashboardComponent Click 이벤트 함수
   * 추후 코드 정리 작업 예정
   */
  const ClickDashBoardComponent = (e: any) => {
    if (e.target.id.length === 0 && typeof e.target.className !== 'object') {
      if (e.target.className.includes('ag')) {
        //console.log('ag')
      } else {
        if (e.target.className.includes('grid-setting-btn')) {
          //console.log(e)
          // console.log(e.target.offsetParent.offsetParent.children[0].childNodes[1].childNodes[0].data)

          if (e.target.offsetParent.offsetParent.children[0].childNodes[1].childNodes[0].data !== undefined) {
            console.log(' Drawer 연결')
            console.log(e.target.offsetParent.offsetParent.children[0].childNodes[1].childNodes[0].data[0].type)
            console.log(e)
            //console.log(e.target)
            // if (e.target.offsetParent.offsetParent.children[0].childNodes[1].childNodes[0].data[0].type === 'scatter') {
            if (
              e.target.offsetParent.offsetParent.children[0].childNodes[1].childNodes[0].layout.xaxis.autorange ===
              false
            ) {
              setLineChartShowDrawer(true)
              setWidgetInfo('Line')
              setBoxTargetId(e.target.offsetParent.offsetParent.children[0].childNodes[1].id)
              //console.log(e)
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
              // console.log('TimeSeries!!!!!!!!!!!!!!!')
              setTimeSeriesShowDrawer(true)
              setWidgetInfo('Time Series')
              setBoxTargetId(e.target.offsetParent.offsetParent.children[0].childNodes[1].id)
            }
          } else {
            if (e.target.offsetParent.offsetParent.children[0].childNodes[1].childNodes[1].className !== undefined) {
              //console.log(e.target.offsetParent.offsetParent.children[0].childNodes[1].childNodes[1].className)
              if (e.target.offsetParent.offsetParent.children[0].childNodes[1].childNodes[1].className.includes('ag')) {
                //console.log('ag grid setting')
                setWidgetInfo('Table')
                setBoxTargetId(e.target.offsetParent.offsetParent.children[0].childNodes[1].id)
              }
            }
            setAlertVisibility(false)
          }
        } else if (e.target.className.includes('connection-chart-data')) {
          if (e.target.offsetParent.offsetParent.children[0].children[1].children[0].className !== undefined) {
            if (e.target.offsetParent.offsetParent.children[0].children[1].children[0].className !== 'js-plotly-plot') {
              //console.log(' Table 용 모달 창')
              // console.log('--------------------------------------------------------')
              // console.log(e.target.offsetParent.offsetParent.children[0].children[1].id)
              setBoxTargetId(e.target.offsetParent.offsetParent.children[0].children[1].id)
              setWidgetInfo('Table')
              setIsOpenDataConnectionModal(true)
            } else {
              // console.log(
              //   e.target.offsetParent.offsetParent.children[0].childNodes[1].childNodes[0].layout.xaxis.autorange
              // )
              if (
                e.target.offsetParent.offsetParent.children[0].childNodes[1].childNodes[0].layout.xaxis.autorange ===
                true
              ) {
                setWidgetInfo('Time Series')
              } else if (
                e.target.offsetParent.offsetParent.children[0].childNodes[1].childNodes[0].layout.xaxis.autorange ===
                false
              ) {
                setWidgetInfo('Line')
              } else if (
                e.target.offsetParent.offsetParent.children[0].childNodes[1].childNodes[0].data[0].type === 'bar'
              ) {
                setWidgetInfo('Bar')
              } else {
                setWidgetInfo('Pie')
              }
              setBoxTargetId(e.target.offsetParent.offsetParent.children[0].childNodes[1].id)
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
        //console.log('Input')
        const id = e.target.id
        // document.querySelector(id).focus()
      } else {
        //console.log(e)
        //console.log(e.target.id)
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

  const getPieChartLayout = (Pieprops: any) => {
    setPieChartLayoutOption(JSON.stringify(Pieprops))
  }

  const getBarChartLayout = (props: any) => {
    setBarChartLayoutOption(props)
  }

  const getTimeSeriesLayout = (props: any) => {
    //console.log(props)
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
    let ChartDataArr: any = []

    const data = [
      {
        values: [27, 11, 25, 8, 1, 3, 25],
        labels: ['US', 'China', 'European Union', 'Russian Federation', 'Brazil', 'India', 'Rest of World'],
        domain: { column: 1 },
        text: 'CO2',
      },
    ]

    if (dataOption.length !== 1) {
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
    } else {
      ChartDataArr = dataOption
    }
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

    const data = [
      {
        x: ['A', 'B', 'C', 'D', 'E'],
        y: [20, 14, 23, 35, 40, 56],
        name: 'data A',
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

      console.log(' [ BarChart ] >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
      console.log(ChartDataArr)

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
    const params: any = {
      com_id: localStorage.getItem('companyId'),
      search_type: 'process',
    }

    console.log(params)

    axios
      .post('http://192.168.1.27:8000/api/tag/list', params)
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

  // save시 저장할 tag list parameter
  const getWidgetSelectTagList = (WidgetType: string) => {
    console.log(WidgetType)
    let tag_list_result: any = []

    for (let i = 0, len = SaveTagDataList.length; i < len; i++) {
      console.log(WidgetInfo)
      console.log(SaveTagDataList[i].type)
      if (WidgetInfo === SaveTagDataList[i].type) {
        tag_list_result = SaveTagDataList[i].tag_list
      }
      // setSaveTagDataList
    }

    return tag_list_result
  }

  const getDataBySelctedCompany = (company: string, TagList: any, WidgetInfo: string) => {
    if (company === 'Dongwon') {
      const TagString = ''

      setShowLoading(true)

      console.log(WidgetInfo)
      const data = SaveTagDataList

      //태그 리스트 저장
      for (let i = 0, len = SaveTagDataList.length; i < len; i++) {
        console.log(WidgetInfo)
        console.log(data[i].type)
        if (WidgetInfo === data[i].type) {
          data[i].tag_list = TagList
        }
        // setSaveTagDataList
      }

      // console.log('----------- Tag Data -------------')
      // console.log(data)
      setSaveTagDataList(data)

      if (WidgetInfo === 'Table' || WidgetInfo === 'Pie' || WidgetInfo === 'Bar') {
        console.log('[ get Tag Describe Data ] : ')
        console.log(TagList)
        console.log(BoxTargetId)

        // axios.post(url[, data[, config]])   // POST
        // const fetchStatistic = () => {
        //   // console.log('selectedTags:', selectedTags)
        //   axios.post('http://220.94.157.27:59871/api/tag/describe', selectedTags).then(
        //     (response: any) => {
        //       // console.log('response:', response)
        //       setStatistic(response.data)
        //     },
        //     (error) => {
        //       console.log('error:', error)
        //     }
        //   )
        // }

        axios
          .post('http://220.94.157.27:59871/api/tag/describe', TagList)
          .then((response) => {
            console.log('[ Tag Describe data ] : ')
            console.log(response.data)
            setShowLoading(false)

            const node = document.getElementById(BoxTargetId)

            if (WidgetInfo === 'Table') {
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

              console.log(column)
              console.log(row)

              DrawGauidWidget('Table', node, row, column)

              setTagListArr([])
            }
            if (WidgetInfo === 'Pie') {
              const labels: any = []
              const values: any = []

              let data = PieChartDataOption
              const layout = JSON.parse(PieChartLayoutOption)

              // console.log('------[ Pie Chart ]------')
              // console.log(node)
              // console.log(PieChartDataOption)
              // console.log(PieChartLayoutOption)
              // console.log('--------------------------')

              delete layout.title

              for (let i = 0, len = response.data.length; i < len; i++) {
                labels.push(response.data[i].tagName)
                if (PieChartDataType === 'max') {
                  layout.title = '선택한 Tag의 Max 값'
                  values.push(response.data[i].max)
                } else if (PieChartDataType === 'min') {
                  values.push(response.data[i].min)
                  layout.title = '선택한 Tag의 Min 값'
                } else {
                  values.push(response.data[i].avg)
                  layout.title = '선택한 Tag의 Average 값'
                }
              }

              console.log(typeof data)
              console.log(data)
              console.log(data[0])

              if (typeof data === 'object' && data[0] !== undefined) {
                console.log(data)
                if (data[0].values !== undefined && data[0].labels !== undefined) {
                  delete data[0].values
                  delete data[0].labels
                  data[0].labels = labels
                  data[0].values = values
                } else {
                  data[0].labels = labels
                  data[0].values = values
                }
                // else {
                //   data.values = values
                //   data.labels = labels

                //   data = [data]
                // }

                // data = [data]

                console.log(data)
              } else {
                console.log(data)
                if (data.values !== undefined && data.labels !== undefined) {
                  delete data.values
                  delete data.labels

                  data.labels = labels
                  data.values = values

                  data = [data]
                } else {
                  data.labels = labels
                  data.values = values

                  data = [data]
                }
              }

              // console.log('>>>>>>>>>>>[ Pie Chart ]>>>>>>>>>>')
              // console.log(data)
              // console.log(layout)
              // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')

              DrawGauidWidget('Pie', node, data, layout)
              console.log(TagListArr)
              // setTagListArr([])
            }

            if (WidgetInfo === 'Bar') {
              const data: any = []
              let dataX: any = []
              let dataY: any = []
              let dataObj: any = new Object()
              const layout: any = BarChartLayoutOption

              const dataType: any = ['max', 'min', 'avg']

              layout.title = '선택한 Tag의 [ Min ,  Max , Average ]'

              for (let j = 0, len = dataType.length; j < len; j++) {
                for (let i = 0, len = response.data.length; i < len; i++) {
                  dataX.push(response.data[i].tagName)
                  dataY.push(response.data[i][dataType[j]])
                  dataObj.name = dataType[j]
                }
                dataObj.type = 'bar'
                dataObj.textposition = 'auto'
                dataObj.x = dataX
                dataObj.y = dataY

                data.push(dataObj)
                dataObj = new Object()
                dataX = []
                dataY = []
              }

              console.log(layout)
              console.log(data)

              DrawGauidWidget('Bar', node, data, layout)
              // setTagListArr([])
            }
            // return response.data
          })
          .catch((error) => {
            console.log(error)

            alert('Error. 담당자에게 문의 바랍니다.')
            setShowLoading(false)
          })
      } else {
        // {
        //   headers: {
        //     Accept: '*/*',
        //     'Content-Type': 'application/x-www-form-urlencoded;',
        //   },
        //   timeout: 500000,
        // }
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
        console.log(TagList)
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')

        const node = document.getElementById(BoxTargetId)

        axios
          .post('http://192.168.1.27:8000/api/hmid/chartData?', TagList)
          .then((response) => {
            console.log('[ Chart response data ] : ')
            console.log(response.data)

            if (WidgetInfo === 'Time Series') {
              // console.log('time series일 경우 ')
              // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
              // console.log(TimeSeriesLayoutOption)
              // console.log(TimeSeriesDataOption)
              // console.log(node)
              // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
              const layout: any = TimeSeriesLayoutOption
              layout.title = '선택한 Tag의 Data'
              DrawGauidWidget('TimeSeries', node, response.data, layout)
            } else if (WidgetInfo === 'Line') {
              // console.log('line chart일 경우 ')
              // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
              // console.log(LineChartLayoutOption)
              // console.log(LineChartDataOption)
              // console.log(node)
              // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
              // const data: any = []
              // const dataX: any = []
              // const dataY: any = []
              const dataObj: any = new Object()
              const layout: any = LineChartLayoutOption
              layout.title = '선택한 Tag들의 Data'
              DrawGauidWidget('Line', node, response.data, layout)
            }

            // setDataArr(response.data)
            setShowLoading(false)
          })
          .catch((error) => {
            console.log(error)

            alert('Error. 담당자에게 문의 바랍니다.')
            setShowLoading(false)
          })
      }
    }
  }

  /**
   * 2023-04-21
   * 박윤희
   * 대시보드 저장
   */

  const SaveDashboard = (args: any) => {
    console.log('저장 할 대시보드 Json Parameter')
    console.log(SaveDashboardInfo)
    console.log(args)

    const params: any = {
      com_id: localStorage.getItem('companyId'),
      lay_id: Number(window.localStorage.getItem('layout_id')) + 1,
      lay_name: state.LAYOUT_NAME,
      grid_id: state.GRID_ID.toString(),
      data: args,
    }

    console.log(params)
    console.log(JSON.stringify(params))

    axios
      .post('http://192.168.1.27:8000/api/hmid/layout', params)
      .then((response) => {
        console.log('[ SaveDashboard Response Data ] : ')
        console.log(response.data)

        if (response.data.detail === 'success') {
          alert('레이아웃 저장이 완료 되었습니다.')

          SaveLayoutImage(localStorage.getItem('companyId'), Number(window.localStorage.getItem('layout_id')))
        }
      })
      .catch((error) => {
        console.log(error)
        alert('오류. 관리자에게 문의 바랍니다.')
      })
  }

  const onResizeStop = (e: any) => {
    setWidgetInfo(e.element.children[0].children[1].children[0].data[0].type)
    setBoxTargetId(e.element.children[0].children[1].id)

    onPanelResize.bind(e)

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
    dispatch({ type: 'LAYOUT_NAME', data: title })
  }

  /**
   * 2023-04-27 박윤희
   * 레이아웃 이미지 저장
   */

  const SaveLayoutImage = (com_id: string, lay_id: number) => {
    const formData: any = new FormData()

    const file: any = domtoimage.toBlob(document.querySelector('#DashboardBox')).then((blob) => {
      const myfile = new File([blob], 'my_image.png', { type: 'image/png', lastModified: new Date().getTime() })
      formData.append('com_id', window.localStorage.getItem('companyId'))
      formData.append('lay_id', Number(window.localStorage.getItem('layout_id')))
      formData.append('file', myfile)
    })

    file.then(function (result: any) {
      console.log('Promise File then')
      console.log(result)
      // FormData의 key 확인
      axios
        .post('http://192.168.1.27:8000/api/hmid/layout/img', formData)
        .then((response) => {
          console.log('[ Save Dashboard Image Response Data ] : ')
          console.log(response.data)
        })
        .catch((error) => {
          console.log(error)
          alert('이미지 저장 오류. 관리자에게 문의 바랍니다.')
        })
    })
  }

  /**
   *
   * 2023-04-18 박윤희
   * 레이아웃 저장
   *
   */
  const getSaveLayoutInfo = (SaveInfo: string) => {
    if (SaveInfo === 'unSave') {
      getCloseLayoutModal(false)
    } else {
      let company_nm: any = window.localStorage.getItem('company_info')
      company_nm = JSON.parse(company_nm)

      getCloseLayoutModal(false)
      //capture

      //grid layout data loop 후 데이터 값 저장하기
      console.log('[ Save 선택 한 경우 ! ] ')
      console.log(DashboardObj)
      console.log(dashboardObj)

      let grid_obj: any = new Object()
      const grid_arr: any = []

      if (dashboardObj !== undefined) {
        const data: any = dashboardObj

        for (let i = 0, len = dashboardObj.element.children.length; i < len; i++) {
          if (dashboardObj.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0] !== undefined) {
            console.log(dashboardObj.element.children[i])
            // const node = document.getElementById(dashboardObj.element.children[i].id)
            // console.log('************** node *******************')
            // // console.log(node)
            // // console.log(data)
            // // console.log(data.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0].data)
            // // console.log(data.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0].layout)
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
                  // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
                  // console.log(data.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0].data)

                  const ChartDataOption: any = data.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0].data

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
                  // delete ChartDataOption[1].x
                  // delete ChartDataOption[1].y
                  // delete ChartDataOption[0].text

                  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
                  console.log(ChartDataOption)
                  console.log(JSON.stringify(ChartDataOption))
                  console.log(data.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0].layout)
                  console.log(
                    JSON.stringify(data.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0].layout)
                  )
                  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')

                  grid_obj.data_option = JSON.stringify(ChartDataOption)
                  grid_obj.layout_option = JSON.stringify([
                    data.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0].layout,
                  ])

                  grid_obj.tag_list = getWidgetSelectTagList(grid_obj.widget_type)
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
                  delete BarChartDataOption[0].x
                  delete BarChartDataOption[0].y

                  grid_obj.data_option = JSON.stringify(BarChartDataOption)
                  grid_obj.layout_option = JSON.stringify([
                    data.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0].layout,
                  ])

                  grid_obj.tag_list = getWidgetSelectTagList(grid_obj.widget_type)
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

                  // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
                  // console.log(PieChartDataOption)
                  // console.log(JSON.stringify(PieChartDataOption))
                  // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')

                  grid_obj.data_option = JSON.stringify(PieChartDataOption)
                  grid_obj.layout_option = JSON.stringify([
                    data.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0].layout,
                  ])

                  grid_obj.tag_list = getWidgetSelectTagList(grid_obj.widget_type)
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
                  delete LineChartDataOption[0].x
                  delete LineChartDataOption[0].y

                  grid_obj.data_option = JSON.stringify(LineChartDataOption)
                  grid_obj.layout_option = JSON.stringify([
                    data.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0].layout,
                  ])

                  grid_obj.tag_list = getWidgetSelectTagList(grid_obj.widget_type)
                }
              }
            } else {
              grid_obj.widget_type = 'Table'
              const input_element: any = document.querySelector('#input' + i)
              grid_obj.grid_nm = input_element.value
              grid_obj.width = data.element.childNodes[i].childNodes[0].childNodes[1].offsetWidth
              grid_obj.height = data.element.childNodes[i].childNodes[0].childNodes[1].offsetHeight
              grid_obj.layout_option = []
              // grid_obj.data_option = JSON.stringify(arr)
              grid_obj.data_option = []
              // grid_obj.tag_list = getWidgetSelectTagList(grid_obj.widget_type)
              grid_obj.tag_list = getWidgetSelectTagList(grid_obj.widget_type)
              // console.log('*********************************')
              // console.log(data)
              // console.log(arr)
              // console.log(gridRef)
              // console.log('*********************************')
            }

            grid_arr.push(grid_obj)
            grid_obj = new Object()
          }

          // if (
          //   dashboardObj.element.children[i].children[0].children[1].children[0].layout.xaxis.rangeslider.autorange ===
          //   true
          // ) {
          //   grid_obj.widget_type = 'TimeSeries'
          // }
          // }else if(dashboardObj.element.children[i].children[0].children[1].children[0].data[0].0.mode === 'bar'){
          //   grid_obj.widget_type = 'Bar'
          // }else if(dashboardObj.element.children[i].children[0].children[1].children[0].data[0].0.mode === 'pie'){
          //   grid_obj.widget_type = 'Pie'
          // }else {
          //   grid_obj.widget_type 'Table'
          // }

          // "grid_index": 0,
          // "widget_type": "string",
          // "height": 0,
          // "width": 0,
          // "tag_list": [
          //   "string"
          // ]
        }

        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
        console.log(grid_arr)

        SaveDashboard(grid_arr)
      }
      console.log(localStorage.getItem('companyId'))
    }
  }

  const getCloseLayoutModal = (IsOpen: boolean) => {
    props.setSaveConfirmIsOpen(false)
    setOpenSaveLayout(false)
  }

  const getDataType = (DataType: string) => {
    console.log('[ 하위 PieChart Component 에서 받은 Pie Chart Data Type ] : ')
    console.log(DataType)
    setPieChartDataType(DataType)
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
              window.location.href = '/admin/layout-list'
            }}
          >
            뒤로가기
          </Button>
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
          // console.log('[ Get Data Connection Info ] : ')
          // console.log(dataInfo)
          // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
          // getDataBySelctedCompany(dataInfo, WidgetInfo)
          getTagList()
        }}
        setTagInfo={(TagInfo: any) => {
          // console.log('----------------------------')
          // console.log('[ Get Tag Info ] : ')
          // console.log(TagInfo)
          // console.log('----------------------------')
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
        DataType={getDataType}
        ChartType={WidgetInfo}
        PieChartLayout={getPieChartLayout}
        PieChartData={getPieChartData}
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
        {/* <div className="addContainer">
          <ButtonComponent id="add" cssClass="e-info" onClick={btnClick.bind(this)}>
            Add Panel
          </ButtonComponent>
        </div> */}
        <div className="col-lg-8 control-section" id="control_dash">
          <div className="content-wrapper" style={{ maxWidth: '100%' }}>
            <DashboardLayoutComponent
              id="api_dashboard"
              // resize={(e: any) => onResize(e)}
              // resizeStart={(e: any) => onResizeStart(e)}
              resizeStop={(e: any) => onResizeStop(e)}
              cellSpacing={cellSpacing}
              allowFloating={false}
              allowResizing={false}
              allowDragging={false}
              // draggableHandle={'.e-panel-header'}
              // created={onCreate.bind(this)}
              onClick={(e: any) => {
                ClickDashBoardComponent(e)
              }}
              columns={8}
              ref={(scope: any) => {
                ;(dashboardObj as any) = scope
                setRender(scope)
              }}
              // change={(e: any) => {
              //   console.log(' [ onChange ] : ')
              //   console.log(e)
              //   console.log(e.removedPanels)
              //   console.log(e.removedPanels.parentObj)
              //   console.log('>>>>>>>>>>>>>>>>>>>>')
              // }}
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
      </div>
    </>
  )
}
export default PredefinedLayouts
