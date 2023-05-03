import * as ReactDOM from 'react-dom'
import React from 'react'
import axios from 'axios'
import styled from '@emotion/styled'
import { panelData } from '../hmid_config/data/panel-data'
import { DashboardLayoutComponent, PanelModel, ResizeArgs } from '@syncfusion/ej2-react-layouts'
import { Box } from '@chakra-ui/react'
/**
 * ag Grid
 */
import { AgGridReact } from 'ag-grid-react'
import { ColDef, GridReadyEvent } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css' // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css' // Optional theme CSS
import Plot from 'react-plotly.js'

const DataGridWrap = styled.div`
  width: 100%;
  height: calc(100% - 1.1vw);
`

export const MainDashboard: React.FC = () => {
  const [CompanyId, setCompanyId] = React.useState<any>()
  /**
   * DataGrid
   * **/
  const gridRef = React.useRef<any>([])
  const [Theme, setTheme] = React.useState('ag-theme-alpine')
  const [gridApi, setGridApi] = React.useState<any>()
  const [DashboardObj, setDashboardObj] = React.useState<any>()
  const [idx, setIdx] = React.useState<any>(0)
  const [dashboardData, setDashboardData] = React.useState()
  const [PieChartDataType, setPieChartDataType] = React.useState<string>('max')

  const panels: any = panelData
  let dashboardObj: DashboardLayoutComponent
  let count = 0
  const defaultColDef = React.useMemo<ColDef>(() => {
    return {
      flex: 1,
      editable: true,
    }
  }, [])

  React.useEffect(() => {
    console.log(window.localStorage.getItem('companyId'))
    setCompanyId(window.localStorage.getItem('companyId'))
  }, [])

  React.useEffect(() => {
    getCompanyMainDashboardList(CompanyId)
  }, [CompanyId])

  React.useEffect(() => {
    if (dashboardData !== undefined && dashboardObj !== undefined) {
      const data = dashboardData as any

      let panelModelValue: PanelModel = {}
      const updatePanels: PanelModel[] = []
      const index: any = Number(data[0].grid_id)
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
          <div class="e-header-text"></div>
          <div class="header-border"></div>`,
          content: '<div class="panel-content ${dashboardBoxColor}"></div>',
        }
        updatePanels.push(panelModelValue)
      }

      // console.log('[ 업데이트 판넬 데이터 ] : ')
      // console.log(dashboardObj.panels)
      dashboardObj.panels = updatePanels
      console.log(dashboardObj)
      setTimeout(function () {
        setGridWidgetComponent(dashboardData)
      }, 500)
      // setGridWidgetComponent(dashboardObj, )
    }
  }, [DashboardObj, dashboardData])

  /**
   * 2023-04-14 박윤희
   * 초기 가이드 그리드 위젯 그리기 위한 함수
   * option1:layout, option2:data
   */
  const DrawGauidWidget = (widget: string, node: any, option1: any, option2: any) => {
    //설정 값
    const config = {
      displaylogo: false,
      displayModeBar: false,
    }

    console.log('--------------------')
    console.log(widget)
    console.log(node)
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
        <DataGridWrap className={Theme}>
          <AgGridReact
            api={gridApi}
            onGridReady={(e: GridReadyEvent) => {
              console.log('grid Ready')
              console.log(e)
              setGridApi(e.api)
            }}
            rowData={option1}
            columnDefs={option2}
            defaultColDef={defaultColDef}
            enableCellChangeFlash={true}
            editType={'fullRow'}
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
  const setGridWidgetComponent = (LayoutData: any) => {
    const index = Number(LayoutData[0].grid_id)
    const panel: any = Object.keys(panels[index]).map((panelIndex: string) => {
      return panels[index][panelIndex]
    })

    console.log(panel)
    // 그려지고 난 후 실행하기
    for (let i = 0, len = LayoutData.length; i < len; i++) {
      for (let j = 0, len = panel.length; j < len; j++) {
        if (LayoutData[i].grid_index === Number(panel[j].id.split('_')[0])) {
          // console.log(LayoutData[i].grid_index)
          // console.log(Number(panel[j].id.split('_')[0]))
          const node: any = document.getElementById(panel[j].id)
          if (LayoutData[i].widget_type === 'Line') {
            // DrawGauidWidget(
            //   LayoutData[i].widget_type,
            //   node,
            //   JSON.parse(LayoutData[i].layout_option),
            //   JSON.parse(LayoutData[i].data_option)
            // )
            getDataList(
              LayoutData[i].tag_list,
              LayoutData[i].widget_type,
              node,
              JSON.parse(LayoutData[i].layout_option),
              JSON.parse(LayoutData[i].data_option)
            )
          } else if (LayoutData[i].widget_type === 'Bar') {
            // DrawGauidWidget(
            //   LayoutData[i].widget_type,
            //   node,
            //   JSON.parse(LayoutData[i].layout_option),
            //   JSON.parse(LayoutData[i].data_option)
            // )
            getDataList(
              LayoutData[i].tag_list,
              LayoutData[i].widget_type,
              node,
              JSON.parse(LayoutData[i].layout_option),
              JSON.parse(LayoutData[i].data_option)
            )
          } else if (LayoutData[i].widget_type === 'Pie') {
            // DrawGauidWidget(
            //   LayoutData[i].widget_type,
            //   node,
            //   JSON.parse(LayoutData[i].layout_option),
            //   JSON.parse(LayoutData[i].data_option)
            // )
            getDataList(
              LayoutData[i].tag_list,
              LayoutData[i].widget_type,
              node,
              JSON.parse(LayoutData[i].layout_option),
              JSON.parse(LayoutData[i].data_option)
            )
          } else if (LayoutData[i].widget_type === 'TimeSeries') {
            // DrawGauidWidget(
            //   LayoutData[i].widget_type,
            //   node,
            //   JSON.parse(LayoutData[i].layout_option),
            //   JSON.parse(LayoutData[i].data_option)
            // )
            getDataList(
              LayoutData[i].tag_list,
              LayoutData[i].widget_type,
              node,
              JSON.parse(LayoutData[i].layout_option),
              JSON.parse(LayoutData[i].data_option)
            )
          } else if (LayoutData[i].widget_type === 'Table') {
            // DrawGauidWidget(
            //   LayoutData[i].widget_type,
            //   node,
            //   JSON.parse(LayoutData[i].layout_option),
            //   JSON.parse(LayoutData[i].data_option)
            // )
            getDataList(
              LayoutData[i].tag_list,
              LayoutData[i].widget_type,
              node,
              JSON.parse(LayoutData[i].layout_option),
              JSON.parse(LayoutData[i].data_option)
            )
          }
        }

        const header: any = document.getElementById(panel[j].id).parentElement.children[0].children[0]
        let data: any
        if (LayoutData[i].grid_nm === null) {
          data = <div style={{ lineHeight: '0', fontWeight: 'bold' }}>{'타이틀'}</div>
        } else {
          data = <div>{LayoutData[i].grid_nm}</div>
        }
        ReactDOM.render(data, header)
      }
    }
  }

  //data 불러오기
  const getDataList = (TagList: any, WidgetInfo: string, node: any, layout_option: any, data_option: any) => {
    const TagData: any = []
    for (let i = 0, len = TagList.length; i < len; i++) {
      TagData.push(TagList[i].tag)
    }

    const set = new Set(TagData)

    const uniqueArr = [...set]

    console.log(uniqueArr)
    console.log('>>>>>>>>>>>>>>>>>>>>>>')
    console.log(WidgetInfo)

    if (WidgetInfo === 'Table' || WidgetInfo === 'Pie' || WidgetInfo === 'Bar') {
      axios
        .post(process.env.REACT_APP_API_SERVER_URL + '/api/tag/describe', uniqueArr)
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

            // console.log(data)
            // console.log('##########################')

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
          // setShowLoading(false)
        })
    } else {
      // const node = document.getElementById(BoxTargetId)

      axios
        .post(process.env.REACT_APP_API_SERVER_URL + '/api/hmid/chartData?', uniqueArr)
        .then((response) => {
          console.log('[ Chart response data ] : ')
          console.log(response.data)

          if (WidgetInfo === 'TimeSeries') {
            layout_option[0].title = '선택한 Tag의 Data'
            DrawGauidWidget(WidgetInfo, node, response.data, layout_option[0])
          } else if (WidgetInfo === 'Line') {
            layout_option[0].title = '선택한 Tag들의 Data'
            DrawGauidWidget(WidgetInfo, node, response.data, layout_option[0])
          }

          // setDataArr(response.data)
          //setShowLoading(false)
        })
        .catch((error) => {
          console.log(error)

          alert('Error. 담당자에게 문의 바랍니다.')
          // setShowLoading(false)
        })
    }
  }

  const getCompanyMainDashboardList = (com_id: string) => {
    axios.get(process.env.REACT_APP_API_SERVER_URL + '/api/hmid/layout?company_id=' + com_id).then((response) => {
      console.log('[ Select Layout Info Response ] :')
      console.log(response.data)

      for (let i = 0, len = response.data.length; i < len; i++) {
        if (response.data[i].use_yn === 1) {
          getCompanyMainDashboardInfo(response.data[i].lay_id)
        }
      }
    })
  }

  const getCompanyMainDashboardInfo = (lay_id: number) => {
    axios.get(process.env.REACT_APP_API_SERVER_URL + '/api/hmid/layout/info?lay_id=' + lay_id).then((response) => {
      console.log('[ Select Layout Info Response ] :')
      console.log(response.data)
      // dashboard info 넣기
      // setDashboardData(response.data)
    })
  }

  return (
    <>
      <Box style={{ position: 'relative', zIndex: 1000 }}>
        <div className="col-lg-8 control-section" id="control_dash">
          <div className="content-wrapper" style={{ maxWidth: '100%' }}>
            <DashboardLayoutComponent
              id="api_dashboard"
              allowFloating={false}
              allowResizing={false}
              allowDragging={false}
              columns={8}
              ref={(scope: any) => {
                ;(dashboardObj as any) = scope
              }}
            ></DashboardLayoutComponent>
          </div>
        </div>
      </Box>
    </>
  )
}

export default MainDashboard
