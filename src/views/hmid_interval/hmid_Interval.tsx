/**
 * INFINITE OPTIMAL
 * 메뉴 : HMI Designer
 * 시작 날짜 : 2023-03-10
 * 최종 수정 날짜 : 2023-07-03
 * 개발자 : 박윤희 (BAK YUN HEE)
 */

import * as ReactDOM from 'react-dom'
import * as React from 'react'
import styled from '@emotion/styled'
import '../hmid_config/style/style.css'
import 'ag-grid-community/styles/ag-grid.css'
import '../hmid/components/Modal/style/style.css'

import { panelData } from '../hmid_config/data/panel-data'
import * as d3 from 'd3'

import WidgetModal from '../hmid/components/Modal/WidgetModal'
import SaveConfirmModal from '../hmid/components/Modal/SaveConfirm'
import LayoutModal from '../hmid/components/Modal/LayoutListModal'
import DataConnection from '../hmid/components/Modal/DataConnection'
import { Alert } from '../hmid/components/Modal/Alert'

import * as ReactIcon from 'react-icons/md'
import * as Chakra from '@chakra-ui/react'
import * as ej2 from '@syncfusion/ej2-react-layouts'

import { useRecoilState, RecoilRoot } from 'recoil'
import * as RecoilAtoms from '../hmid_config/recoil/config/atoms'
import { NowDate } from '../hmid_config/recoil/base/atoms'

import D3LineChartInterval from '../hmid_config/grid/drawD3ChartIntervalTestDw'
import D3LineChartIntervalBT from '../hmid_config/grid/drawD3ChartIntervalTestDwBT'
import D3LineChart from '../hmid_config/grid/TestComponent/drawD3Chart'
import IntervalTestBiance from '../hmid_config/grid/drawD3ChartIntervalTestBiance'
import IntervalTestBianceTrade from 'views/hmid_config/grid/drawD3ChartIntervalTestBianceTrade'
import DrawD3FCChart from 'views/hmid_config/grid/TestComponent/drawD3FCChart'

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

  const panels: any = panelData
  let dashboardObj: ej2.DashboardLayoutComponent
  const cellSpacing: number[] = [5, 5]

  /**
   * 2023-05-25 박윤희
   * panelIdx를 확인해서 새로 만드는 대시보드인지, 기존에 있던 대시보드인지
   * 현재는 d3차트로 연결되어있고
   * pie, bar, line은 사용하지 않음
   * 확인하는 용도
   */
  React.useEffect(() => {
    if (window.localStorage.getItem('SelectedDashboardInfo') !== 'new') {
      const Layoutdata: any = JSON.parse(window.localStorage.getItem('SelectedDashboardInfo'))
      const panel: any = Object.keys(panels[Number(Layoutdata[0].grid_id)]).map((panelIndex: string) => {
        return panels[Number(Layoutdata[0].grid_id)][panelIndex]
      })
    } else {
      const dashboardData = initializeTemplate(null, dashboardObj)
      dashboardData.then(function (args: any) {
        setTimeout(function () {
          AddGridGauid(args, 0)
        }, 1000)
      })
    }
  }, [panelIdx])

  /**
   * Gauid 그리기
   * panelData를 확인해서 위젯 조건에 따라 DOM에 그리기
   * ChartInterval 컴포넌트에 props 전달
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
            <BoxTitle>Binance Trade 50ms</BoxTitle>
            <IntervalTestBianceTrade widthSize={node.clientWidth} heightSize={node.clientHeight} />
          </>
        )
        ReactDOM.render(data, node)
      } else if (panel[j].widget === 'Line2') {
        const data = (
          <>
            <BoxTitle>Binance kline 1s</BoxTitle>
            <IntervalTestBiance widthSize={node.clientWidth} heightSize={node.clientHeight} />
          </>
        )
        ReactDOM.render(data, node)
      } else if (panel[j].widget === 'Line3') {
        const data = (
          <>
            <DrawD3FCChart />
          </>
        )

        ReactDOM.render(data, node)
      }
    }
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

  return (
    <RecoilRoot>
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
    </RecoilRoot>
  )
}
export default MainDashboardInterval
