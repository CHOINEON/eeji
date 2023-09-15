/* eslint-disable prettier/prettier */
import { Box } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import Plot from 'react-plotly.js'
import { Switch, Space } from 'antd'
// import window.SHAP from 'bundle.js'

{/* <script type="text/javascript" src="/test/bundle.js" charset="utf-8"></script> */}


async function load_shap_plot(event) {
  event.preventDefault()
  
  const shapPlotContainer = document.getElementById("shapPlotContainer");
  try {
    const response = await fetch('http://222.121.66.49:8001/load_shap_plot', {
      method: 'GET',
    }
    );
    console.log('test:', response)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const result = await response.text();
    shapPlotContainer.innerHTML = stripAndExecuteScript(result);
    stripAndExecuteScript(result);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function stripAndExecuteScript(text) {
  var scripts = '';
  var cleaned = text.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, function(){
      scripts += arguments[1] + '\n';
      return '';
  });
  if (window.execScript){
      window.execScript(scripts);
      console.log('hi')
  } else {
      var head = document.getElementsByTagName('head')[0];
      var scriptElement = document.createElement('script');
      scriptElement.setAttribute('type', 'text/javascript');
      scriptElement.innerText = scripts;
      console.log(scripts);
      head.appendChild(scriptElement);
      head.removeChild(scriptElement);
  }
  return cleaned;
};


const AdvancedChart = () => {
  //새로운 주소로 바뀔 예정
  const originURL = 'ws://222.121.66.49:8001/ws/web'
  const imgURL = 'http://222.121.66.49:8000/static/shap.png' 
  // const load_shapURL =  'http://222.121.66.49:8001/load_shap_plot' 
  // const [shapData, setShapData] = useState([]);


  /* managing the states of incoming data */
  const [socketData, setSocketData] = useState({})
  const [chartData, setChartData] = useState([])
  const [index, setIndex] = useState([])
  // const [isAnomaly, setIsAnomaly] = useState([])

  const [dataArr, setDataArr] = useState([])
  const [testData, setTestData] = useState([])
  const [anomalyScoreArr, setAnomalyScoreArr] = useState([])
  const [thresholdArr, setThresholdArr] = useState([])
  // const [isAnomalyArr, setIsAnomalyArr] = useState([])


  useEffect(() => {
    if (socketData.data) {
      setChartData(socketData.data)
      // console.log('data:', socketData.data[0][0])

      setDataArr((prev) => {
        return [...prev, socketData.data[0][0]]
      })

      // console.log('dataArr:', dataArr)
      setIndex((prev) => {
        return [...prev, socketData.index[0]]
      })
      setAnomalyScoreArr((prev) => {
        return [...prev, socketData.anomaly_pred[0]]
      })
      setThresholdArr((prev)=> {
        return [...prev, socketData.thr[0]]
      })

      const plotData = [
        {
          x: index,
          y: dataArr,
          type: 'line',
          mode: 'lines',
          name: 'data',
          line: {
            color: 'black',
            width: '2',
          },
        hovertemplate: '<b>Data</b><br>Index: %{x}<br>Data: %{y}',
        },
        {
          x: index,
          y: anomalyScoreArr,
          name: 'Anomaly Score',
          type: 'line',
          line: {
            color: 'red',
          },
          mode: 'lines',
          yaxis: 'y2',
          visible : isVisible,
          hovertemplate: '<b>Anomaly Score</b><br>Index: %{x}<br>Score: %{y}'
        },
        {
          x: index,
          y: thresholdArr,
          name: 'threshold',
          type: 'line',
          mode: 'lines',
          line: {
            color: 'green',
          },
          yaxis: 'y2',
          visible : yesVisible,
          hovertemplate: '<b>Threshold</b><br>Index: %{x}<br>Threshold: %{y}',
        },
      ]
      setTestData(plotData)
    }

    // else (socketData.data[0][0]//T가 매우 클 경우
    //  ){

    // }
}, [socketData])

// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const response = await fetch(load_shapURL);
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
//       const data = await response.json();
//       setShapData(data); // Assuming data is an array of image paths
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };
   
//   // Call the fetchData function when the component mounts
//   fetchData();
//   console.log("shapData:", shapData)
// }, []);




  /*add timestamp*/
  useEffect(() => {
    var timestamp = Date.now()
    var newURL = `${originURL}${timestamp}`
    const ws = new WebSocket(newURL)
    ws.onopen = () => {
      console.log(`WebSocket connection`)
    }

    /*parsing the incoming data*/
    ws.onmessage = (message) => {
      const dataString = message.data.trim()

      try {
        const dataObj = JSON.parse(dataString)
        setSocketData(dataObj)
      } catch (error) {
        console.error('JSON parsing error:', error)
      }
    }

    ws.onclose = (event) => {
      if (event.wasClean) {
        console.log(`WebSocket connection closed unexpectedly`)
      } else {
        console.log('WebSocket connection closed')
      }
    }
    return () => {
      ws.close()
    }
  }, [])

  //Toggle switch function
  const [isVisible, setIsVisible] = useState(true)
  const handleScoreToggle = () => {
    setIsVisible(!isVisible)
  }
  const [yesVisible, setYesVisible] = useState(true)
  const handleThreToggle = () => {
    setYesVisible(!yesVisible)
  }

  const layout = {
    title: 'Anomaly Detection Plot',
    titlefont: { size: 20 },
    xaxis: {
      title: 'Index',
      titlefont: { size: 20 },
    },
    yaxis: {
      title: 'Data',
      titlefont: { size: 20 },
      tickfont: { size: 15 },
    },
    yaxis2: {
      title: 'anomaly score',
      titlefont: { color: 'black', size: 20 },
      tickfont: { color: 'black', size: 15 },
      overlaying: 'y',
      side: 'right',
      zeroline: false,
    },
    // width: 1900,
    // height: 800,
    margin: {
      t: 50,
      b: 80,
      l: 100,
      r: 80,
    },
    responsive: true,
    useResizeHandler: true,
    autosize: true,
  }

  return (
    <Box
      pt={{ base: '130px', md: '80px', xl: '80px' }}
      style={{ position: 'relative', zIndex: 1000, width: '100%', height: '100%', useResizeHandler: 'true', responsive : 'true', autosize: 'true'}}
    >
      <div>
        {/* <h2>WebSocket Line Chart Example</h2>  */}
        <Plot 
          data={testData} 
          layout={layout} 
          useResizeHandler={true} 
          responsive ={true} 
          autosize={true}
          style={{width: '100%', height: '100%'}}   
          />
      </div>
      
      <div>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Shap result</div>
        <img src= {imgURL} alt="shap"/>
       
        <div id="shapPlotContainer">
        <button onClick={load_shap_plot}>Shap 플롯 로드</button>
      
        </div>

        
       
      </div>

      <Space direction="vertical">
        <Switch
          style={{ width: 150 }}
          onClick={handleThreToggle}
          checkedChildren="Show Threshold"
          unCheckedChildren="Hide Threshold"
          defaultChecked
        />
        <Switch
          style={{ width: 150 }}
          onClick={handleScoreToggle}
          checkedChildren="Show AnomalyScore"
          unCheckedChildren="Hide AnomalyScore"
          defaultChecked
        />
      </Space>
      <div>Control Panel</div>
    </Box>
  )
}

export default AdvancedChart
