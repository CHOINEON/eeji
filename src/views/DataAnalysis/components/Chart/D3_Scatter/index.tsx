import React, { useState, useEffect, useRef } from 'react'
import PropsTypes from 'prop-types'
import ScatterPlot from './ScatterPlot'

const arr = [
  {
    일시: '2021-01-01T00:00:00',
    산소부화율: 31999,
    풍압: 4181,
    풍온: 1230,
  },
  {
    일시: '2021-01-01T00:00:00',
    산소부화율: 32010,
    풍압: 4183,
    풍온: 1229,
  },
  {
    일시: '2021-01-01T00:00:00',
    산소부화율: 31991,
    풍압: 4162,
    풍온: 1228,
  },
  {
    일시: '2021-01-01T00:00:00',
    산소부화율: 31993,
    풍압: 4204,
    풍온: 1227,
  },
  {
    일시: '2021-01-01T00:00:00',
    산소부화율: 32016,
    풍압: 4156,
    풍온: 1230,
  },
]

const CorrelationPlot = () => {
  // console.log('Corrplot index:', data)
  return <div> {/* <ScatterPlot data={arr} /> */}</div>
}

CorrelationPlot.propTypes = {
  dataSource: PropsTypes.array,
}

export default CorrelationPlot
