import React, { useEffect, useState, useRef } from 'react'
import { Button, WrapItem } from '@chakra-ui/react'
import ChartDataSelection from '../Chart/ChartDataSelection'
import EditingData from '../Chart/EditingData'
import SeriesSelectionGrid from '../Tag/SeriesSelectionGrid'
import axios from 'axios'

// export const chartDiv = (props: any) => {
//   return <div style={{ width: '100px', height: '30px', backgroundColor: 'pink' }}>{props}</div>
// }

const Worksheet = (props: any) => {
  // const { chart } = props
  const { selectedTags, count } = props

  // let chart = ['scatterPlot', 'line']\
  const [chart, setChart] = useState([])
  const [height, setHeight] = useState('100%')
  const [chartData, setChartData] = useState()

  const chartWrapper = useRef(null)

  useEffect(() => {
    console.log('chart:', chart)

    const tempArray = new Array(chart.length)
    // if (chartWrapper) chartWrapper.current.style.height = 100 / chart.length
  }, [chart])

  const handleCreateChart = () => {
    // alert('차트 생성 팝업 show')
    getChartdata()
  }

  const getChartdata = () => {
    console.log('selectedTags:', selectedTags)
    ///////////////////Add Spinner ///////////////////
    axios.post('http://220.94.157.27:59871/api/tag/chartData', selectedTags).then(
      (response: any) => {
        console.log('response:', response)
        setChartData(response.data)
      },
      (error) => {
        console.log('error:', error)
      }
    )
  }

  return (
    <>
      {/* <ChartDataSelection data={chartData} /> */}
      <div style={{ width: '100%', height: '100px', textAlign: 'center', marginTop: '200px' }}>
        <Button colorScheme="teal" variant="outline" onClick={handleCreateChart}>
          CREATE CHART
        </Button>
      </div>

      {chart.map((index: any) => {
        return (
          <>
            <div
              ref={chartWrapper}
              style={{
                width: '100%',
                // height: { height },
                height: '100px',
                backgroundColor: 'pink',
                border: '1px solid red',
                marginBottom: '10px',
              }}
              key={index}
            />
          </>
        )
      })}
    </>
  )
}

export default Worksheet
