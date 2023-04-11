import React from 'react'
import ChartDataSelection from './Chart/ChartDataSelection'
import EditingData from './Chart/EditingData'
import SeriesSelectionGrid from './Tag/SeriesSelectionGrid'

const Worksheet = () => {
  return (
    <>
      <div style={{ height: '33%' }}>
        {/* <EditingData /> */}
        {/* <ChartDataSelection /> */}
      </div>
      <div style={{ height: '33%' }}>
        {/* <EditingData /> */}
        <ChartDataSelection />
      </div>
      <div style={{ height: '33%' }}>{/* <ChartDataSelection /> */}</div>
      <div style={{ height: '33%' }}>
        <SeriesSelectionGrid />
      </div>
    </>
  )
}

export default Worksheet
