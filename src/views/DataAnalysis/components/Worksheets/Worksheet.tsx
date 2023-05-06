import React, { useEffect, useState, useRef, useCallback, forwardRef, useImperativeHandle } from 'react'
// import { Button, WrapItem } from '@chakra-ui/react'
import axios from 'axios'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import LineSeriesChart from '../Chart/LineSeriesChart'

export const chartDiv = (props: any) => {
  return <div style={{ width: '100px', height: '30px', backgroundColor: 'pink' }}>{props.chart}</div>
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
  // const { chart } = props
  const { selectedTags, refresh, onExport } = props

  // const chartType = ['scatterPlot', 'line']
  const chartWrapper = useRef<HTMLDivElement>()
  const [clicked, setClicked] = useState(false)
  const [progressActive, setProgressActive] = useState(false)
  const [chartData, setChartData] = useState([])
  const [chartHeight, setChartHeight] = useState('100%')

  useEffect(() => {
    setChartData([])
  }, [refresh])

  useEffect(() => {
    // console.log('chartWrapper.current:', chartWrapper.current)

    if (selectedTags.length > 0 && clicked) {
      const height = Math.floor(100 / selectedTags.length)

      if (height < 33) {
        setChartHeight('32%') // minimum height : 33%
        // console.log('min   :', height)
      } else {
        setChartHeight(height + '%')
        // console.log('   height:', height)
      }
      // chartWrapper.current.style.height = height + '%'
    }
  }, [clicked, selectedTags])

  const handleCreateChart = () => {
    setClicked(true)
    getChartdata()
    // setActive(true)
  }

  const getChartdata = () => {
    setProgressActive(true)

    if (selectedTags.length > 0) {
      axios.post(process.env.REACT_APP_API_SERVER_URL + '/api/tag/chartData', selectedTags).then(
        (response: any) => {
          setChartData(response.data)
          renderItem()
          setProgressActive(false)
        },
        (error) => {
          console.log('error:', error)
          setProgressActive(false)
        }
      )
    }
  }

  const onSelectChart = (chartType: string) => {
    alert(chartType)
  }

  // useEffect(() => {
  //   // console.log('clicked:', clicked)
  //   // console.log('chartData:', chartData)

  //   if (clicked && chartData.length > 0) renderItem()
  // }, [clicked, chartData])

  const renderItem = () => {
    // console.log('chartHeight:', chartHeight)

    if (clicked && chartData) {
      //리턴할 차트들 여러개 만들기
      const singleChart = chartData.map((value, index) => {
        return (
          <div
            ref={chartWrapper}
            key={index}
            style={{
              width: '100%',
              height: chartHeight,
              float: 'left',
              // border: '1px solid red',
              // backgroundColor: 'pink',
              marginBottom: '10px',
            }}
          >
            <LineSeriesChart onExport={onExport} chartInputData={value} chartHeight={chartHeight} />
          </div>
        )
      })
      return singleChart
    }
  }

  return (
    <>
      <div
        style={{
          // border: '1px solid red',
          width: '100%',
          height: '100%',
          textAlign: 'center',
          display: 'block',
          overflow: 'scroll',
        }}
      >
        {progressActive && <CircularProgress style={{ position: 'relative', top: '200px' }} />}
        {renderItem()}
      </div>
      <div style={{ width: '100%', margin: 'auto', textAlign: 'center' }}>
        <Button
          variant="contained"
          onClick={handleCreateChart}
          style={{ width: '200px', height: '40px', margin: 'auto', marginTop: '5px' }}
        >
          CREATE CHART
        </Button>
      </div>
      {/* <ChartSelectionDialog isOpen={isOpen} onDialogClose={handldDialogClose} onSelectChart={onSelectChart} /> */}
    </>
  )
}

export default Worksheet
