import axios from 'axios'

import React, { useEffect, useState } from 'react'

const Test = () => {
  const [data, setData] = useState()

  useEffect(() => {
    fetchChartData()
  }, [])

  const fetchChartData = () => {
    axios
      .get('http://222.121.66.49:8001/load_shap_plot')
      .then((response) => {
        console.log('response', response)
        // setData(response)
      })
      .catch((error) => console.log('error:', error))
  }

  return (
    <>
      <div>apiTest</div>
    </>
  )
}

export default Test
