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
import '../hmid_config/style/style.css'
import 'ag-grid-community/styles/ag-grid.css'
import { Spin } from 'antd'
import '../hmid/components/Modal/style/style.css'

import { AgGridReact } from 'ag-grid-react'
import { ColDef } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { panelData } from '../hmid_config/data/panel-data'
import Plot from 'react-plotly.js'
import * as d3 from 'd3'

import WidgetModal from '../hmid/components/Modal/WidgetModal'
import SaveConfirmModal from '../hmid/components/Modal/SaveConfirm'
import LayoutModal from '../hmid/components/Modal/LayoutListModal'
import DataConnection from '../hmid/components/Modal/DataConnection'
import { Alert } from '../hmid/components/Modal/Alert'

import * as ReactIcon from 'react-icons/md'
import * as Chakra from '@chakra-ui/react'
import * as ej2 from '@syncfusion/ej2-react-layouts'
import * as 그리기함수 from '../hmid_config/grid/function/차트그리기함수'
import * as 가공함수 from '../hmid_config/grid/function/차트데이터가공함수'
import * as 이미지저장함수 from '../hmid_config/grid/function/캡쳐이미지저장함수'

import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import * as RecoilAtoms from '../hmid_config/recoil/config/atoms'
import * as RecoilLineAtoms from '../hmid_config/recoil/line/atoms'
import * as RecoilTimeSeriesAtoms from '../hmid_config/recoil/timeseries/atoms'
// import { GridDataObjSelector } from '../recoil/config/selector'
import { CompanyId, LayoutTitle, NowDate } from '../hmid_config/recoil/base/atoms'

import D3LineChartInterval from '../hmid_config/grid/function/drawD3ChartInterval'
import D3LineChart from '../hmid_config/grid/function/drawD3Chart'

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

export const MainDashboardInterval: React.FC = () => {
  //atom
  const [gridInformation, setGridInformation] = useRecoilState(RecoilAtoms.GridInformationState)
  // const [gridDataObj, setGridDataObj] = useRecoilState(RecoilAtoms.GridDataObjState)
  const [showLoading, setShowLoading] = useRecoilState(RecoilAtoms.ShowLoadingState)
  const [panelIdx, setPanelIdx] = useRecoilState(RecoilAtoms.PanelIdxState)

  const [NowDateText, setNowDateText] = useRecoilState(NowDate)

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
    window.localStorage.setItem('SelectedDashboardInfo', 'new')
    window.addEventListener('resize', (e: any) => {
      AddGridGauid(null, 0)
    })
    //clean up
    window.removeEventListener('resize', (e: any) => {
      AddGridGauid(null, 0)
    })
  }, [])

  React.useEffect(() => {
    setInterval(function () {
      getNowDateTime()
    }, 1000)
  }, [NowDateText])

  //theme color mode
  const dashboardBoxColor = Chakra.useColorModeValue('white', 'dark')

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

  /**
   * 2023-05-25 박윤희
   * 코드 필요성 확인
   */
  React.useEffect(() => {
    if (window.localStorage.getItem('SelectedDashboardInfo') !== 'new') {
      const Layoutdata: any = JSON.parse(window.localStorage.getItem('SelectedDashboardInfo'))
      const panel: any = Object.keys(panels[Number(Layoutdata[0].grid_id)]).map((panelIndex: string) => {
        return panels[Number(Layoutdata[0].grid_id)][panelIndex]
      })

      initializeTemplate(Layoutdata[0].grid_id, dashboardObj).then(function () {
        SelectedDashboardWidgetData(Layoutdata, panel)
      })

      // setTimeout(function () {
      //   SelectedDashboardWidgetData(Layoutdata, panel)
      // }, 500)
      // SelectedDashboardWidgetData(Layoutdata)
    } else {
      const dashboardData = initializeTemplate(null, dashboardObj)
      dashboardData.then(function (args: any) {
        setTimeout(function () {
          AddGridGauid(args, 0)
        }, 1000)
      })
      // setTimeout(function () {
      //   그리기함수.AddGridGauid(gridDataObj, 0)
      // }, 500)
    }
  }, [panelIdx])

  //레이아웃 만들 경우 default값 나타내기
  // default???? 생각해보기 initializeTemplate 있음
  React.useEffect(() => {
    initializeTemplate(null, dashboardObj)
  }, [])

  //grid 선택해서 레이아웃 변경 한 경우
  React.useEffect(() => {
    if (gridInformation !== undefined && gridInformation !== null) {
      // updateSampleSection()
      rendereComplete(gridInformation)
    }
  }, [dashboardObj, gridInformation])

  /**위젯 그리기  */
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
        <DataGridWrap className={'ag-theme-alpine'}>
          <AgGridReact
            rowData={option1}
            columnDefs={option2}
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

      ReactDOM.render(data, node)
    }
  }
  /**
   * Gauid 그리기
   * 2023.05.30. 작업중
   */
  const AddGridGauid = (args: any, idx: number) => {
    const panels: any = panelData
    const index = idx
    const panel: any = Object.keys(panels[index]).map((panelIndex: string) => {
      return panels[index][panelIndex]
    })
    // 그려지고 난 후 실행하기
    for (let j = 0, len = panel.length; j < len; j++) {
      const node: any = document.getElementById(panel[j].id)
      if (panel[j].widget === 'Line1') {
        const data = (
          <>
            <BoxTitle>Trade Price</BoxTitle>
            <D3LineChartInterval
              widthSize={node.clientWidth}
              heightSize={node.clientHeight}
              CallData={'TradePrice'}
              Color={'steelblue'}
              ChartShow={true}
              TableShow={false}
              Multiple={false}
            />
          </>
        )
        ReactDOM.render(data, node)
        //   setWidgetInfo('Line')
        // const result: any = ChangeLineDataArr(useRecoilValue(RecoilLineAtoms.LineChartDataOptionState))
        // result.then(function (args: any) {
        //   DrawGauidWidget(panel[j].widget, node, args, useRecoilValue(RecoilLineAtoms.LineChartLayoutOptionState))
        // })
      } else if (panel[j].widget === 'Line2') {
        const data = (
          <>
            <BoxTitle>Opening Price</BoxTitle>
            <D3LineChartInterval
              widthSize={node.clientWidth}
              heightSize={node.clientHeight}
              CallData={'OpeningPrice'}
              Color={'green'}
              ChartShow={true}
              TableShow={false}
              Multiple={false}
            />
          </>
        )
        ReactDOM.render(data, node)
        //setWidgetInfo('Bar')
        // const result: any = 가공함수.ChangeBarDataArr(useRecoilValue(RecoilAtoms.BarChartDataOptionState))
        // result.then(function (args: any) {
        //   DrawGauidWidget(panel[j].widget, node, args, useRecoilValue(RecoilAtoms.BarChartLayoutOptionState))
        // })
      } else if (panel[j].widget === 'Line3') {
        const data = (
          <>
            <BoxTitle>Low Price</BoxTitle>
            <D3LineChartInterval
              widthSize={node.clientWidth}
              heightSize={node.clientHeight}
              CallData={'LowPrice'}
              Color={'orange'}
              ChartShow={true}
              TableShow={false}
              Multiple={false}
            />
          </>
        )
        ReactDOM.render(data, node)
        //setWidgetInfo('Bar')
        // const result: any = 가공함수.ChangeBarDataArr(useRecoilValue(RecoilAtoms.BarChartDataOptionState))
        // result.then(function (args: any) {
        //   DrawGauidWidget(panel[j].widget, node, args, useRecoilValue(RecoilAtoms.BarChartLayoutOptionState))
        // })
      } else if (panel[j].widget === 'Line4') {
        const data = (
          <>
            <BoxTitle>High Price</BoxTitle>
            <D3LineChartInterval
              widthSize={node.clientWidth}
              heightSize={node.clientHeight}
              CallData={'HighPrice'}
              Color={'purple'}
              ChartShow={true}
              TableShow={false}
              Multiple={false}
            />
          </>
        )
        ReactDOM.render(data, node)
        //setWidgetInfo('Bar')
        // const result: any = 가공함수.ChangeBarDataArr(useRecoilValue(RecoilAtoms.BarChartDataOptionState))
        // result.then(function (args: any) {
        //   DrawGauidWidget(panel[j].widget, node, args, useRecoilValue(RecoilAtoms.BarChartLayoutOptionState))
        // })
      } else if (panel[j].widget === 'Line5') {
        const data = (
          <>
            <BoxTitle>Opening & High & Low</BoxTitle>
            <D3LineChartInterval
              widthSize={node.clientWidth}
              heightSize={node.clientHeight}
              CallData={'Opening & High & Low'}
              Color={'purple'}
              ChartShow={true}
              TableShow={false}
              Multiple={true}
            />
          </>
        )
        // const data = (
        //   <D3LineChart
        //     widthSize={node.clientWidth}
        //     heightSize={node.clientHeight}
        //     Calltype={'WS'}
        //     CallData={'candleAccTradePriceVolume'}
        //   />
        // )
        ReactDOM.render(data, node)
        //setWidgetInfo('Bar')
        // const result: any = 가공함수.ChangeBarDataArr(useRecoilValue(RecoilAtoms.BarChartDataOptionState))
        // result.then(function (args: any) {
        //   DrawGauidWidget(panel[j].widget, node, args, useRecoilValue(RecoilAtoms.BarChartLayoutOptionState))
        // })
      } else if (panel[j].widget === 'Pie') {
        //setWidgetInfo('Pie')
        // const result: any = 가공함수.ChangePieDataArr(useRecoilValue(RecoilAtoms.PieChartLayoutOptionState))
        // result.then(function (args: any) {
        //   DrawGauidWidget(panel[j].widget, node, args, useRecoilValue(RecoilAtoms.PieChartLayoutOptionState))
        // })
        // result.then(function (args: any) {
        //   DrawGauidWidget(panel[j].widget, node, args, useRecoilValue(RecoilAtoms.PieChartLayoutOptionState))
        // })
      } else if (panel[j].widget === 'TimeSeries') {
        //setWidgetInfo('Time Series')
        // const result: any = ChangeTimeSeriesDataArr()
        // result.then(function (args: any) {
        //   setTimeSeriesDataOption(args)
        //   const config = {
        //     displaylogo: true,
        //     displayModeBar: true,
        //   }
        //   const data = <Plot data={args} layout={TimeSeriesLayoutOption} config={config} />
        //   const element = React.createElement(data.type, {
        //     data: data.props.data,
        //     layout: data.props.layout,
        //     config: data.props.config,
        //   })
        //   ReactDOM.render(element, node)
        //   DrawGauidWidget(panel[j].widget, node, args, useRecoilValue(RecoilAtoms.TimeSeriesChartLayoutOptionState))
        // })

        const firstDraw = true
        // drawGraph(firstDraw)
      } else if (panel[j].widget === 'Table') {
        const data = (
          <>
            <BoxTitle>All Data</BoxTitle>
            <D3LineChartInterval
              widthSize={node.clientWidth}
              heightSize={node.clientHeight}
              CallData={'DataTable'}
              Color={'none'}
              ChartShow={false}
              TableShow={true}
              Multiple={false}
            />
          </>
        )
        ReactDOM.render(data, node)
        // DrawGauidWidget(
        //   panel[j].widget,
        //   node,
        //   useRecoilValue(RecoilAtoms.DataTableRowState),
        //   useRecoilValue(RecoilAtoms.DataTableColumnsState)
        // )
      }
    }
  }
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
    let index: number

    if (element === null && dashboardObj !== null) {
      index = 0
      setPanelIdx(index)
    } else {
      if (typeof element === 'string') {
        const index = Number(element)
        setPanelIdx(index)
      } else {
        index = parseInt(element.getAttribute('data-id'), 10) - 1
        setPanelIdx(index)
      }
    }

    const panel: any = Object.keys(panels[index]).map((panelIndex: string) => {
      return panels[index][panelIndex]
    })

    for (let i = 0; i < panel.length; i++) {
      panelModelValue = {
        id: i.toString(),
        row: panel[i].row,
        col: panel[i].col,
        sizeX: panel[i].sizeX,
        sizeY: panel[i].sizeY,
        header: `
        <div class="e-header-text"></div>
        <div class="header-border"></div>`,
        content: '<div class="panel-content ${dashboardBoxColor}">Content Area</div>',
      }
      updatePanels.push(panelModelValue)
    }
    dashboardObj.panels = updatePanels

    // window.localStorage.setItem('updatePanels', JSON.stringify(updatePanels))
    // console.log(window.localStorage.getItem('updatePanels'))

    return dashboardObj.panels
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

  return (
    <>
      <LayoutModal />
      <SaveConfirmModal />
      <WidgetModal />
      <DataConnection />
      <Alert />
      <Chakra.Box style={{ position: 'relative', zIndex: 1000, height: '1vw' }}>
        <CurrentText>{NowDateText}</CurrentText>
        <CurrentIcon>
          <ReactIcon.MdAccessTime />
        </CurrentIcon>
        {/* </Chakra.Stack> */}
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
export default MainDashboardInterval
