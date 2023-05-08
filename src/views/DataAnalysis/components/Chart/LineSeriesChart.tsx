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
} from '@syncfusion/ej2-react-charts'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import Button from '@mui/material/Button'
import ChartContextMenu from '../ContextMenu/ChartContextMenu'
// import { CSVLink, CSVDownload } from 'react-csv'
import CsvDownloader from 'react-csv-downloader'
import SetValueModal from './SetValueModal'

const SAMPLE_CSS = `
     .control-fluid {
         padding: 0px !important;
     }
     #btn-control {
         width: 100%;
         text-align: center;
     }
 
     .e-export-icon::before {
         content: '\\e728';
     }
     
     .e-view.fabric .e-export-icon::before, .e-view.fabric-dark .e-export-icon::before  {
         content: '\\e710';
     }
     
     .e-view.bootstrap4 .e-export-icon::before {
         content: '\\e780';
     }
     
     .e-view.tailwind-dark .e-export-icon::before, .e-view.tailwind .e-export-icon::before {
         content: '\\e7bf';
     }
     
     .e-view.highcontrast .e-export-icon::before {
         content: '\\e710';
     }
     
     .e-view.bootstrap5 .e-export-icon::before, .e-view.bootstrap5-dark .e-export-icon::before {
         content: '\\e72e';
     }

     .control-fluid {
      padding: 0px !important;
      }

      .charts {
          align :center
      }
  `

const LineSeriesChart = (props: any) => {
  const { chartInputData, chartHeight, onExport } = props
  const [selectedData, setSelectedData] = useState([])
  const [dataSource, setDataSource] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [threshold, setThreshold] = useState(0)
  const ExcludeBtnRef = useRef(null)
  const AddThresholdBtnRef = useRef(null)
  const csvLinkRef = useRef(null)

  let chartInstance: ChartComponent
  let buttonInstance: ButtonComponent

  const zoomsettings: ZoomSettingsModel = {
    enableMouseWheelZooming: true,
    enableSelectionZooming: false, //selection should be used for data selection
    enableScrollbar: true,
  }

  useEffect(() => {
    setDataSource(chartInputData.data)
  }, [chartInputData])

  useEffect(() => {
    if (onExport) csvLinkRef?.current?.handleClick()
  }, [onExport])

  // useEffect(() => {
  //   const series1: object[] = []
  //   console.log('chartInputData:', chartInputData)

  // for (let i = 0; i < chartInputData.data.length; i++) {
  //   console.log('Math.ceil(chartInputData.data.y):', chartInputData.data[i].y)

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
    //   console.log('buttonInstance contextmenu:', e)
    // })
    // console.log('button:', buttonInstance)
  })

  const onChartLoad = (args: ILoadedEventArgs) => {
    // console.log('onChartLoad:', chartInstance)
    // const chart: Element = document.getElementById('charts')
    // chart.setAttribute('title', '')
    // if (chartInstance) {
    //   chartInstance.addEventListener('contextmenu', (e: any) => {
    //     // console.log('e:', e)
    //   })
    // }
  }

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
    console.log('scrollEnd:', args)
    // https://stackblitz.com/run?file=index.ts
    // console.log('args:', args)
  }

  const dragComplete = (args: any) => {
    // console.log()
    setSelectedData(args.selectedDataValues[0])
    // console.log('dragComplete e::', e)
  }

  const handleExport = (e: any) => {
    // console.log('handleExport:', e)
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
        // console.log('before:', selectedData[i].x)
        // console.log('converted:', dateTimeToString(selectedData[i].x))

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
    console.log('csvLinkRef?.current:', csvLinkRef?.current)
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
    stripLines: [{ start: threshold, end: threshold + 0.01, color: '#CCDCFF', visible: true }],
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
    if (param === 'menuitem_2') ExcludeBtnRef.current.click()
    if (param === 'menuitem_4') setModalOpen(true)
  }

  const handleModalClose = (param: any) => {
    // console.log('param:', param)
    setModalOpen(false)
  }

  const handleGetValue = (param: any) => {
    console.log('param:', param)
    setThreshold(param)
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

  return (
    <div className="control-pane">
      <style>{SAMPLE_CSS}</style>
      <div id="chartSection" className="control-section">
        <ChartComponent
          id="contextmenutarget"
          ref={(chart) => (chartInstance = chart)}
          zoomSettings={zoomsettings}
          style={{ textAlign: 'center' }}
          primaryXAxis={primaryxAxis}
          primaryYAxis={primaryyAxis}
          load={load.bind(this)}
          chartArea={{ border: { width: 0 } }}
          title=" "
          loaded={onChartLoad}
          max-height="190px"
          height="97%"
          // height={chartHeight}
          // chartMouseClick={handleChartMouseClick}
          // onClick={handleChartClick}
          // tooltip={{ enable: true }}
          legendSettings={{ position: 'Top' }}
          // width="100%"
          // scrollEnd={scrollEnd}
          dragComplete={dragComplete}
          selectionMode="DragXY"
          // chartMouseDown={chartMouseDown}
          enableExport={true}
        >
          <Inject services={[Selection, ScatterSeries, DateTime, Legend, StripLine]} />
          <SeriesCollectionDirective>
            <SeriesDirective
              dataSource={dataSource}
              xName="x"
              yName="y"
              name={chartInputData.name}
              // width={2}
              marker={{ visible: true, width: 3, height: 3, shape: 'Circle', isFilled: true }}
              type="Scatter"
            ></SeriesDirective>
          </SeriesCollectionDirective>
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
