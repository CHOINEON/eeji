import React, { useEffect, useState, useRef, useCallback } from 'react'
// import { Button, WrapItem } from '@chakra-ui/react'
import ChartDataSelection from '../Chart/ChartDataSelection'
import EditingData from '../Chart/EditingData'
import SeriesSelectionGrid from '../../Tag/SeriesSelectionGrid'
import axios from 'axios'
import Button from '@mui/material/Button'
import ChartSelectionDialog from '../Chart/ChartSelectionDialog'
import CircularProgress from '@mui/material/CircularProgress'
import LineSeriesChart from '../Chart/LineSeriesChart'

export const chartDiv = (props: any) => {
  return <div style={{ width: '100px', height: '30px', backgroundColor: 'pink' }}>{props.chart}</div>
}

const Worksheet = (props: any) => {
  // const { chart } = props
  const { selectedTags, count, createChart, refresh } = props

  // const chartType = ['scatterPlot', 'line']
  const [active, setActive] = useState(false)
  const [clicked, setClicked] = useState(false)
  const [progressActive, setProgressActive] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const [chartData, setChartData] = useState([])
  const [tagList, setTagList] = useState([])

  const chartWrapper = useRef<HTMLDivElement>()
  const [chartHeight, setChartHeight] = useState('100%')
  // let chartArray: Array<number> = []

  useEffect(() => {
    // console.log('refresh:', refresh)
    setChartData([])
  }, [refresh])

  useEffect(() => {
    // console.log('chartWrapper:', chartWrapper)

    if (clicked && chartWrapper.current !== undefined) {
      const height = Math.floor(100 / count)
      if (height < 33) {
        setChartHeight('33%') // minimum height : 33%
      } else {
        setChartHeight(height + '%')
      }
      chartWrapper.current.style.height = height + '%'
    }

    // if (chartWrapper.current !== undefined) chartWrapper.current.style.height = Math.floor(100 / count) + '%'
    // console.log('chartWrapper:', chartWrapper)
  }, [chartWrapper, clicked, count])

  const handleCreateChart = () => {
    setClicked(true)
    getChartdata()
    // setIsOpen(true)
    // setActive(true)
  }

  const getChartdata = () => {
    // console.log('getChartdata:', selectedTags)
    setProgressActive(true)

    if (selectedTags.length > 0) {
      axios.post(process.env.REACT_APP_API_SERVER_URL + '/api/tag/chartData', selectedTags).then(
        (response: any) => {
          console.log('getChartdata response:', response.data)

          //response is like this:
          // [{
          //   name: "Tag-n",
          //   data : [{ x: datetime , y: value }]
          // }]

          setChartData(response.data)

          //progess circle 안보이게
          setProgressActive(false)
        },
        (error) => {
          console.log('error:', error)
          setProgressActive(false)
        }
      )
    }
  }

  const handldDialogClose = () => {
    setIsOpen(false)
  }

  const onSelectChart = (chartType: string) => {
    alert(chartType)
  }

  useEffect(() => {
    renderItem()
  }, [clicked, chartData])

  const renderItem = () => {
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
            <LineSeriesChart chartInputData={value} chartHeight={chartHeight} />
          </div>
        )
      })
      return singleChart
    } else {
      // return (
      //   <Button
      //     colorScheme="teal"
      //     variant="outline"
      //     onClick={handleCreateChart}
      //     style={{ position: 'relative', top: '200px' }}
      //   >
      //     CREATE CHART
      //   </Button>
      // )
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
