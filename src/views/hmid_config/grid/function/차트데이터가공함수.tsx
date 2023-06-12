import * as d3 from 'd3'
//recoil
import { useSetRecoilState, useRecoilState } from 'recoil'
import { LineChartDataOptionState } from '../../recoil/line/atoms'
import { TimeSeriesChartDataOptionState } from '../../recoil/timeseries/atoms'

export const ChangeLineDataArr = (dataOption: any) => {
  let ChartDataObj: any = {}
  const ChartDataArr: any = []

  const setLineData = useSetRecoilState(LineChartDataOptionState)

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

  setLineData(ChartDataArr)
  return ChartDataArr
}
export const ChangeBarDataArr = (dataOption: any) => {
  let ChartDataObj: any = {}
  const ChartDataArr: any = []

  const data = [
    {
      x: ['A', 'B', 'C', 'D', 'E', 'F'],
      y: [20, 14, 23, 35, 40, 56],
      name: 'data A',
      type: 'bar',
    },
  ]

  if (dataOption[0] !== undefined) {
    const resetData = dataOption[0]
    delete resetData.x
    delete resetData.y

    for (let i = 0, len = data.length; i < len; i++) {
      ChartDataObj = {
        ...resetData,
        x: data[i].x,
        y: data[i].y,
      }

      ChartDataArr.push(ChartDataObj)

      ChartDataObj = new Object()

      //   setBarData(ChartDataArr)
    }
  } else {
    for (let i = 0, len = data.length; i < len; i++) {
      ChartDataObj = {
        ...dataOption,
        x: data[i].x,
        y: data[i].y,
      }

      ChartDataArr.push(ChartDataObj)

      ChartDataObj = new Object()
      //   setBarData(ChartDataArr)
    }
  }

  return ChartDataArr
}
export const ChangePieDataArr = (dataOption: any) => {
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

    // setPieData(ChartDataArr)
  } else {
    ChartDataArr = dataOption
  }
  return ChartDataArr
}

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

export const ChangeTimeSeriesDataArr = async () => {
  let ChartDataObj: any = {}
  const ChartDataArr: any = []

  const [timeSeriesData, setTimeSeriesData] = useRecoilState(TimeSeriesChartDataOptionState)

  const data = await d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/2016-weather-data-seattle.csv')
  const trace1 = prepData(data)

  for (let i = 0, len = trace1.length; i < len; i++) {
    ChartDataObj = {
      ...timeSeriesData,
      x: trace1[i].x,
      y: trace1[i].y,
    }
    ChartDataArr.push(ChartDataObj)
    ChartDataObj = new Object()
  }

  // setTimeSeriesData(ChartDataArr)

  return ChartDataArr
}

export default { ChangeLineDataArr, ChangeBarDataArr, ChangePieDataArr, ChangeTimeSeriesDataArr }
