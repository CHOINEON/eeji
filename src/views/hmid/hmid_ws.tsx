/**
 * INFINITE OPTIMAL
 * 메뉴 : Websocket Dashboard
 * 시작 날짜 : 2023-03-10
 * 최종 수정 날짜 : 2023-07-04 (코드 정리)
 * 개발자 : 박윤희 (BAK YUN HEE)
 */

import * as ReactDOM from 'react-dom'
import * as React from 'react'
import styled from '@emotion/styled'
import '../hmid_config/style/style.css'
import 'ag-grid-community/styles/ag-grid.css'
import './components/Modal/style/style.css'
import { panelData } from '../hmid_config/data/panel-data'

import WidgetModal from './components/Modal/WidgetModal'
import SaveConfirmModal from './components/Modal/SaveConfirm'
import LayoutModal from './components/Modal/LayoutListModal'
import DataConnection from './components/Modal/DataConnection'
import { Alert } from './components/Modal/Alert'

import * as ReactIcon from 'react-icons/md'
import * as Chakra from '@chakra-ui/react'
import * as ej2 from '@syncfusion/ej2-react-layouts'

import { useRecoilState } from 'recoil'
import * as RecoilAtoms from '../hmid_config/recoil/config/atoms'
import { NowDate } from '../hmid_config/recoil/base/atoms'

import D3LineChart from '../hmid_config/grid/function/drawD3Chart'
import D3LineChartTooltip from '../hmid_config/grid/function/drawD3ChartTooltip(Test중)'

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
  margin-bottom: 1vw;
`

const CurrentIcon = styled.div`
  float: right;
  font-size: 1.3vw;
  font-weight: 500;
  color: rgb(67, 56, 247);
`

export const MainDashboardWS: React.FC = () => {
  const [gridInformation, setGridInformation] = useRecoilState(RecoilAtoms.GridInformationState)
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

  /**
   * 2023-05-25 박윤희
   * 코드 필요성 확인
   */
  React.useEffect(() => {
    const dashboardData = initializeTemplate(null, dashboardObj)
    dashboardData.then(function (args: any) {
      setTimeout(function () {
        AddGridGauid(args, 0)
      }, 1000)
    })
  }, [panelIdx])

  //레이아웃 만들 경우 default값 나타내기
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

  /**
   * Gauid 그리기
   * panel data의 위젯 조건에 따라 dom draw
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
            {/* <D3LineChartTooltip
              widthSize={node.clientWidth}
              heightSize={node.clientHeight}
              CallData={'TradePrice'}
              Color={'steelblue'}
              ChartShow={true}
              TableShow={false}
            /> */}
            <D3LineChart
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
            <D3LineChart
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
            <D3LineChart
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
            <D3LineChart
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
            <D3LineChart
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
      } else if (panel[j].widget === 'Table') {
        const data = (
          <>
            <BoxTitle>All Data</BoxTitle>
            <D3LineChart
              widthSize={node.clientWidth}
              heightSize={node.clientHeight}
              CallData={'DataTable'}
              Color={'none'}
              ChartShow={false}
              TableShow={true}
              Multiple={false}
            />
            {/* <RealTimeDataTable Calltype={'WS'} /> */}
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
      </Chakra.Box>
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
export default MainDashboardWS
