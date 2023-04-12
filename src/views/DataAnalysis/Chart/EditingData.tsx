import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {
  AxisModel,
  ChartComponent,
  SeriesCollectionDirective,
  SeriesDirective,
  Inject,
  Legend,
  Category,
  Tooltip,
  DataLabel,
  ColumnSeries,
  LineSeries,
  DataEditing,
} from '@syncfusion/ej2-react-charts'

export const EditingData = () => {
  const columnData = [
    { x: '2005', y: 21 },
    { x: '2006', y: 60 },
    { x: '2007', y: 45 },
    { x: '2008', y: 50 },
    { x: '2009', y: 74 },
    { x: '2010', y: 65 },
    { x: '2011', y: 85 },
  ]
  const lineData = [
    { x: '2005', y: 21 },
    { x: '2006', y: 22 },
    { x: '2007', y: 36 },
    { x: '2008', y: 34 },
    { x: '2009', y: 54 },
    { x: '2010', y: 55 },
    { x: '2011', y: 60 },
  ]
  const primaryxAxis: AxisModel = {
    valueType: 'Category',
    minimum: -0.5,
    maximum: 6.5,
    labelPlacement: 'OnTicks',
    majorGridLines: { width: 0 },
  }
  const primaryyAxis: AxisModel = {
    rangePadding: 'None',
    minimum: 0,
    title: 'Sales',
    labelFormat: '{value}%',
    maximum: 100,
    interval: 20,
    lineStyle: { width: 0 },
    majorTickLines: { width: 0 },
    minorTickLines: { width: 0 },
  }
  const border = { border: { width: 0 } }
  const tooltip = { enable: true }

  const dragStart = (e: any) => {
    console.log('e:', e)
  }
  const dragEnd = (e: any) => {
    console.log('e:', e)
  }
  const dragComplete = (e: any) => {
    console.log('e:', e)
  }

  const pointClick = (e: any) => {
    console.log('e:', e)
  }

  return (
    <ChartComponent
      id="charts"
      primaryXAxis={primaryxAxis}
      primaryYAxis={primaryyAxis}
      chartArea={border}
      title=" "
      tooltip={tooltip}
      // dragStart={dragStart}
      // dragEnd={dragEnd}
      // dragComplete={dragComplete}
      pointClick={pointClick}
      height={'200px'}
      max-height={'200px'}
    >
      <Inject services={[ColumnSeries, Legend, Tooltip, DataLabel, Category, LineSeries, DataEditing]} />
      <SeriesCollectionDirective>
        <SeriesDirective
          dataSource={columnData}
          xName="x"
          yName="y"
          name="Tag A"
          type="Line"
          dragSettings={{ enable: false }}
          marker={{ visible: true, width: 10, height: 10 }}
        ></SeriesDirective>
        <SeriesDirective
          dataSource={lineData}
          xName="x"
          yName="y"
          name="Tag B"
          type="Line"
          marker={{ visible: true, width: 10, height: 10 }}
          dragSettings={{ enable: false }}
        ></SeriesDirective>
      </SeriesCollectionDirective>
    </ChartComponent>
  )
}

export default EditingData
