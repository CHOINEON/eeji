/**
 * INFINITE OPTIMAL
 * 메뉴 : HMI Designer - GridLayout
 * 시작 날짜 : 2023-03-10
 * 최종 수정 날짜 : 2023-04-06
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
import { panelData } from '../data/panel-data'
import Plot from 'react-plotly.js'

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
import * as RecoilLineAtoms from '../recoil/line/atoms'
import { CompanyId, LayoutTitle } from '../recoil/base/atoms'

const DataGridWrap = styled.div`
  width: 100%;
  height: calc(100% - 1.1vw);
`

export const PredefinedLayouts: React.FC = () => {
  //atom
  const setShowWidgetModal = useSetRecoilState(RecoilAtoms.ShowWidgetModalState)
  const [LineDataOption, setLineDataOption] = useRecoilState(RecoilLineAtoms.LineChartDataOptionState)
  const [LineLayoutOption, setLineLayoutOption] = useRecoilState(RecoilLineAtoms.LineChartLayoutOptionState)
  const [TimeSeriesDataOption, setTimeSeriesDataOption] = useRecoilState(RecoilAtoms.TimeSeriesChartDataOptionState)
  const [TimeSeriesLayoutOption, setTimeSeriesLayoutOption] = useRecoilState(
    RecoilAtoms.TimeSeriesChartLayoutOptionState
  )
  const [gridInformation, setGridInformation] = useRecoilState(RecoilAtoms.GridInformationState)
  const [gridDataObj, setGridDataObj] = useRecoilState(RecoilAtoms.GridDataObjState)
  const [showLoading, setShowLoading] = useRecoilState(RecoilAtoms.ShowLoadingState)
  const [tagListArr, setTagListArr] = useRecoilState(RecoilAtoms.TagListArrState)
  const [widgetInfo, setWidgetInfo] = useRecoilState(RecoilAtoms.WidgetInfoState)
  const [boxTargetId, setBoxTargetId] = useRecoilState(RecoilAtoms.BoxTargetIdState)
  const [panelIdx, setPanelIdx] = useRecoilState(RecoilAtoms.PanelIdxState)

  const setOpenSaveLayoutModal = useSetRecoilState(RecoilAtoms.OpenSaveLayoutModalState)
  const setDataConnectionModal = useSetRecoilState(RecoilAtoms.ShowConnectionDataState)
  const setAlertMessage = useSetRecoilState(RecoilAtoms.AlertMessageState)
  const setShowAlertModal = useSetRecoilState(RecoilAtoms.AlertModalState)
  const SelectTagInfo = useRecoilValue(RecoilAtoms.SelectTagInfoState)
  const companyId = useRecoilValue(CompanyId)
  const layoutTitle = useRecoilValue(LayoutTitle)

  //보류
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

  const gridRef = React.useRef<any>([])
  const defaultColDef = React.useMemo<ColDef>(() => {
    return {
      flex: 1,
      editable: true,
    }
  }, [])

  //theme color mode
  const dashboardBoxColor = Chakra.useColorModeValue('white', 'dark')

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

  const panels: any = panelData
  let dashboardObj: ej2.DashboardLayoutComponent
  const cellSpacing: number[] = [5, 5]

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

  React.useEffect(() => {
    if (SelectTagInfo !== undefined) {
      getDataBySelctedCompany('Dongwon', SelectTagInfo, widgetInfo, boxTargetId)
    }
  }, [SelectTagInfo])

  /**
   * 2023-05-25 박윤희
   * 코드 필요성 확인
   */
  React.useEffect(() => {
    if (gridDataObj !== undefined) {
      if (window.localStorage.getItem('SelectedDashboardInfo') !== 'new') {
        const Layoutdata: any = JSON.parse(window.localStorage.getItem('SelectedDashboardInfo'))

        setPanelIdx(Layoutdata[0].grid_id)
        const index = Number(Layoutdata[0].grid_id)
        const panel: any = Object.keys(panels[index]).map((panelIndex: string) => {
          return panels[index][panelIndex]
        })

        let panelModelValue: ej2.PanelModel = {}
        const updatePanels: ej2.PanelModel[] = []

        for (let i = 0, len = panel.length; i < len; i++) {
          panelModelValue = {
            id: i.toString(),
            row: panel[i].row,
            col: panel[i].col,
            sizeX: panel[i].sizeX,
            sizeY: panel[i].sizeY,
            header: `
            <div class="e-header-text">
              <input value=${' '} placeholder="타이틀을 입력 해주세요." id=${'input' + i.toString()}
              > 
              <button class="widget-setting-btn"></button>
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
          그리기함수.AddGridGauid(gridDataObj, panelIdx)
        }, 500)
      }
    }
  }, [gridDataObj, panelIdx])

  //레이아웃 만들 경우 default값 나타내기
  // default???? 생각해보기 initializeTemplate 있음
  React.useEffect(() => {
    let panelModelValue: ej2.PanelModel = {}
    const updatePanels: ej2.PanelModel[] = []
    const index = 0
    const panel: any = Object.keys(panels[index]).map((panelIndex: string) => {
      return panels[index][panelIndex]
    })

    setPanelIdx(index)

    for (let i = 0; i < panel.length; i++) {
      panelModelValue = {
        id: i.toString(),
        row: panel[i].row,
        col: panel[i].col,
        sizeX: panel[i].sizeX,
        sizeY: panel[i].sizeY,
        header: `
        <div class="e-header-text">
          <input value=${' '}  placeholder="타이틀을 입력 해주세요." id=${'input' + i.toString()}
          > 
          <button class="widget-setting-btn"></button>
          <button class="connection-chart-data"></button>
        </div>
        <div class="header-border"></div>`,
        content: '<div class="panel-content ${dashboardBoxColor}">Content Area</div>',
      }
      updatePanels.push(panelModelValue)
    }

    dashboardObj.panels = updatePanels
    setGridDataObj(dashboardObj.panels)
    setPanelIdx(index)
  }, [])

  //grid 선택해서 레이아웃 변경 한 경우
  React.useEffect(() => {
    if (gridInformation !== undefined) {
      // updateSampleSection()
      rendereComplete(gridInformation)
    }
  }, [dashboardObj, gridInformation])

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

  //굳이??????????????
  React.useEffect(() => {
    if (widgetInfo === 'Line') {
      const result: any = 가공함수.ChangeLineDataArr(LineDataOption)
      result.then(function (args: any) {
        DrawPlotlyChart(LineDataOption, args, boxTargetId)
      })
    }
    /**
     * 박윤희
     * 2023-05-25 삭제 검토 중
     * */
    // if (widgetInfo === 'Pie') {
    //   const result: any = 가공함수.ChangePieDataArr(PieChartDataOption)
    //   result.then(function (args: any) {
    //     DrawPlotlyChart(PieChartLayoutOption, args, BoxTargetId)
    //   })
    // }
    // if (widgetInfo === 'Bar') {
    //   const result: any = 가공함수.ChangeBarDataArr(BarChartDataOption)
    //   const bar_data: any = []

    //   result.then(function (args: any) {
    //     DrawPlotlyChart(BarChartLayoutOption, args, BoxTargetId)
    //   })
    // }
    if (widgetInfo === 'Time Series') {
      const result: any = 가공함수.ChangeTimeSeriesDataArr(TimeSeriesDataOption)
      result.then(function (args: any) {
        DrawPlotlyChart(TimeSeriesLayoutOption, args, boxTargetId)
      })
    }

    if (widgetInfo === 'Table') {
      if (boxTargetId !== undefined) {
        const node: any = document.getElementById(boxTargetId)

        const data = (
          <DataGridWrap className={'ag-theme-alpine'}>
            <AgGridReact
              ref={(el: any) => {
                gridRef.current = el
              }}
              rowData={TableRows}
              columnDefs={TableColumns}
              defaultColDef={defaultColDef}
              enableCellChangeFlash={true}
              editType={'fullRow'}
              pagination={true}
              paginationAutoPageSize={true}
            />
          </DataGridWrap>
        )
        ReactDOM.render(data, node)
      }
    }
  }, [widgetInfo])

  /**
   * Reset 버튼 클릭
   */
  function reset(): void {
    dashboardObj.removeAll()
  }

  // 그리드 레이아웃 선택 시 그리드 다시 그림
  async function initializeTemplate(element: any, dashboardObj: any) {
    let panelModelValue: ej2.PanelModel = {}
    const updatePanels: ej2.PanelModel[] = []
    const index: number = parseInt(element.getAttribute('data-id'), 10) - 1
    setPanelIdx(index)

    // dispatch({ type: 'GRID_ID', data: index })
    const panel: any = Object.keys(panels[index]).map((panelIndex: string) => {
      return panels[index][panelIndex]
    })

    // count = panel.length

    for (let i = 0; i < panel.length; i++) {
      panelModelValue = {
        id: i.toString(),
        row: panel[i].row,
        col: panel[i].col,
        sizeX: panel[i].sizeX,
        sizeY: panel[i].sizeY,
        header: `
        <div class="e-header-text">
          <input value=${'타이틀'}  placeholder="타이틀을 입력 해주세요." id=${'input' + i.toString()}
        > 
          <button class="widget-setting-btn"></button>
          <button class="connection-chart-data"></button>
        </div>
        <div class="header-border"></div>`,
        content: '<div class="panel-content ${dashboardBoxColor}">Content Area</div>',
      }
      updatePanels.push(panelModelValue)
    }
    dashboardObj.panels = updatePanels
    setGridDataObj(dashboardObj.panels)

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
            // setLineChartShowDrawer(true)
            setWidgetInfo('Line')
            setBoxTargetId(id)
          } else if (type === 'pie') {
            // setPieChartShowDrawer(true)
            setWidgetInfo('Pie')
            setBoxTargetId(id)
          } else if (type === 'bar') {
            // setBarChartShowDrawer(true)
            setWidgetInfo('Bar')
            setBoxTargetId(id)
          } else if (autoRange === true) {
            // setTimeSeriesShowDrawer(true)
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
        }
      } else if (e.target.className.includes('connection-chart-data')) {
        const className = e.target.offsetParent.offsetParent.children[0].children[1].children[0].className
        if (className !== undefined) {
          if (className !== 'js-plotly-plot') {
            const box_target_id = e.target.offsetParent.offsetParent.children[0].childNodes[1].id
            setBoxTargetId(box_target_id)
            setWidgetInfo('Table')
            // setSettingChartType('Table')
            setDataConnectionModal(true)
          } else {
            const chart_type = e.target.offsetParent.offsetParent.children[0].childNodes[1].childNodes[0].data[0].type
            let chart_type2: any = null
            if (e.target.offsetParent.offsetParent.children[0].childNodes[1].childNodes[0].data[0][0] !== undefined) {
              chart_type2 = e.target.offsetParent.offsetParent.children[0].childNodes[1].childNodes[0].data[0][0].type
            }
            const box_target_id = e.target.offsetParent.offsetParent.children[0].childNodes[1].id

            if (chart_type === 'bar') {
              setWidgetInfo('Bar')
              // setSettingChartType('Bar')
            }
            if (chart_type === 'pie') {
              setWidgetInfo('Pie')
              // setSettingChartType('Pie')
            }
            if (chart_type === 'scatter' || chart_type2 === 'scatter') {
              const rangeSlider =
                e.target.offsetParent.offsetParent.children[0].childNodes[1].childNodes[0].layout.xaxis.rangeslider

              if (rangeSlider === undefined) {
                setWidgetInfo('Line')
                // setSettingChartType('Line')
              } else {
                setWidgetInfo('Time Series')
                // setSettingChartType('Time Series')
              }
            }

            setBoxTargetId(box_target_id)
            setDataConnectionModal(true)
          }
        }
      } else if (e.target.className.includes('widget-setting-btn')) {
        const box_target_id = e.target.offsetParent.offsetParent.children[0].children[1].id
        setDataConnectionModal(true)
        //box target id 값 가져오기
        setBoxTargetId(box_target_id)
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

  // save시 저장할 tag list parameter
  const getWidgetSelectTagList = (WidgetType: string, id: string) => {
    let tag_list_result: any = []

    if (window.localStorage.getItem('SelectedDashboardInfo') !== 'new') {
      for (let i = 0, len = SaveTagDataList.length; i < len; i++) {
        if (WidgetType === SaveTagDataList[i].type) {
          for (let k = 0, len = SaveTagDataList[i].tag_data.length; k < len; k++) {
            if (SaveTagDataList[i].tag_data[k].length != 0) {
              if (SaveTagDataList[i].tag_data[k][0].id.split('_')[0] === id) {
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
      }
    } else {
      for (let i = 0, len = SaveTagDataList.length; i < len; i++) {
        if (WidgetType === SaveTagDataList[i].type) {
          for (let k = 0, len = SaveTagDataList[i].tag_data.length; k < len; k++) {
            if (SaveTagDataList[i].tag_data[k].length != 0) {
              if (SaveTagDataList[i].tag_data[k][0].id.split('_')[0] === id) {
                tag_list_result = SaveTagDataList[i].tag_data[k][0].tag_list
              }
            }
          }
        }
      }
    }

    return tag_list_result
  }

  const getDataBySelctedCompany = (company: string, TagList: any, WidgetInfo: string, BoxTargetId: string) => {
    if (company === 'Dongwon') {
      setShowLoading(true)

      const panel: any = Object.keys(panels[panelIdx]).map((panelIndex: string) => {
        return panels[panelIdx][panelIndex]
      })

      const obj_test: any = new Object()
      const arr_test: any = []

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

      //태그 리스트 저장
      for (let i = 0, len = SaveTagDataList.length; i < len; i++) {
        if (WidgetInfo === data[i].type) {
          if (data[i].tag_data.length !== 0) {
            for (let j = 0, len = data[i].tag_data.length; j < len; j++) {
              if (data[i].tag_data[j][0].id === BoxTargetId) {
                data[i].tag_data[j][0] = arr_test
              } else {
                data[i].tag_data.push(arr_test)
              }
            }
          } else {
            data[i].tag_data.push(arr_test)
          }
        } else {
          for (let j = 0, len = data[i].tag_data.length; j < len; j++) {
            if (data[i].tag_data[j][0].id === BoxTargetId) {
              data[i].tag_data[j] = []
            }
          }
        }
      }

      setSaveTagDataList(data)

      if (WidgetInfo === 'Table' || WidgetInfo === 'Pie' || WidgetInfo === 'Bar') {
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

              TableRows = row
              TableColumns = column

              그리기함수.DrawGauidWidget('Table', node, row, column)

              setTagListArr([])
            }
            //20230525 박윤희
            //추후 추가 예정
            // if (WidgetInfo === 'Pie') {
            //   const labels: any = []
            //   const values: any = []

            //   let data:any = PieDataOption
            //   const layout = JSON.parse(PieLayoutOption)

            //   delete layout.title

            //   if (typeof data === 'object' && data[0] !== undefined) {
            //     if (data[0].values !== undefined && data[0].labels !== undefined) {
            //       delete data[0].values
            //       delete data[0].labels
            //       data[0].labels = labels
            //       data[0].values = values
            //     } else {
            //       data[0].labels = labels
            //       data[0].values = values
            //     }
            //   } else {
            //     if (data.values !== undefined && data.labels !== undefined) {
            //       delete data.values
            //       delete data.labels

            //       data.labels = labels
            //       data.values = values

            //       data = [data]
            //     } else {
            //       data.labels = labels
            //       data.values = values

            //       data = [data]
            //     }
            //   }

            //   setPieLayoutOption(layout)
            //   setPieDataOption(data)

            //   그리기함수.DrawGauidWidget('Pie', node, data, layout)
            //   setTagListArr([])
            // }

            // if (WidgetInfo === 'Bar') {
            //   const data: any = []
            //   let dataX: any = []
            //   let dataY: any = []
            //   let dataObj: any = new Object()
            //   const layout: any = BarLayoutOption

            //   const dataType: any = ['max', 'min', 'avg']

            //   layout.title = '선택한 Tag의 [ Min ,  Max , Average ]'

            //   for (let j = 0, len = dataType.length; j < len; j++) {
            //     for (let i = 0, len = response.data.length; i < len; i++) {
            //       dataX.push(response.data[i].tagName)
            //       dataY.push(response.data[i][dataType[j]])
            //       dataObj.name = dataType[j]
            //     }

            //     dataObj.type = 'bar'
            //     dataObj.textposition = 'auto'
            //     dataObj.x = dataX
            //     dataObj.y = dataY

            //     data.push(dataObj)
            //     dataObj = new Object()
            //     dataX = []
            //     dataY = []
            //   }

            //   setBarLayoutOption(layout)
            //   setBarDataOption(data)

            //   그리기함수.DrawGauidWidget('Bar', node, data, layout)
            //   setTagListArr([])
            // }
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

              그리기함수.DrawGauidWidget('TimeSeries', node, response.data, layout)
            } else if (WidgetInfo === 'Line') {
              const dataObj: any = new Object()
              const layout: any = LineLayoutOption
              layout.title = '선택한 Tag들의 Data'

              setLineLayoutOption(layout)
              setLineDataOption(response.data)

              그리기함수.DrawGauidWidget('Line', node, response.data, layout)
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
   * 2023-04-21
   * 박윤희
   * 대시보드 저장
   */
  const SaveDashboard = (args: any) => {
    let params: any = new Object()

    if (window.localStorage.getItem('SelectedDashboardInfo') === 'new') {
      params = {
        com_id: localStorage.getItem('companyId'),
        // lay_id: Number(window.localStorage.getItem('layout_id')) + 1,
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
            leftIcon={<ReactIcon.MdOutlineGridView />}
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
              setOpenSaveLayoutModal(true)
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
          {/* <Button
            leftIcon={<MdOutlineRestartAlt />}
            style={{ backgroundColor: realTimeBtnColor, color: realTimeBtnFont }}
            onClick={() => {
              setRealTimeBtnColor('#00ae2f')
            }}
          >
            실시간 데이터
          </Button> */}
        </Chakra.Stack>
      </Chakra.Box>
      <Spin tip="Loading" size="large" spinning={showLoading}>
        <div className="content" />
      </Spin>
      {/* <LineChartComponent />
      <PieChartComponent />
      <BarChartComponent />
      <TimeSeriesComponent /> */}
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
export default PredefinedLayouts
