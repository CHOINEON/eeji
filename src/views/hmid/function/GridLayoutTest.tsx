import * as ReactDOM from 'react-dom'
import * as React from 'react'
import { updateSampleSection } from './base'
import { DashboardLayoutComponent, PanelModel, PanelsDirective, PanelDirective } from '@syncfusion/ej2-react-layouts'
import { panelData } from './data/panel-data'
import './style/style.css'
import { Alert, AlertIcon, AlertDescription, CloseButton, Box } from '@chakra-ui/react'
import WidgetModal from '../components/Modal/WidgetModal'
import Plot from 'react-plotly.js'

import LineChartComponent from '../components/Chart/Line/LineChartComponent'
import PieChartComponent from '../components/Chart/Pie/PieChartComponent'
import WidgetDataTable from '../components/DataGrid/DataGrid'

interface GridLayoutProps {
  target: any
}

export const PredefinedLayouts: React.FC<GridLayoutProps> = (props: any) => {
  //state
  const [isOpenWidgetModal, setIsOpenWidgetModal] = React.useState<boolean>(false)
  const [WidgetInfo, setWidgetInfo] = React.useState<string>('')

  const [BoxTargetId, setBoxTargetId] = React.useState<any>()

  const [LineChartLayoutOption, setLineChartLayoutOption] = React.useState<any>('')
  const [LineChartDataOption, setLineChartDataOption] = React.useState<any>('')

  const [PieChartLayoutOption, setPieChartLayoutOption] = React.useState<any>('')
  const [PieChartDataOption, setPieChartDataOption] = React.useState<any>('')

  const [AlertVisibility, setAlertVisibility] = React.useState(true)

  const [ShowDrawer, setShowDrawer] = React.useState(false)

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
  const cellSpacing: number[] = [4, 5]

  React.useEffect(() => {
    if (props.target !== undefined) {
      updateSampleSection()
      rendereComplete(props.target)
    }
  }, [dashboardObj, props.target])

  React.useEffect(() => {
    console.log('하위에서 받은 props : ' + ShowDrawer)
  }, [ShowDrawer])

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
      DrawPlotlyChart(LineChartLayoutOption, LineChartDataOption, BoxTargetId)
    } else if (WidgetInfo === 'Pie') {
      DrawPlotlyChart(PieChartLayoutOption, PieChartDataOption, BoxTargetId)
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
  }, [WidgetInfo, LineChartLayoutOption, LineChartDataOption, PieChartLayoutOption, PieChartDataOption])

  /**
   * GridLayout Evt
   */
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
    for (let i = 0; i < panel.length; i++) {
      const panelModelValue: PanelModel = {
        id: i.toString(),
        row: panel[i].row,
        col: panel[i].col,
        sizeX: panel[i].sizeX,
        sizeY: panel[i].sizeY,
        header: `<div class="e-header-text"> <button class="grid-setting-btn">
      </button></div><div class="header-border"></div>`,
        content: '<div class="panel-content">Content Area</div>',
      }
      updatePanels.push(panelModelValue)
    }
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
      if (e.target.className.includes('ag')) {
        console.log('ag')
      } else {
        if (e.target.className.includes('grid-setting-btn')) {
          console.log(e)
          // console.log(e.target.offsetParent.offsetParent.children[0].childNodes[1].childNodes[0].data)

          if (e.target.offsetParent.offsetParent.children[0].childNodes[1].childNodes[0].data !== undefined) {
            console.log(e.target.offsetParent.offsetParent.children[0].childNodes[1].childNodes[0].data[0].type)
            console.log(WidgetInfo)
            setShowDrawer(true)
          } else {
            if (e.target.offsetParent.offsetParent.children[0].childNodes[1].childNodes[1].className !== undefined) {
              console.log(e.target.offsetParent.offsetParent.children[0].childNodes[1].childNodes[1].className)
            }
            setAlertVisibility(false)
          }
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
    // document.getElementById('templateContainer').onclick = (args: any) => {
    //   const target: any = args.target
    //   const selectedElement: any = document.getElementsByClassName('e-selected-style')
    //   if (selectedElement.length) {
    //     selectedElement[0].classList.remove('e-selected-style')
    //   }
    //   if (target.className === 'image-pattern-style') {
    //     dashboardObj.removeAll()
    //     initializeTemplate(args.target, dashboardObj)
    //   }
    //   target.classList.add('e-selected-style')
    // }

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
  const getChartLayout = (props: any) => {
    if (WidgetInfo === 'Line') {
      setLineChartLayoutOption(props)
    } else if (WidgetInfo === 'Pie') {
      setPieChartLayoutOption(props)
    }
  }

  const getChartData = (props: any) => {
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
    } else if (WidgetInfo === 'Pie') {
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

  const getShowDrawer = (ShowDrawer: boolean) => {
    console.log('[ Grid에서 받은 props ] : ')
    console.log(ShowDrawer)
    setShowDrawer(ShowDrawer)
  }

  return (
    <>
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
      <LineChartComponent
        ChartType={WidgetInfo}
        ChartLayout={getChartLayout}
        ChartData={getChartData}
        ShowDrawer={ShowDrawer}
        setShowDrawer={getShowDrawer}
      />
      <PieChartComponent ChartType={WidgetInfo} ChartLayout={getChartLayout} ChartData={getChartData} />
      <div id="DashboardBox">
        <div className="col-lg-8 control-section" id="predefine_control">
          <div className="content-wrapper" style={{ maxWidth: '100%' }}>
            <DashboardLayoutComponent
              // created={onCreate.bind(this)}
              onClick={(e: any) => {
                ClickDashBoardComponent(e)
              }}
              columns={6}
              ref={(scope) => {
                dashboardObj = scope
              }}
              id="predefine_dashboard"
              cellSpacing={cellSpacing}
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
