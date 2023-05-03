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

  const [BoxTitleDisabled, setBoxTitleDisabled] = React.useState<any>()

  const [PanelElement, setPanelElement] = React.useState<any>()

  const [DashboardObj, setDashboardObj] = React.useState<any>()
  const [idx, setIdx] = React.useState<any>(0)

  const [render, setRender] = React.useState(null)

  const [arr, setArr] = React.useState<any>([])

  const [defaultTitle, setDefaultTitle] = React.useState('타이틀')

  const [SaveTagDataList, setSaveTagDataList] = React.useState<any>([
    {
      type: 'Time Series',
      tag_data: [],
    },
    {
      type: 'Pie',
      tag_data: [],
    },
    {
      type: 'Bar',
      tag_data: [],
    },
    {
      type: 'Line',
      tag_data: [],
    },
    {
      type: 'Table',
      tag_data: [],
    },
  ])

  const [updateTag, setUpdateTag] = React.useState<any>()

  const [PieChartDataType, setPieChartDataType] = React.useState<string>('max')

  const [SaveDashboardInfo, setSaveDashboardInfo] = React.useState<any>()

  /**
   * DataGrid
   * **/
  const gridRef = React.useRef<any>([])
  const inputRef = React.useRef<any>([])
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
    let obj: any = new Object()

    obj.rowData = gridApi?.gridOptionsService.gridOptions.rowData
    obj.columnData = gridApi?.gridOptionsService.gridOptions.columnDefs
    Array.push(obj)
    obj = new Object()

    setArr(Array)
  }, [gridApi])

  React.useEffect(() => {
    console.log('###################################')
    console.log('###################################')
    console.log('###################################')
    console.log(SaveTagDataList)
    console.log('###################################')
    console.log('###################################')
    console.log('###################################')
  }, [SaveTagDataList])

  // React.useEffect(() => {
  //   console.log('this!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
  //   console.log('this!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
  //   console.log('this!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
  //   console.log(inputRef.current)

  //   // if (inputRef.current) {
  //   //   inputRef.current.addEventListener('change', (e: any) => console.log(e.target.value))
  //   // }
  // }, [inputRef])

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
  }, [])

  /**
   * DataGrid
   * **/

  React.useEffect(() => {
    // console.log('------- [ State 변경 ] -------')
    // console.log(state)
    // console.log('------------------------------')
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

  let TableRows: any = [
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

  let TableColumns: any = [{ field: 'make', filter: true }, { field: 'model', filter: true }, { field: 'price' }]

  const headerCount = 1
  const panels: any = panelData
  let dashboardObj: DashboardLayoutComponent
  const cellSpacing: number[] = [5, 5]
  let count = 0

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
            getDataList(
              uniqueArr,
              Layoutdata[i].widget_type,
              node,
              JSON.parse(Layoutdata[i].layout_option),
              JSON.parse(Layoutdata[i].data_option)
            )
          } else if (Layoutdata[i].widget_type === 'Bar') {
            getDataList(
              uniqueArr,
              Layoutdata[i].widget_type,
              node,
              JSON.parse(Layoutdata[i].layout_option),
              JSON.parse(Layoutdata[i].data_option)
            )
          } else if (Layoutdata[i].widget_type === 'Pie') {
            const lay_option = JSON.parse(Layoutdata[i].layout_option)
            const data_option = JSON.parse(Layoutdata[i].data_option)
            getDataList(uniqueArr, Layoutdata[i].widget_type, node, lay_option, data_option)
          } else if (Layoutdata[i].widget_type === 'TimeSeries') {
            console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
            console.log('Time Series !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
            console.log(uniqueArr)
            console.log(Layoutdata[i].widget_type)
            console.log(node)
            console.log(JSON.parse(Layoutdata[i].layout_option))
            console.log(JSON.parse(Layoutdata[i].data_option))
            console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
            getDataList(
              uniqueArr,
              Layoutdata[i].widget_type,
              node,
              JSON.parse(Layoutdata[i].layout_option),
              JSON.parse(Layoutdata[i].data_option)
            )
          } else if (Layoutdata[i].widget_type === 'Table') {
            getDataList(
              uniqueArr,
              Layoutdata[i].widget_type,
              node,
              JSON.parse(Layoutdata[i].layout_option),
              JSON.parse(Layoutdata[i].data_option)
            )
          }
        }

        /**
         * 20230502
         * 추후 주석 해제
         * */

        // setTimeout(function () {
        //   const header: any = document.getElementById(panel[j].id).parentElement.children[0].children[0]
        //   let data: any
        //   if (Layoutdata[i].grid_nm === null) {
        //     data = (
        //       <div className="e-header-text">
        //         <input
        //           ref={(el: any) => {
        //             console.log(el)
        //             inputRef.current = el
        //           }}
        //           type={'text'}
        //           value={defaultTitle}
        //           placeholder="타이틀을 입력 해주세요."
        //           id={'input' + i.toString()}
        //           style={{ lineHeight: '0', fontWeight: 'bold' }}
        //         />
        //         <button className="widget-setting-btn"></button>
        //         <button className="grid-setting-btn"></button>
        //         <button className="connection-chart-data"></button>
        //       </div>
        //     )
        //     //{
        //     /* data = <div style={{ lineHeight: '0', fontWeight: 'bold' }}>{'타이틀'}</div> */
        //     //}
        //   } else {
        //     // data = <div>{Layoutdata[i].grid_nm}</div>
        //     data = (
        //       <div className="e-header-text">
        //         <input
        //           ref={(el: any) => {
        //             inputRef.current = el
        //           }}
        //           type={'text'}
        //           value={Layoutdata[i].grid_nm}
        //           placeholder="타이틀을 입력 해주세요."
        //           id={'input' + i.toString()}
        //           style={{ lineHeight: '0', fontWeight: 'bold' }}
        //         />
        //         <button className="widget-setting-btn"></button>
        //         <button className="grid-setting-btn"></button>
        //         <button className="connection-chart-data"></button>
        //       </div>
        //     )
        //   }
        //   ReactDOM.render(data, header)
        // }, 500)
        //주석 해제 끝

        // const header: any = document.getElementById(panel[j].id).parentElement.children[0].children[0]
        // let data: any
        // if (Layoutdata[i].grid_nm === null) {
        //   data = <div style={{ lineHeight: '0', fontWeight: 'bold' }}>{'타이틀'}</div>
        // } else {
        //   data = <div>{Layoutdata[i].grid_nm}</div>
        // }
        // ReactDOM.render(data, header)
      }
    }
  }

  React.useEffect(() => {
    if (SelectTagInfo !== undefined) {
      const ReDrawData: any = []
      const x: Date[] = []
      const y: any[] = []

      console.log('-------------------------------------------------')
      console.log('[ Data Connection Widget Info ] >>> ' + WidgetInfo)
      console.log('BoxTargetId >>>>>  ', BoxTargetId)
      console.log('-------------------------------------------------')

      getDataBySelctedCompany('Dongwon', SelectTagInfo, WidgetInfo, BoxTargetId)
    }
  }, [SelectTagInfo])

  React.useEffect(() => {
    if (DashboardObj !== undefined) {
      if (window.localStorage.getItem('SelectedDashboardInfo') !== 'new') {
        console.log(dashboardObj)
        const Layoutdata: any = JSON.parse(window.localStorage.getItem('SelectedDashboardInfo'))
        console.log('Layout Data >>>>')
        console.log(Layoutdata)
        setIdx(Layoutdata[0].grid_id)
        const index = Number(Layoutdata[0].grid_id)
        dispatch({ type: 'GRID_ID', data: index })
        const panel: any = Object.keys(panels[index]).map((panelIndex: string) => {
          return panels[index][panelIndex]
        })
        // console.log('Panel Data >>>>')
        // console.log(panel)

        let panelModelValue: PanelModel = {}
        const updatePanels: PanelModel[] = []

        for (let i = 0, len = panel.length; i < len; i++) {
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

        setTimeout(function () {
          SelectedDashboardWidgetData(Layoutdata, panel)
        }, 500)
        // SelectedDashboardWidgetData(Layoutdata)
      } else {
        setTimeout(function () {
          AddGridGauid(DashboardObj, idx)
        }, 500)
      }
    }
  }, [DashboardObj, idx])

  //data 불러오기
  const getDataList = (TagList: any, WidgetInfo: string, node: any, layout_option: any, data_option: any) => {
    // const TagData: any = []
    // console.log(TagList)
    // for (let i = 0, len = TagList.length; i < len; i++) {
    //   TagData.push(TagList[i].tag)
    // }

    console.log('[ Tag Data ] : ')
    console.log(WidgetInfo)
    console.log(TagList)
    console.log(layout_option)
    console.log(data_option)

    if (WidgetInfo === 'Table' || WidgetInfo === 'Pie' || WidgetInfo === 'Bar') {
      axios
        .post(process.env.REACT_APP_API_SERVER_URL + '/api/tag/describe', TagList)
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
            data[0].labels = labels
            data[0].values = values

            setPieChartDataOption(data)
            setPieChartLayoutOption(layout)

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

            setBarChartDataOption(data)
            setBarChartLayoutOption(layout)

            DrawGauidWidget(WidgetInfo, node, data, layout)
          }
        })
        .catch((error) => {
          console.log(error)

          alert('Error. 담당자에게 문의 바랍니다.')
        })
    } else {
      console.log('>>>>>>>>>>>>>>> Widget Info >>>>>>>>>>>>>>>>>>>')
      console.log(WidgetInfo)
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
      axios
        .post(process.env.REACT_APP_API_SERVER_URL + '/api/hmid/chartData?', TagList)
        .then((response) => {
          console.log('Time Sreies!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
          console.log('[ Chart response data ] : ')
          console.log(response.data)

          if (WidgetInfo === 'TimeSeries') {
            layout_option[0].title = '선택한 Tag의 Data'
            setTimeSeriesDataOption(response.data)
            setTimeSeriesLayoutOption(layout_option[0])
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

    dispatch({ type: 'GRID_ID', data: index })
    setIdx(index)

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
    setDashboardObj(dashboardObj.panels)
    setIdx(index)
  }, [])

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
        <DataGridWrap className={Theme}>
          <AgGridReact
            api={gridApi}
            onGridReady={(e: GridReadyEvent) => {
              // console.log('grid Ready')
              // console.log(e)
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
            DrawGauidWidget(panel[j].widget, node, args, BarChartLayoutOption)
          })
        } else if (panel[j].widget === 'Pie') {
          setWidgetInfo('Pie')
          const result: any = ChangePieDataArr(PieChartDataOption)
          result.then(function (args: any) {
            DrawGauidWidget(panel[j].widget, node, args, JSON.parse(PieChartLayoutOption))
          })
        } else if (panel[j].widget === 'TimeSeries') {
          setWidgetInfo('Time Series')
          const result: any = ChangeTimeSeriesDataArr(TimeSeriesDataOption)
          result.then(function (args: any) {
            DrawGauidWidget(panel[j].widget, node, args, TimeSeriesLayoutOption)
          })
        } else if (panel[j].widget === 'Table') {
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

      console.log('$$$$$$$$$$ use Effect $$$$$$$$$$$$$$$')
      console.log(GridInfo)
      console.log(dashboardObj)
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

        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
        console.log(ChartLayoutOption)
        console.log(ChartDataOption)
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')

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
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
    console.log(WidgetInfo)
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
    if (WidgetInfo === 'Line') {
      const result: any = ChangeLineDataArr(LineChartDataOption)
      result.then(function (args: any) {
        console.log(JSON.stringify(args))
        DrawPlotlyChart(LineChartLayoutOption, args, BoxTargetId)
      })
    }
    if (WidgetInfo === 'Pie') {
      const result: any = ChangePieDataArr(PieChartDataOption)
      result.then(function (args: any) {
        DrawPlotlyChart(PieChartLayoutOption, args, BoxTargetId)
      })
    }
    if (WidgetInfo === 'Bar') {
      const result: any = ChangeBarDataArr(BarChartDataOption)
      const bar_data: any = []
      console.log(result)
      console.log(BarChartLayoutOption)
      result.then(function (args: any) {
        delete args[0].x
        delete args[0].y

        const newArray = args.reduce(function (prev: any, next: any) {
          return prev.concat(next)
        })

        for (const i in newArray) {
          console.log(newArray[i])
          bar_data.push(newArray[i])
        }

        DrawPlotlyChart(BarChartLayoutOption, bar_data, BoxTargetId)
      })
    }
    if (WidgetInfo === 'Time Series') {
      const result: any = ChangeTimeSeriesDataArr(TimeSeriesDataOption)
      result.then(function (args: any) {
        DrawPlotlyChart(TimeSeriesLayoutOption, args, BoxTargetId)
      })
    }

    if (WidgetInfo === 'Table') {
      if (BoxTargetId !== undefined) {
        const node: any = document.getElementById(BoxTargetId)

        const data = (
          <DataGridWrap className={Theme}>
            <AgGridReact
              ref={(el: any) => {
                gridRef.current = el
              }}
              rowData={TableRows}
              columnDefs={TableColumns}
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

  /*** 빵윤희 */
  React.useEffect(() => {
    console.log(PieChartDataOption)
    console.log(PieChartLayoutOption)
    console.log(WidgetInfo)
    console.log(BoxTargetId)

    if (WidgetInfo === 'Pie') {
      const result: any = ChangePieDataArr(PieChartDataOption)
      result.then(function (args: any) {
        DrawPlotlyChart(PieChartLayoutOption, args, BoxTargetId)
      })
    }
  }, [PieChartLayoutOption, PieChartDataOption])

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
    dashboardObj.removeAll()
  }

  React.useEffect(() => {
    console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&')
    console.log('[ idx ] : ' + idx)
    console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&')
  }, [idx])

  // 그리드 레이아웃 선택 시 그리드 다시 그림
  async function initializeTemplate(element: any, dashboardObj: any) {
    let panelModelValue: PanelModel = {}
    const updatePanels: PanelModel[] = []
    const index: number = parseInt(element.getAttribute('data-id'), 10) - 1
    setIdx(index)
    console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%')
    console.log(index)
    console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%')

    dispatch({ type: 'GRID_ID', data: index })
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
   * 2023-04-28 박윤희
   * 대시보드 버튼 Click Evt
   * 코드 최적화 작업 중 ...
   */
  const ClickDashBoardComponent = (e: any) => {
    if (e.target.id.length === 0 && typeof e.target.className !== 'object') {
      if (e.target.className.includes('grid-setting-btn')) {
        const data = e.target.offsetParent.offsetParent.children[0].childNodes[1].childNodes[0].data
        let autoRange: any = null
        if (e.target.offsetParent.offsetParent.children[0].childNodes[1].childNodes[0].layout.xaxis !== undefined) {
          autoRange = e.target.offsetParent.offsetParent.children[0].childNodes[1].childNodes[0].layout.xaxis.autorange
        }
        const id = e.target.offsetParent.offsetParent.children[0].childNodes[1].id
        const type = e.target.offsetParent.offsetParent.children[0].childNodes[1].childNodes[0].data[0].type
        if (data !== undefined) {
          if (autoRange === false) {
            setLineChartShowDrawer(true)
            setWidgetInfo('Line')
            setBoxTargetId(id)
          } else if (type === 'pie') {
            setPieChartShowDrawer(true)
            setWidgetInfo('Pie')
            setBoxTargetId(id)
          } else if (type === 'bar') {
            setBarChartShowDrawer(true)
            setWidgetInfo('Bar')
            setBoxTargetId(id)
          } else if (autoRange === true) {
            setTimeSeriesShowDrawer(true)
            setWidgetInfo('Time Series')
            setBoxTargetId(id)
          }
        } else {
          const className = e.target.offsetParent.offsetParent.children[0].childNodes[1].childNodes[1].className
          const id = e.target.offsetParent.offsetParent.children[0].childNodes[1].id
          if (className !== undefined) {
            if (className.includes('ag')) {
              setWidgetInfo('Table')
              setBoxTargetId(id)
            }
          }
          setAlertVisibility(false)
        }
      } else if (e.target.className.includes('connection-chart-data')) {
        const className = e.target.offsetParent.offsetParent.children[0].children[1].children[0].className
        if (className !== undefined) {
          if (className !== 'js-plotly-plot') {
            const box_target_id = e.target.offsetParent.offsetParent.children[0].childNodes[1].id
            setBoxTargetId(box_target_id)
            setWidgetInfo('Table')
            setIsOpenDataConnectionModal(true)
          } else {
            const chart_type = e.target.offsetParent.offsetParent.children[0].childNodes[1].childNodes[0].data[0].type
            let chart_type2: any = null
            if (e.target.offsetParent.offsetParent.children[0].childNodes[1].childNodes[0].data[0][0] !== undefined) {
              chart_type2 = e.target.offsetParent.offsetParent.children[0].childNodes[1].childNodes[0].data[0][0].type
            }
            const box_target_id = e.target.offsetParent.offsetParent.children[0].childNodes[1].id
            console.log('##############################################################')
            console.log('##############################################################')
            console.log(e)
            if (chart_type === 'bar') {
              setWidgetInfo('Bar')
            }
            if (chart_type === 'pie') {
              setWidgetInfo('Pie')
            }
            if (chart_type === 'scatter' || chart_type2 === 'scatter') {
              const rangeSlider =
                e.target.offsetParent.offsetParent.children[0].childNodes[1].childNodes[0].layout.xaxis.rangeslider
              console.log('##############################################################')
              console.log('##############################################################')
              console.log(chart_type)
              console.log(rangeSlider)
              console.log('##############################################################')
              console.log('##############################################################')

              if (rangeSlider === undefined) {
                setWidgetInfo('Line')
              } else {
                setWidgetInfo('Time Series')
              }
            }

            setBoxTargetId(box_target_id)
            setIsOpenDataConnectionModal(true)
          }
        }
      } else if (e.target.className.includes('widget-setting-btn')) {
        const box_target_id = e.target.offsetParent.offsetParent.children[0].children[1].id
        setIsOpenWidgetModal(true)
        console.log(e)
        //box target id 값 가져오기
        setBoxTargetId(box_target_id)
      }
      //}
    }
    // else {
    //   if (e.target.id === 'predefine_dashboard' || e.target.id.includes('input')) {
    //   } else if (e.target.nodeName === 'INPUT') {
    //     const id = e.target.id
    //   }
    // }
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
      .post(process.env.REACT_APP_API_SERVER_URL + '/api/tag/list', params)
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
  const getWidgetSelectTagList = (WidgetType: string, id: string) => {
    console.log('******************************* get Widget Select Tag List *******************************')
    console.log(WidgetType)
    console.log(SaveTagDataList)
    console.log('[ id ] >> ')
    console.log(id)
    console.log(typeof id)
    console.log('******************************************************************************************')
    let tag_list_result: any = []

    if (window.localStorage.getItem('SelectedDashboardInfo') !== 'new') {
      for (let i = 0, len = SaveTagDataList.length; i < len; i++) {
        console.log(WidgetType)
        console.log(SaveTagDataList[i].type)
        if (WidgetType === SaveTagDataList[i].type) {
          for (let k = 0, len = SaveTagDataList[i].tag_data.length; k < len; k++) {
            if (SaveTagDataList[i].tag_data[k].length != 0) {
              if (SaveTagDataList[i].tag_data[k][0].id.split('_')[0] === id) {
                console.log('[ Element 요소 ] >> ')
                console.log(SaveTagDataList[i].tag_data[k][0].id)
                tag_list_result = SaveTagDataList[i].tag_data[k][0].tag_list
              } else {
                const prev_data: any = JSON.parse(window.localStorage.getItem('SelectedDashboardInfo'))
                for (let j = 0, len = prev_data.data.length; j < len; j++) {
                  if (prev_data.data[j].grid_index === id) {
                    tag_list_result = prev_data.data[j]
                  }
                }
              }
            }
          }
        }
        // setSaveTagDataList
      }
    } else {
      console.log('new !!!!!!!')
      for (let i = 0, len = SaveTagDataList.length; i < len; i++) {
        console.log(WidgetType)
        console.log(SaveTagDataList[i].type)
        console.log(SaveTagDataList)
        if (WidgetType === SaveTagDataList[i].type) {
          for (let k = 0, len = SaveTagDataList[i].tag_data.length; k < len; k++) {
            if (SaveTagDataList[i].tag_data[k].length != 0) {
              if (SaveTagDataList[i].tag_data[k][0].id.split('_')[0] === id) {
                console.log('[ Element 요소 ] >> ')
                console.log(SaveTagDataList[i].tag_data[k][0].id)
                tag_list_result = SaveTagDataList[i].tag_data[k][0].tag_list
              }
            }
          }
        }
        // setSaveTagDataList
      }
    }

    console.log('****************** get Tag List ***********************')
    console.log(tag_list_result)
    console.log('*******************************************************')

    return tag_list_result
  }

  const getDataBySelctedCompany = (company: string, TagList: any, WidgetInfo: string, BoxTargetId: string) => {
    if (company === 'Dongwon') {
      const TagString = ''

      setShowLoading(true)

      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
      console.log(' DataBy Selected Company')
      console.log(WidgetInfo)
      console.log(dashboardObj)
      console.log(TagList)
      console.log(BoxTargetId)
      console.log(idx)

      const panel: any = Object.keys(panels[idx]).map((panelIndex: string) => {
        return panels[idx][panelIndex]
      })

      console.log(panel)
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')

      const obj_test: any = new Object()
      const arr_test: any = []
      const result: any = []

      for (let i = 0, len = panel.length; i < len; i++) {
        if (i === Number(BoxTargetId.split('_')[0])) {
          obj_test.widget = WidgetInfo
          obj_test.tag_list = TagList
          obj_test.id = BoxTargetId
          arr_test.push(obj_test)
        }
      }

      const data = SaveTagDataList
      setSaveTagDataList([
        {
          type: 'Time Series',
          tag_data: [],
        },
        {
          type: 'Pie',
          tag_data: [],
        },
        {
          type: 'Bar',
          tag_data: [],
        },
        {
          type: 'Line',
          tag_data: [],
        },
        {
          type: 'Table',
          tag_data: [],
        },
      ])

      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
      console.log(dashboardObj)
      console.log('[ arr ] >>> ')
      console.log(arr_test)
      console.log(SaveTagDataList)
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')

      //태그 리스트 저장
      for (let i = 0, len = SaveTagDataList.length; i < len; i++) {
        if (WidgetInfo === data[i].type) {
          if (data[i].tag_data.length !== 0) {
            for (let j = 0, len = data[i].tag_data.length; j < len; j++) {
              if (data[i].tag_data[j][0].id === BoxTargetId) {
                data[i].tag_data[j][0] = arr_test
              } else {
                console.log('match !!!!!!!!!!!!')
                console.log(WidgetInfo)
                console.log(data[i].type)
                data[i].tag_data.push(arr_test)
              }
            }
          } else {
            console.log('match2222222222222 !!!!!!!!!!!!')
            console.log(WidgetInfo)
            console.log(data[i].type)
            data[i].tag_data.push(arr_test)
          }
        } else {
          for (let j = 0, len = data[i].tag_data.length; j < len; j++) {
            if (data[i].tag_data[j][0].id === BoxTargetId) {
              data[i].tag_data[j] = []
            }
          }
        }
        // setSaveTagDataList
      }

      console.log('result >????????????????????????')
      console.log(data)
      setSaveTagDataList(data)

      if (WidgetInfo === 'Table' || WidgetInfo === 'Pie' || WidgetInfo === 'Bar') {
        console.log('[ get Tag Describe Data ] : ')
        console.log(TagList)
        console.log(BoxTargetId)

        axios
          .post(process.env.REACT_APP_API_SERVER_URL + '/api/tag/describe', TagList)
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

              TableRows = row
              TableColumns = column

              DrawGauidWidget('Table', node, row, column)

              setTagListArr([])
            }
            if (WidgetInfo === 'Pie') {
              const labels: any = []
              const values: any = []

              let data = PieChartDataOption
              const layout = JSON.parse(PieChartLayoutOption)

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

              setPieChartLayoutOption(layout)
              setPieChartDataOption(data)

              DrawGauidWidget('Pie', node, data, layout)
              console.log(TagListArr)
              setTagListArr([])
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

                console.log('>>>>>>>>>>>>> [ Bar Data Obj ] >>>>>>>>>>>>>>>>')
                console.log(dataObj)
                console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
                dataObj.type = 'bar'
                dataObj.textposition = 'auto'
                dataObj.x = dataX
                dataObj.y = dataY

                data.push(dataObj)
                dataObj = new Object()
                dataX = []
                dataY = []
              }

              console.log('------------------ [ Draw Bar Chart ] ---------------------')
              console.log(layout)
              console.log(data)
              console.log('-----------------------------------------------------------')

              setBarChartLayoutOption(layout)
              setBarChartDataOption(data)

              DrawGauidWidget('Bar', node, data, layout)
              setTagListArr([])
            }
          })
          .catch((error) => {
            console.log(error)

            alert('Error. 담당자에게 문의 바랍니다.')
            setShowLoading(false)
          })
      } else {
        const node = document.getElementById(BoxTargetId)

        axios
          .post(process.env.REACT_APP_API_SERVER_URL + '/api/hmid/chartData?', TagList)
          .then((response) => {
            console.log('[ Chart response data ] : ')
            console.log(response.data)

            if (WidgetInfo === 'Time Series') {
              const layout: any = TimeSeriesLayoutOption
              layout.title = '선택한 Tag의 Data'

              setTimeSeriesDataOption(response.data)
              setTimeSeriesLayoutOption(layout)

              DrawGauidWidget('TimeSeries', node, response.data, layout)
            } else if (WidgetInfo === 'Line') {
              const dataObj: any = new Object()
              const layout: any = LineChartLayoutOption
              layout.title = '선택한 Tag들의 Data'

              setLineChartLayoutOption(layout)
              setLineChartDataOption(response.data)

              DrawGauidWidget('Line', node, response.data, layout)
            }
            setShowLoading(false)
            setTagListArr([])
          })
          .catch((error) => {
            console.log(error)

            alert('Error. 담당자에게 문의 바랍니다.')
            setShowLoading(false)
          })
      }
    }
  }

  //layoutlist api 연결
  const getLayoutList = () => {
    console.log(window.localStorage.getItem('companyId'))
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
        console.log(response.data.length)

        SaveLayoutImage(localStorage.getItem('companyId'), response.data[Number(response.data.length) - 1].lay_id)
      })
      .catch((error) => {
        console.log(error)
      })
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

    let params: any = new Object()

    if (window.localStorage.getItem('SelectedDashboardInfo') === 'new') {
      console.log('새로 만드는 Dashboard')
      params = {
        com_id: localStorage.getItem('companyId'),
        // lay_id: Number(window.localStorage.getItem('layout_id')) + 1,
        lay_name: state.LAYOUT_NAME,
        grid_id: idx.toString(),
        data: args,
      }

      axios
        .post(process.env.REACT_APP_API_SERVER_URL + '/api/hmid/layout', params)
        .then((response) => {
          console.log('[ SaveDashboard Response Data ] : ')
          console.log(response.data)

          if (response.data.detail === 'success') {
            alert('레이아웃 저장이 완료 되었습니다.')

            getLayoutList()
          }
        })
        .catch((error) => {
          console.log(error)
          alert('오류. 관리자에게 문의 바랍니다.')
        })
    } else {
      console.log('기존 대시보드 update')
      params = {
        com_id: localStorage.getItem('companyId'),
        lay_id: Number(window.localStorage.getItem('layout_id')),
        lay_name: state.LAYOUT_NAME,
        grid_id: idx.toString(),
        data: args,
      }

      console.log(params)

      axios
        .put(process.env.REACT_APP_API_SERVER_URL + '/api/hmid/layout', params)
        .then((response) => {
          console.log('[ Update Dashboard Response Data ] : ')
          console.log(response.data)

          if (response.data.detail === 'success') {
            alert('레이아웃 업데이트가 완료 되었습니다.')

            SaveLayoutImage(localStorage.getItem('companyId'), Number(window.localStorage.getItem('layout_id')))
          }
        })
        .catch((error) => {
          console.log(error)
          alert('업데이트 오류. 관리자에게 문의 바랍니다.')
        })
    }

    console.log(params)
    console.log(JSON.stringify(params))
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
      let id: any = ''
      if (window.localStorage.getItem('SelectedDashboardInfo') === 'new') {
        id = lay_id
      } else {
        id = lay_id
      }
      const myfile = new File([blob], id + '.png', { type: 'image/png', lastModified: new Date().getTime() })
      formData.append('com_id', window.localStorage.getItem('companyId'))
      if (window.localStorage.getItem('SelectedDashboardInfo') === 'new') {
        formData.append('lay_id', lay_id)
      } else {
        formData.append('lay_id', lay_id)
      }
      formData.append('file', myfile)

      console.log(myfile)
    })

    file.then(function (result: any) {
      console.log('Promise File then')
      console.log(result)
      // FormData의 key 확인
      axios
        .post(process.env.REACT_APP_API_SERVER_URL + '/api/hmid/layout/img', formData)
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
      if (window.localStorage.getItem('SelectedDashboardInfo') === 'new') {
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

          console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
          console.log(grid_arr)
          setOpenSaveLayout(false)

          SaveDashboard(grid_arr)
        }
        console.log(localStorage.getItem('companyId'))
      } else {
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
        console.log(window.localStorage.getItem('SelectedDashboardInfo'))
        console.log(JSON.parse(window.localStorage.getItem('SelectedDashboardInfo')))
        console.log(JSON.parse(window.localStorage.getItem('SelectedDashboardInfo'))[0].grid_id)
        console.log('[ 업데이트 선택 한 경우 ! ] ')
        console.log(dashboardObj)

        let grid_obj: any = new Object()
        const grid_arr: any = []
        const data: any = dashboardObj

        for (let i = 0, len = dashboardObj.element.children.length; i < len; i++) {
          if (dashboardObj.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0] !== undefined) {
            // console.log(dashboardObj.element.children[i].childNodes[0].childNodes[1].childNodes[0])
            grid_obj.grid_index = Number(dashboardObj.element.children[i].id)

            if (data.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0].layout !== undefined) {
              // console.log(data.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0].layout)
              // console.log(data.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0].data)
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
                    console.log('time series !!!!!!!!!')
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
                    console.log(tag_arr)
                    grid_obj.tag_list = tag_arr
                    // grid_obj.tag_list = getWidgetSelectTagList(grid_obj.widget_type, data.element.childNodes[i].id)
                  }
                } else {
                  console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&')
                  console.log(data.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0].layout)
                  console.log(data.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0].data[0].type)
                  console.log(data.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0].layout.xaxis)
                  console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&')

                  if (data.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0].data[0].type === 'bar') {
                    grid_obj.widget_type = 'Bar'
                    const input_element: any = document.querySelector('#input' + i)
                    grid_obj.grid_nm = input_element.value
                    grid_obj.width = data.element.childNodes[i].childNodes[0].childNodes[1].offsetWidth
                    grid_obj.height = data.element.childNodes[i].childNodes[0].childNodes[1].offsetHeight

                    const BarChartDataOption: any =
                      data.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0].data

                    console.log('Bar !!!!')
                    console.log(BarChartDataOption)

                    const tag_arr: any = []
                    for (let i = 0, len = BarChartDataOption.length; i < len; i++) {
                      for (let j = 0, len = BarChartDataOption[i].x.length; j < len; j++) {
                        tag_arr.push(BarChartDataOption[i].x[j])
                      }
                    }
                    console.log(tag_arr)
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
                    console.log('[ Pie !!!!!!!!!!!!! ]')

                    const PieChartDataOption: any =
                      data.element.childNodes[i].childNodes[0].childNodes[1].childNodes[0].data

                    let tag_arr: any = []
                    for (let i = 0, len = PieChartDataOption.length; i < len; i++) {
                      tag_arr = PieChartDataOption[i].labels
                    }
                    console.log(tag_arr)
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
                    console.log(tag_arr)
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
              console.log('Table !!!!!!!!!!!!!')
              console.log(data)
              const input_element: any = document.querySelector('#input' + i)
              grid_obj.grid_nm = input_element.value
              grid_obj.width = data.element.childNodes[i].childNodes[0].childNodes[1].offsetWidth
              grid_obj.height = data.element.childNodes[i].childNodes[0].childNodes[1].offsetHeight
              grid_obj.layout_option = []
              grid_obj.data_option = []

              console.log('#############################################################')
              grid_obj.tag_list = getWidgetSelectTagList(grid_obj.widget_type, data.element.childNodes[i].id)
              console.log(grid_obj.tag_list)

              console.log(grid_obj)
              console.log('###############################################################')
              grid_arr.push(grid_obj)
              grid_obj = new Object()
            }

            console.log(grid_obj)
            grid_arr.push(grid_obj)
            grid_obj = new Object()
          }
        }
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>')
        console.log(grid_arr)
        console.log(window.localStorage.getItem('SelectedDashboardInfo'))
        console.log(state.LAYOUT_NAME)
        console.log(idx)
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>')
        setOpenSaveLayout(false)

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
            console.log('>>>>>>>>>>>>> grid info >>>>>>>>>>>>>>>>>>>>')
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
            id="design_button"
            leftIcon={<MdOutlineGridView />}
            variant="brand"
            onClick={() => {
              window.location.href = '/admin/layout-list'
            }}
            style={{ backgroundColor: '#4338F7', borderRadius: '100px' }}
          >
            Back
          </Button>
          <Button
            id="design_button"
            leftIcon={<MdOutlineGridView />}
            variant="brand"
            onClick={() => {
              setOpenLayoutModal(true)
            }}
            style={{ backgroundColor: '#4338F7', borderRadius: '100px' }}
          >
            Grid
          </Button>
          <Button
            id="design_button"
            leftIcon={<MdOutlineRestartAlt />}
            variant="brand"
            onClick={() => {
              setGridInformation('reset')
            }}
            style={{ backgroundColor: '#4338F7', borderRadius: '100px' }}
          >
            Reset
          </Button>
          <Button
            id="design_button"
            leftIcon={<MdSave />}
            variant="brand"
            onClick={() => {
              setOpenSaveLayout(true)
            }}
            style={{ backgroundColor: '#4338F7', borderRadius: '100px' }}
          >
            Save
          </Button>
          {/* <Button
            leftIcon={<MdOutlineRestartAlt />}
            style={{ backgroundColor: realTimeBtnColor, color: realTimeBtnFont }}
            onClick={() => {
              setRealTimeBtnColor('#00ae2f')
            }}
          >
            실시간 데이터
          </Button> */}
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
