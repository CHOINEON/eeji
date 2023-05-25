import * as ReactDOM from 'react-dom'
import * as React from 'react'
import axios from 'axios'
import styled from '@emotion/styled'
import { AgGridReact } from 'ag-grid-react'
// import { ColDef } from 'ag-grid-community'
import Plot from 'react-plotly.js'
import { panelData } from '../../data/panel-data'

//recoil
import { useSetRecoilState, useRecoilValue } from 'recoil'
import * as ConfigAtoms from '../../recoil/config/atoms'
import * as LineAtoms from '../../recoil/line/atoms'

//function
import { ChangeLineDataArr, ChangeBarDataArr, ChangePieDataArr, ChangeTimeSeriesDataArr } from './차트데이터가공함수'

const DataGridWrap = styled.div`
  width: 100%;
  height: calc(100% - 1.1vw);
`
export const getDataList = (TagList: any[], WidgetInfo: string, node: any, layout_option: any, data_option: any) => {
  const setPieLayout = useSetRecoilState(ConfigAtoms.PieChartLayoutOptionState)
  const setPieData = useSetRecoilState(ConfigAtoms.PieChartDataOptionState)
  const setBarLayout = useSetRecoilState(ConfigAtoms.PieChartLayoutOptionState)
  const setBarData = useSetRecoilState(ConfigAtoms.PieChartDataOptionState)
  const setMessage = useSetRecoilState(ConfigAtoms.AlertMessageState)
  const setShowModal = useSetRecoilState(ConfigAtoms.AlertModalState)

  if (WidgetInfo === 'Table' || WidgetInfo === 'Pie' || WidgetInfo === 'Bar') {
    axios
      .post(process.env.REACT_APP_API_SERVER_URL + '/api/tag/describe', TagList)
      .then((response) => {
        console.log('[ Tag Describe data ] : ')
        console.log(response.data)

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
          layout.title = '선택한 Tag 데이터의 비율'

          data[0].labels = labels
          data[0].values = values

          setPieData(data)
          setPieLayout(layout)

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

          setBarData(data)
          setBarLayout(layout)

          DrawGauidWidget(WidgetInfo, node, data, layout)
        }
      })
      .catch((error) => {
        console.log(error)

        setMessage('Error. 담당자에게 문의 바랍니다.')
        setShowModal(true)
      })
  } else {
    axios
      .post(process.env.REACT_APP_API_SERVER_URL + '/api/hmid/chartData?', TagList)
      .then((response) => {
        console.log('[ Chart response data ] : ')
        console.log(response.data)

        if (WidgetInfo === 'TimeSeries') {
          layout_option[0].title = '선택한 Tag의 Data'
          //   setTimeSeriesDataOption(response.data)
          //   setTimeSeriesLayoutOption(layout_option[0])
          DrawGauidWidget(WidgetInfo, node, response.data, layout_option[0])
        } else if (WidgetInfo === 'Line') {
          layout_option[0].title = '선택한 Tag들의 Data'
          DrawGauidWidget(WidgetInfo, node, response.data, layout_option[0])
        }
      })
      .catch((error) => {
        console.log(error)

        setMessage('Error. 담당자에게 문의 바랍니다.')
        setShowModal(true)
      })
  }
}

/**가이드 그리기 위한 함수 */
export const DrawGauidWidget = (widget: string, node: any, option1: any, option2: any) => {
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

export const AddGridGauid = (args: any, idx: number) => {
  const panels: any = panelData
  const index = idx
  const panel: any = Object.keys(panels[index]).map((panelIndex: string) => {
    return panels[index][panelIndex]
  })
  // 그려지고 난 후 실행하기
  for (let j = 0, len = panel.length; j < len; j++) {
    const node: any = document.getElementById(panel[j].id)
    if (panel[j].widget === 'Line') {
      //   setWidgetInfo('Line')
      const result: any = ChangeLineDataArr(useRecoilValue(LineAtoms.LineChartDataOptionState))
      result.then(function (args: any) {
        DrawGauidWidget(panel[j].widget, node, args, useRecoilValue(LineAtoms.LineChartLayoutOptionState))
      })
    } else if (panel[j].widget === 'Bar') {
      //setWidgetInfo('Bar')
      const result: any = ChangeBarDataArr(useRecoilValue(ConfigAtoms.BarChartDataOptionState))
      result.then(function (args: any) {
        DrawGauidWidget(panel[j].widget, node, args, useRecoilValue(ConfigAtoms.BarChartLayoutOptionState))
      })
    } else if (panel[j].widget === 'Pie') {
      //setWidgetInfo('Pie')
      const result: any = ChangePieDataArr(useRecoilValue(ConfigAtoms.PieChartLayoutOptionState))

      result.then(function (args: any) {
        DrawGauidWidget(panel[j].widget, node, args, useRecoilValue(ConfigAtoms.PieChartLayoutOptionState))
      })
      // result.then(function (args: any) {
      //   DrawGauidWidget(panel[j].widget, node, args, JSON.parse(useRecoilValue(PieChartLayoutOptionState)))
      // })
    } else if (panel[j].widget === 'TimeSeries') {
      //setWidgetInfo('Time Series')
      const result: any = ChangeTimeSeriesDataArr(useRecoilValue(ConfigAtoms.TimeSeriesChartDataOptionState))
      result.then(function (args: any) {
        DrawGauidWidget(panel[j].widget, node, args, useRecoilValue(ConfigAtoms.TimeSeriesChartLayoutOptionState))
      })
    } else if (panel[j].widget === 'Table') {
      DrawGauidWidget(
        panel[j].widget,
        node,
        useRecoilValue(ConfigAtoms.DataTableRowState),
        useRecoilValue(ConfigAtoms.DataTableColumnsState)
      )
    }
  }
}

export default { getDataList, DrawGauidWidget, AddGridGauid }
