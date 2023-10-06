import React, { useEffect } from 'react'

const BTCdetection = () => {
  useEffect(() => {
    //
    getSocketData()
  }, [])

  const getSocketData = () => {
    const ws = new WebSocket('ws://10.89.28.158:8001/ws/web')
    ws.onmessage = (event) => {
      const receivedData = JSON.parse(event.data)
      console.log('receivedData:', receivedData)
      //   xData.push(receivedData.index[0])
      //   priceData.push(receivedData.data[0][0])
      //   volumeData.push(receivedData.data[0][1])
      //   anomalyScores.push(receivedData.anomaly_pred[0])
      //   anomalyThreshold = receivedData.thr[0]

      //   if (receivedData.is_anormaly[0]) {
      //     console.warn('Anomaly detected at index ', receivedData.index[0])
      //     anomalyPointsX.push(receivedData.index[0])
      //     anomalyPointsPrice.push(receivedData.data[0][0])
      //     anomalyPointsVolume.push(receivedData.data[0][1])
      //   }

      //   // Update the Price plot
      //   Plotly.update('price-div', {
      //     x: [xData, xData, [xData[0], xData[xData.length - 1]], anomalyPointsX],
      //     y: [priceData, anomalyScores, [anomalyThreshold, anomalyThreshold], anomalyPointsPrice],
      //   })

      //   // Update the Volume plot
      //   Plotly.update('volume-div', {
      //     x: [xData, xData, [xData[0], xData[xData.length - 1]], anomalyPointsX],
      //     y: [volumeData, anomalyScores, [anomalyThreshold, anomalyThreshold], anomalyPointsVolume],
      //   })
      // }

      ws.onerror = (error) => {
        console.error('WebSocket Error: ', error)
      }

      ws.onclose = (event) => {
        if (event.wasClean) {
          console.info(`Closed cleanly, code=${event.code}, reason=${event.reason}`)
        } else {
          console.warn('Connection died')
        }
      }
    }
  }

  return <div>BTCprice</div>
}

export default BTCdetection
