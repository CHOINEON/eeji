import axios from 'axios'
//recoil
import { useSetRecoilState, useRecoilValue } from 'recoil'
import * as ConfigAtoms from '../../recoil/config/atoms'
// import { DrawGauidWidget } from '../GridLayoutTest'

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

          //DrawGauidWidget(WidgetInfo, node, row, column)
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

          //DrawGauidWidget(WidgetInfo, node, data, layout)
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

          //DrawGauidWidget(WidgetInfo, node, data, layout)
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
          //DrawGauidWidget(WidgetInfo, node, response.data, layout_option[0])
        } else if (WidgetInfo === 'Line') {
          layout_option[0].title = '선택한 Tag들의 Data'
          //DrawGauidWidget(WidgetInfo, node, response.data, layout_option[0])
        }
      })
      .catch((error) => {
        console.log(error)

        setMessage('Error. 담당자에게 문의 바랍니다.')
        setShowModal(true)
      })
  }
}

export default { getDataList }
