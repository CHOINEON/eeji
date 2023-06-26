import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
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
  ScatterSeries,
  Zoom,
  ZoomSettingsModel,
  ScrollBar,
  IScrollEventArgs,
  Selection,
  AxisModel,
  StripLine,
  StripLinesDirective,
  StripLineDirective,
  minMax,
  Trendline,
} from '@syncfusion/ej2-react-charts'
// import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import Button from '@mui/material/Button'
import ChartContextMenu from '../ContextMenu/ChartContextMenu'
// import { CSVLink, CSVDownload } from 'react-csv'
// import CsvDownloader from 'react-csv-downloader'
import SetValueModal from './SetValueModal'
import { useRecoilState, useRecoilValue } from 'recoil'
import { excludeHistoryStore, indexColumnStore } from 'views/DataAnalysis/atom'
import HistoryModal from './HistoryModal'

const LineSeriesChart = (props: any) => {
  const { chartInputData, chartHeight, onExport, onSave } = props
  const [dataSource, setDataSource] = useState([])

  const [modalOpen, setModalOpen] = useState(false)
  const ExcludeBtnRef = useRef(null)
  const csvLinkRef = useRef(null)
  const [selectedDatetime, setSelectedDatetime] = useState([])

  const indexColumn = useRecoilValue(indexColumnStore)
  const [excludedData, setExcludedData] = useRecoilState(excludeHistoryStore)

  // For threshold
  // const [threshold, setThreshold] = useState(0)
  // const AddThresholdBtnRef = useRef(null)

  const chartRef: any = useRef()

  const primaryxAxis: AxisModel = {
    // crosshairTooltip: { enable: true },
    valueType: 'DateTime',
    labelFormat: 'M/d hh:mm',
    interval: 5,
    edgeLabelPlacement: 'Shift',
    majorGridLines: { width: 0 },
    labelIntersectAction: 'Rotate45',
  }

  // const [primaryxAxis, setPrimaryxAxis] = useState<AxisModel>(defaultXAxis)
  useEffect(() => setExcludedData([]), [])

  useEffect(() => {
    // console.log('useref:', chartRef)

    if (indexColumn == '') {
      chartRef.current.properties.labelformat = ''
      chartRef.current.properties.valueType = 'Double'
    } else {
      chartRef.current.properties.valueType = 'DateTime'
      chartRef.current.properties.labelformat = 'M/d hh:mm'
    }
  }, [chartRef])

  useEffect(() => {
    // console.log('chartInputData:', chartInputData)
    setDataSource(chartInputData)
    setExcludedData([]) //제거된 데이터 배열 초기화
  }, [chartInputData])

  // useEffect(() => {
  //   if (onExport) csvLinkRef?.current?.handleClick()
  // }, [onExport])

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

  function load(args: ILoadedEventArgs): void {
    setDataSource(chartInputData.data)

    let selectedTheme: string = location.hash.split('/')[1]
    selectedTheme = selectedTheme ? selectedTheme : 'Material'
    args.chart.theme = (selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)).replace(
      /-dark/i,
      'Dark'
    ) as ChartTheme
  }

  const dragComplete = (args: any) => {
    //가장 넓은 범위의 start/end datetime 선택하기 위해 loop 처리
    const data: Array<any> = args.selectedDataValues
    let minDatetime = 0
    let maxDatetime = 0

    for (let i = 0; i < data.length; i++) {
      if (i === 0) {
        minDatetime = data[i][0].x
        maxDatetime = data[i][data[0].length - 1].x
      } else {
        const min = data[i][0].x
        const max = data[i][data[i].length - 1].x

        if (min < minDatetime) {
          minDatetime = min
        }
        if (max > maxDatetime) {
          maxDatetime = max
        }
      }
    }

    setSelectedDatetime([minDatetime, maxDatetime])
    console.log('selectedDatetime:', selectedDatetime)
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

  const dateTimeToString = (date: any) => {
    let month = date.getMonth() + 1
    let day = date.getDate()
    let hour = date.getHours()
    let minute = date.getMinutes()
    let second = date.getSeconds()

    month = month >= 10 ? month : '0' + month
    day = day >= 10 ? day : '0' + day
    hour = hour >= 10 ? hour : '0' + hour
    minute = minute >= 10 ? minute : '0' + minute
    second = second >= 10 ? second : '0' + second

    return date.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
  }

  useEffect(() => console.log('excludedData:', excludedData), [excludedData])

  const handleExcludeData = (e: any) => {
    console.log('-----------------handleExcludeData---------------------')
    // console.log('original:', dataSource)

    //선택된 구간의 시작/종료 시각
    const selected_start = new Date(Date.parse(selectedDatetime[0]))
    const selected_end = new Date(Date.parse(selectedDatetime[1]))

    console.log('시작::', selected_start)
    console.log('종료::', selected_end)

    //recoil state update
    const historyRow = {
      start: dateTimeToString(selected_start),
      end: dateTimeToString(selected_end),
      datetime: dateTimeToString(new Date()),
    }
    console.log('historyRow-', historyRow)

    console.log('------------------------', excludedData)
    setExcludedData((prep) => [...prep, historyRow])

    const newDataArr = []
    for (let i = 0; i < dataSource.length; i++) {
      const tagData: Array<any> = dataSource[i].data
      const tagName = dataSource[i].name

      //실제 각 태그 데이터에서 해당 구간의 시작/종료 인덱스 찾기
      let startIdx = 0
      let endIdx = 0
      let stopYN = 0 //1: yes, stop , 0: no, keep doing this

      // console.log('tagData:', tagData)
      // console.log('tagName:', tagName)

      for (let j = 0; j < tagData.length; j++) {
        const x = new Date(Date.parse(tagData[j].x))

        if (x >= selected_start) {
          if (stopYN === 0) {
            startIdx = j
            stopYN = 1 //최초 한 번만 돌도록 flag 설정
          } else if (x >= selected_end) {
            endIdx = j // 최대값 초과하면 멈추고 인덱스 저장
            break
          }
        }
      }
      // console.log('idx:', startIdx, endIdx)

      const arrayToRemove = tagData.slice(startIdx, endIdx) // 삭제할 구간 데이터 담은 변수
      newDataArr.push({ data: tagData.filter((item) => !arrayToRemove.includes(item)), name: tagName })
    }
    setDataSource(newDataArr)
    // console.log('dataSource:', dataSource)
  }

  const handleAddThreshold = (e: any) => {
    //
  }

  const handleCSVExport = () => {
    csvLinkRef?.current?.handleClick()
  }

  // const primaryxAxis: AxisModel = {
  //   // crosshairTooltip: { enable: true },
  //   valueType: 'DateTime',
  //   labelFormat: 'M/d hh:mm',
  //   // valueType: 'Double',
  //   interval: 5,
  //   edgeLabelPlacement: 'Shift',
  //   majorGridLines: { width: 0 },
  //   labelIntersectAction: 'Rotate45',
  // }

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
    console.log('handleItemClick:', param)

    if (param === 'item1') ExcludeBtnRef.current.click()
    if (param === 'item2') setModalOpen(true)
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
    // console.log('renderMultiSeries')
    if (dataSource && dataSource.length > 0) {
      const multiSeries = dataSource.map((item, idx) => {
        return (
          <SeriesDirective
            dataSource={item.data}
            key={item.name + '_key'}
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
      {/* <style>{SAMPLE_CSS}</style> */}
      <div id="chartSection" className="control-section">
        <ChartComponent
          id="contextmenutarget"
          ref={chartRef}
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
          // load={load.bind(this)}
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
      <HistoryModal visible={modalOpen} onClose={handleModalClose} onGetValue={handleGetValue} />
      {/* <div id="btn-control" style={{ marginLeft: '60px' }}>
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
      </div> */}
    </div>
  )
}

export default LineSeriesChart
