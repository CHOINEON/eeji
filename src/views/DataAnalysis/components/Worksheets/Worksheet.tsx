import React, { useEffect, useState, useRef, useCallback, forwardRef, useImperativeHandle } from 'react'
// import { Button, WrapItem } from '@chakra-ui/react'
import axios from 'axios'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import LineSeriesChart from '../Chart/LineSeriesChart'
import LineChart from '../Chart/LineChart'

export const chartDiv = (props: any) => {
  return <div style={{ width: '100px', height: '30px' }}>{props.chart}</div>
}

// export const Child = forwardRef((props, ref) => {
//   useImperativeHandle(ref, () => ({
//     childFunction1() {
//       return Worksheet
//     },
//     childFunction2() {
//       alert('child function 2 called')
//     },
//   }))

//   return (
//     <div>
//       <h2>child content</h2>
//     </div>
//   )
// })

const Worksheet = (props: any) => {
  const { selectedTags, refresh, onExport, onSave } = props

  // const chartType = ['scatterPlot', 'line']
  const chartWrapper = useRef<HTMLDivElement>()
  const [progressActive, setProgressActive] = useState(false)
  const [chartData, setChartData] = useState([])
  const [chartHeight, setChartHeight] = useState('97%')

  //ResizeObserver loop limit exceeded 에러 방지
  useEffect(() => {
    window.addEventListener('error', (e) => {
      if (e.message === 'ResizeObserver loop limit exceeded') {
        const resizeObserverErrDiv = document.getElementById('webpack-dev-server-client-overlay-div')
        const resizeObserverErr = document.getElementById('webpack-dev-server-client-overlay')
        if (resizeObserverErr) {
          resizeObserverErr.setAttribute('style', 'display: none')
        }
        if (resizeObserverErrDiv) {
          resizeObserverErrDiv.setAttribute('style', 'display: none')
        }
      }
    })
  }, [])

  // useEffect(() => {
  //   setChartData([])
  // }, [refresh])

  // useEffect(() => {
  //   if (selectedTags.length > 0) {
  //     const height = Math.floor(100 / selectedTags.length)
  //     if (height < 33) {
  //       setChartHeight('32%') // minimum height : 33%
  //     } else {
  //       setChartHeight(height + '%')
  //     }
  //      chartWrapper.current.style.height = height + '%'
  //   }
  // }, [selectedTags])

  const handleCreateChart = () => {
    // setClicked(true)
    getChartdata()
    // setActive(true)
  }

  const getChartdata = () => {
    setProgressActive(true)

    if (selectedTags.length > 0) {
      axios.post(process.env.REACT_APP_API_SERVER_URL + '/api/tag/chartData1', selectedTags).then(
        (response: any) => {
          if (response.status === 200) {
            // console.log('chartData response: ', response.data)
            setChartData(response.data)
            // renderItem()
            setProgressActive(false)
          }
        },
        (error) => {
          console.log('error:', error)
          setProgressActive(false)
        }
      )
    }
  }

  const renderItem = () => {
    // console.log('renderItem:', chartData)

    if (chartData.length > 0) {
      const singleChart = (
        <LineSeriesChart onExport={onExport} chartInputData={chartData} chartHeight={chartHeight} onSave={onSave} />
      )

      return singleChart

      //리턴할 차트들 여러개 만들기
      // const singleChart = chartData.map((value, index) => {
      //   return (
      //     <div
      //       ref={chartWrapper}
      //       key={index}
      //       style={{
      //         width: '100%',
      //         height: chartHeight,
      //         maxHeight: '97%',
      //         float: 'left',
      //         // border: '1px solid red',
      //         // backgroundColor: 'pink',
      //         marginBottom: '10px',
      //       }}
      //     >
      //       <LineSeriesChart onExport={onExport} chartInputData={value} chartHeight={chartHeight} onSave={onSave} />
      //     </div>
      //   )
      // })
      // return singleChart
    }
  }

  return (
    <>
      {/* <LineChart /> */}
      <div
        className="rounded-box"
        style={{
          width: '100%',
          height: '100%',
          textAlign: 'center',
          display: 'block',
          overflow: 'auto',
          zIndex: 0,
        }}
      >
        {progressActive && <CircularProgress style={{ position: 'relative', top: '200px' }} />}
        {renderItem()}
      </div>
      <div style={{ width: '100%', margin: 'auto', textAlign: 'center' }}>
        <Button
          variant="contained"
          onClick={handleCreateChart}
          style={{ width: '200px', height: '40px', margin: 'auto', marginTop: '5px', borderRadius: '10px' }}
        >
          CREATE CHART
        </Button>
      </div>
      {/* <ChartSelectionDialog isOpen={isOpen} onDialogClose={handldDialogClose} onSelectChart={onSelectChart} /> */}
    </>
  )
}

export default Worksheet
