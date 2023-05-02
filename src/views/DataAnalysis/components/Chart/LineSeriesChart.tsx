import React, { useEffect } from 'react'
import {
  ChartComponent,
  SeriesCollectionDirective,
  SeriesDirective,
  Inject,
  ILoadedEventArgs,
  ChartTheme,
  LineSeries,
  Legend,
  DateTime,
  Tooltip,
  Highlight,
  ScatterSeries,
  Zoom,
  Crosshair,
  ZoomSettingsModel,
  ScrollBar,
  IScrollEventArgs,
} from '@syncfusion/ej2-react-charts'
import { Browser } from '@syncfusion/ej2-base'

// export const data1 = [
//   { x: new Date(2012, 6, 11), y: 13.5 },
//   { x: new Date(2013, 6, 11), y: 12.4 },
//   { x: new Date(2014, 6, 11), y: 12.7 },
//   { x: new Date(2015, 6, 11), y: 12.5 },
//   { x: new Date(2016, 6, 11), y: 12.7 },
//   { x: new Date(2017, 6, 11), y: 13.7 },
//   { x: new Date(2018, 6, 11), y: 13.4 },
//   { x: new Date(2019, 6, 11), y: 12.9 },
//   { x: new Date(2020, 6, 11), y: 11.0 },
// ]
// export const data2 = [
//   { x: new Date(2012, 6, 11), y: 5.3 },
//   { x: new Date(2013, 6, 11), y: 5.6 },
//   { x: new Date(2014, 6, 11), y: 5.9 },
//   { x: new Date(2015, 6, 11), y: 5.7 },
//   { x: new Date(2016, 6, 11), y: 7.8 },
//   { x: new Date(2017, 6, 11), y: 10.3 },
//   { x: new Date(2018, 6, 11), y: 15.5 },
//   { x: new Date(2019, 6, 11), y: 17.5 },
//   { x: new Date(2020, 6, 11), y: 19.5 },
// ]
const zoomsettings: ZoomSettingsModel = {
  enableSelectionZooming: true,
  enableScrollbar: true,
}

const SAMPLE_CSS = `
  .control-fluid {
      padding: 0px !important;
  }
  .charts {
      align :center
  }`

const LineSeriesChart = (props: any) => {
  const { chartInputData, chartHeight } = props

  useEffect(() => {
    const series1: object[] = []
    console.log('chartInputData:', chartInputData)

    for (let i = 0; i < chartInputData.data.length; i++) {
      console.log('Math.ceil(chartInputData.data.y):', chartInputData.data[i].y)
      if (Math.ceil(chartInputData.data[i].y) > 0.5) {
        // chartInputData. += Math.random()
      } else {
        // value -= Math.random()
      }
      // point1 = { x: chartInputData.x, y: Math.round(value) }
      // series1.push(point1)
    }
  }, [chartInputData])

  useEffect(() => {
    // console.log('chartHeight:', chartHeight)
  }, [chartHeight])

  function onChartLoad(args: ILoadedEventArgs): void {
    const chart: Element = document.getElementById('charts')
    chart.setAttribute('title', '')
  }
  function load(args: ILoadedEventArgs): void {
    let selectedTheme: string = location.hash.split('/')[1]
    selectedTheme = selectedTheme ? selectedTheme : 'Material'
    args.chart.theme = (selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)).replace(
      /-dark/i,
      'Dark'
    ) as ChartTheme
  }

  const scrollEnd = (args: IScrollEventArgs) => {
    // https://stackblitz.com/run?file=index.ts
    // console.log('args:', args)
  }

  return (
    <div className="control-pane">
      <style>{SAMPLE_CSS}</style>
      <div className="control-section">
        <ChartComponent
          zoomSettings={zoomsettings}
          style={{ textAlign: 'center' }}
          primaryXAxis={{
            // crosshairTooltip: { enable: true },
            valueType: 'DateTime',
            edgeLabelPlacement: 'Shift',
            majorGridLines: { width: 0 },
            labelFormat: 'M/dd',
            interval: 1,
            labelIntersectAction: 'Rotate45',
          }}
          load={load.bind(this)}
          primaryYAxis={{
            // crosshairTooltip: { enable: true },
            title: '',
            rangePadding: 'None',
            labelStyle: { color: 'red' },
            minimum: 0,
            // maximum: 20,
            // interval: 4,
            // lineStyle: { width: 0 },
            // majorTickLines: { width: 0 },
            // minorTickLines: { width: 0 },
          }}
          chartArea={{ border: { width: 0 } }}
          tooltip={{ enable: false }}
          legendSettings={{ position: 'Top', enableHighlight: true }}
          width="100%"
          height={chartHeight}
          // height="20%"
          // width={Browser.isDevice ? '100%' : '75%'}
          title=" "
          // loaded={onChartLoad.bind(this)}
          scrollEnd={scrollEnd}
        >
          <Inject services={[LineSeries, DateTime, Legend, Tooltip, Highlight, Zoom, ScrollBar]} />

          <SeriesCollectionDirective>
            <SeriesDirective
              dataSource={chartInputData.data}
              xName="x"
              yName="y"
              name={chartInputData.name}
              // width={2}
              // marker={{ visible: true, width: 7, height: 7, shape: 'Circle', isFilled: true }}
              type="Line"
            ></SeriesDirective>
          </SeriesCollectionDirective>
        </ChartComponent>
      </div>
    </div>
  )
}

export default LineSeriesChart
