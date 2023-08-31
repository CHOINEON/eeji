import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import {
  ChartComponent,
  SeriesCollectionDirective,
  SeriesDirective,
  Inject,
  ILoadedEventArgs,
  ChartTheme,
  Legend,
  DateTime,
  ScatterSeries,
  IScrollEventArgs,
  Selection,
  AxisModel,
  StripLine,
} from '@syncfusion/ej2-react-charts'
import Button from '@mui/material/Button'
import ChartContextMenu from '../ContextMenu/ChartContextMenu'
import CsvDownloader from 'react-csv-downloader'
import SetValueModal from './SetValueModal'
import { dateTimeToString } from 'common/DateFunction'

const LineSeriesChart = (props: any) => {
  const { chartInputData, chartHeight, onExport, onSave } = props
  const [selectedData, setSelectedData] = useState([])
  const [dataSource, setDataSource] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const ExcludeBtnRef = useRef(null)
  const AddThresholdBtnRef = useRef(null)
  const csvLinkRef = useRef(null)
  const [selectedDatetime, setSelectedDatetime] = useState([])

  let chartInstance: ChartComponent
  // let buttonInstance: ButtonComponent

  // const zoomsettings: ZoomSettingsModel = {
  //   enableSelectionZooming: false, //selection should be used for data selection
  //   enableMouseWheelZooming: true,
  //   enableScrollbar: true,
  // }

  useEffect(() => {
    setDataSource(chartInputData)
  }, [chartInputData])

  useEffect(() => {
    if (onExport) csvLinkRef?.current?.handleClick()
  }, [onExport])

  // useEffect(() => {
  // if (onSave) {
  //   onSave(dataSource)
  // }
  // }, [onSave])

  // useEffect(() => {
  //   const series1: object[] = []

  // for (let i = 0; i < chartInputData.data.length; i++) {

  //   let max = 0
  //   chartInputData.map((value:any, index:number) => {

  // })

  //if (Math.ceil(chartInputData.data[i].y) > 0.5) {
  // chartInputData. += Math.random()
  //} else {
  // value -= Math.random()
  //}
  // let point1 = { x: chartInputData.x, y: Math.round(value) }
  // series1.push(point1)
  // }, [chartInputData])

  useEffect(() => {
    // buttonInstance.addEventListener('contextmenu', (e: any) => {
    // })
  })

  function load(args: ILoadedEventArgs): void {
    setDataSource(chartInputData.data)

    let selectedTheme: string = location.hash.split('/')[1]
    selectedTheme = selectedTheme ? selectedTheme : 'Material'
    args.chart.theme = (selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)).replace(
      /-dark/i,
      'Dark'
    ) as ChartTheme
  }

  const scrollEnd = (args: IScrollEventArgs) => {
    // https://stackblitz.com/run?file=index.ts
  }

  const dragComplete = (args: any) => {
    //가장 넓은 범위의 start/end datetime 선택
    const data: Array<any> = args.selectedDataValues
    // let selectedIndex = 0
    //const length = data[0].length
    let maximumIndex = 0

    // console.log('data:', data)
    for (let i = 0; i < data.length; i++) {
      if (data[i].length > maximumIndex) {
        maximumIndex = i
      }
    }

    // console.log('maximumIndex:', maximumIndex)
    const lengthOfLargestData = data[maximumIndex].length
    // console.log('data[maximumIndex]:', data[maximumIndex].length)

    setSelectedDatetime([data[maximumIndex][0].x, data[maximumIndex][lengthOfLargestData - 1].x])
    // console.log('selectedDatetime:', selectedDatetime)

    // setSelectedDatetime()
    // setSelectedData(args.selectedDataValues[0])
  }

  const handleExport = (e: any) => {
    // const fileName: string = (document.getElementById('fileName') as HTMLInputElement).value
    // chartInstance.exportModule.export(mode.value as ExportType, fileName)
  }

  // const chartMouseDown = (e: any) => {
  //   const target: string = e.target.slice(-13)
  //   if (target.slice(-13) === 'ej2_drag_rect') {
  //     // alert('got it')
  //   }
  // }

  // const dateTimeToString = (date: any) => {
  //   let month = date.getMonth() + 1
  //   let day = date.getDate()
  //   let hour = date.getHours()
  //   let minute = date.getMinutes()
  //   let second = date.getSeconds()

  //   month = month >= 10 ? month : '0' + month
  //   day = day >= 10 ? day : '0' + day
  //   hour = hour >= 10 ? hour : '0' + hour
  //   minute = minute >= 10 ? minute : '0' + minute
  //   second = second >= 10 ? second : '0' + second

  //   return date.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
  // }

  const handleExcludeData = (e: any) => {
    /* selectedData = 
    [{x: Thu Apr 13 2023 08:44:00 GMT+0900 (GMT+09:00), y: 99.59999847}
    {x: Thu Apr 13 2023 09:20:30 GMT+0900 (GMT+09:00), y: 100} ]
    */

    //이벤트 발생 시 selectedDataValues 의 x값이 자동으로 Date.toString()처리됨
    //Tue Apr 25 2023 03:30:00 GMT+0900 (GMT+09:00) datetime형식
    //원본 dataSource의 x값 형태인 {x: '2023-04-04 09:30:00' , y:n }형태로 변환해야 됨

    if (selectedData.length > 0) {
      const tempArr: Array<any> = []
      const rawData = [...dataSource]
      const indexArr = []

      for (let i = 0; i < selectedData.length; i++) {
        const convertedDate = dateTimeToString(selectedData[i].x)
        const indexToRemove = dataSource.findIndex((value: any) => value.x == convertedDate)
        indexArr.push(indexToRemove)

        if (indexToRemove != -1) {
          tempArr.push(dataSource.splice(indexToRemove, 1)[0])
        }
      }
      setDataSource(rawData.filter((item) => !tempArr.includes(item)))
    }
  }

  const handleAddThreshold = (e: any) => {
    //
  }

  const handleCSVExport = () => {
    csvLinkRef?.current?.handleClick()
  }

  const primaryxAxis: AxisModel = {
    // crosshairTooltip: { enable: true },
    valueType: 'DateTime',
    labelFormat: 'M/d hh:mm',
    edgeLabelPlacement: 'Shift',
    majorGridLines: { width: 0 },
    interval: 1,
    labelIntersectAction: 'Rotate45',
  }

  const primaryyAxis: AxisModel = {
    // crosshairTooltip: { enable: true },
    title: '',
    rangePadding: 'None',
    //stripLines: [{ start: threshold, end: threshold + 0.01, color: '#CCDCFF', visible: true }],
    // labelFormat: '000',
    // labelStyle: { color: 'red' },
    // minimum: 0,
    // maximum: 1000,
    // interval: 500,
    // lineStyle: { width: 0 },
    // majorTickLines: { width: 4 },
    // minorTickLines: { width: 0 },
  }

  const handleItemClick = (param: any) => {
    //계속바뀜...뭐지??????????
    // if (param === 'menuitem_2')
    ExcludeBtnRef.current.click()
    // if (param === 'menuitem_4') setModalOpen(true)
  }

  const handleModalClose = (param: any) => {
    setModalOpen(false)
  }

  const handleGetValue = (param: any) => {
    // setThreshold(param)
  }

  const columns = [
    {
      id: 'x',
      displayName: 'Datetime',
    },
    {
      id: 'y',
      displayName: 'Value',
    },
  ]

  const renderMultiSeries = () => {
    if (dataSource && dataSource.length > 0) {
      const multiSeries = dataSource.map((item) => {
        return (
          <SeriesDirective
            dataSource={item.data}
            xName="x"
            yName="y"
            name={item.name}
            // width={2}
            marker={{ visible: true, width: 2, height: 2, shape: 'Circle', isFilled: true }}
            type="Scatter"
          ></SeriesDirective>
        )
      })

      return multiSeries
    }
  }

  return (
    <div className="control-pane">
      <div id="chartSection" className="control-section">
        <ChartComponent
          id="contextmenutarget"
          ref={(chart) => (chartInstance = chart)}
          // zoomSettings={zoomsettings}
          zoomSettings={{
            enableMouseWheelZooming: true,
            // enablePinchZooming: true,
            enableSelectionZooming: false,
            enableScrollbar: true,
            mode: 'X',
          }}
          style={{ textAlign: 'center' }}
          primaryXAxis={primaryxAxis}
          primaryYAxis={primaryyAxis}
          load={load.bind(this)}
          chartArea={{ border: { width: 0 } }}
          title=" "
          max-height="190px"
          height="97%"
          legendSettings={{ position: 'Top' }}
          dragComplete={dragComplete}
          selectionMode="DragX"
          enableExport={true}
        >
          <Inject services={[Selection, ScatterSeries, DateTime, Legend, StripLine]} />
          <SeriesCollectionDirective>{renderMultiSeries()}</SeriesCollectionDirective>
        </ChartComponent>
      </div>

      <ChartContextMenu onItemClicked={handleItemClick} />
      <Button ref={ExcludeBtnRef} style={{ display: 'none' }} onClick={handleExcludeData}>
        Exclude data
      </Button>
      {/* <Button ref={AddThresholdBtnRef} style={{ display: 'none' }} onClick={() => setModalOpen(true)}>
        Add threshold   
      </Button> */}
      <SetValueModal visible={modalOpen} onClose={handleModalClose} onGetValue={handleGetValue} />
      <div id="btn-control" style={{ marginLeft: '60px' }}>
        <CsvDownloader
          style={{ display: 'none' }}
          ref={csvLinkRef}
          filename={chartInputData.name + '-edited-' + new Date()}
          extension=".csv"
          separator=";"
          wrapColumnChar=""
          columns={columns}
          datas={dataSource}
          text="Export as CSV"
        />
      </div>
    </div>
  )
}

export default LineSeriesChart
