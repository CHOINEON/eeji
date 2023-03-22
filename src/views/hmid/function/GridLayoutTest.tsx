import * as ReactDOM from 'react-dom'
import * as React from 'react'
import { updateSampleSection } from './base'
import { DashboardLayoutComponent, PanelModel, PanelsDirective, PanelDirective } from '@syncfusion/ej2-react-layouts'
import { panelData } from './data/panel-data'
import './style/style.css'
import WidgetModal from '../components/Modal/WidgetModal'
import Plot from 'react-plotly.js'

import LineChartComponent from '../components/Chart/Line/LineChartComponent'
import WidgetDataTable from '../components/DataGrid/DataGrid'

interface GridLayoutProps {
  target: any
}

export const PredefinedLayouts: React.FC<GridLayoutProps> = (props: any) => {
  //state
  const [isOpenWidgetModal, setIsOpenWidgetModal] = React.useState<boolean>(false)
  const [WidgetInfo, setWidgetInfo] = React.useState<string>('')

  const [BoxTargetId, setBoxTargetId] = React.useState<any>()

  const [ChartLayoutOption, setChartLayoutOption] = React.useState<any>('')
  const [ChartDataOption, setChartDataOption] = React.useState<any>('')

  const [TableRows, setTableRows] = React.useState<any>([
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
  ])
  const [TableColumns, setTableColumns] = React.useState<any>([
    { field: 'make', filter: true },
    { field: 'model', filter: true },
    { field: 'price' },
  ])

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
    console.log(WidgetInfo)
    if (WidgetInfo === 'Line') {
      console.log(BoxTargetId)
      if (BoxTargetId !== undefined) {
        if (ChartLayoutOption.length !== 0 && ChartDataOption.length !== 0) {
          const node: any = document.getElementById(BoxTargetId)
          console.log(node)
          const config = {
            displaylogo: false,
          }

          const Layout: any = {
            ...ChartLayoutOption,
            width: node.clientWidth,
            height: node.clientHeight,
            plot_bgcolor: 'rgba(255,255,255,0)',
            paper_bgcolor: 'rgba(255,255,255,0)',
          }
          const data = <Plot data={ChartDataOption} layout={Layout} config={config} />
          const element = React.createElement(data.type, { data: data.props.data, layout: data.props.layout })
          ReactDOM.render(element, node)
        }
      }
    } else if (WidgetInfo === 'Table') {
      console.log(BoxTargetId)
      if (BoxTargetId !== undefined) {
        if (ChartLayoutOption.length !== 0 && ChartDataOption.length !== 0) {
          const node: any = document.getElementById(BoxTargetId)
          console.log(node)

          const data = <WidgetDataTable rows={TableRows} columns={TableColumns} />
          console.log('>>>>>>>>>>>>>>>>>>>>>>')
          console.log(data)
          const element = React.createElement(data.type, { data: data.props.rows, layout: data.props.columns })
          ReactDOM.render(element, node)
        }
      }
    }
  }, [WidgetInfo])

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
        header: '<div class="e-header-text">Header Area</div><div class="header-border"></div>',
        content: '<div class="panel-content">Content Area</div>',
      }
      updatePanels.push(panelModelValue)
    }
    dashboardObj.panels = updatePanels
  }

  const ClickDashBoardComponent = (e: any) => {
    console.log(e.target.id)
    setBoxTargetId(e.target.id)
    setIsOpenWidgetModal(true)
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
    setChartLayoutOption(props)
  }

  const getChartData = (props: any) => {
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
        ...props,
        x: data[i].x,
        y: data[i].y,
      }

      ChartDataArr.push(ChartDataObj)

      ChartDataObj = new Object()
    }

    setChartDataOption(ChartDataArr)
  }

  return (
    <>
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
      <LineChartComponent ChartType={WidgetInfo} ChartLayout={getChartLayout} ChartData={getChartData} />
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
