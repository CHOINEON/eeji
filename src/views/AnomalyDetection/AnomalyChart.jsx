import { Box } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import Plot from 'react-plotly.js'
import { Space, Button, Card, Statistic, Col, Row, Select, Input, Slider } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
// import FeatureSlider from './components/Slider'
import CSS from './components/style.module.css'
import { useRecoilState } from 'recoil'
import { sliderValueState } from './atom'
import ThreSlider from './components/ThrSlider'

const AdvancedChart = () => {
  const originURL = 'ws://34.64.90.171:9001/ws/web'
  const [socketData, setSocketData] = useState({})
  const [chartData, setChartData] = useState([])
  const [index, setIndex] = useState([])
  const [dataArr, setDataArr] = useState([])
  const [subData, setSubData] = useState([])
  const [anomalyScoreArr, setAnomalyScoreArr] = useState([])
  const [thresholdArr, setThresholdArr] = useState([])
  //Object로 바꿀것
  const [anomalyPointsX, setAnomalyPointsX] = useState([])
  const [anomalyPointsY, setAnomalyPointsY] = useState([])
  //   const [resetChart, setResetChart] = useState(false)

  const [selectedModel, setSelectedModel] = useState('PCA')
  const [selectedTable, setSelectedTable] = useState('EODHD_DAILY')
  const [selectedSymbol, setSelectedSymbol] = useState('DJI.INDX')

  // Control panel을 위한 useState
  const [indexSize, setIndexSize] = useState([])
  const [price, setPrice] = useState([])
  const [volume, setVolume] = useState([])
  const [clickedPoint, setClickedPoint] = useState({ x: null, y: null })
  const [threHovering, setThreHovering] = useState(0)

  const handleChartClick = (data) => {
    for (const point of data.points) {
      const clickedXvalue = point.x
      const clickedYvalue = point.y
      console.log('클릭한 포인트 (내부):', clickedXvalue, clickedYvalue)
      setClickedPoint({ clickedXvalue, clickedYvalue })
    }
  }

  useEffect(() => {
    if (socketData.data) {
      setChartData(socketData.data)
      console.log('socektData:', socketData)

      let initial_DataArr = []
      for (let i = 0; i < socketData.data.length; i++) {
        initial_DataArr.push(socketData.data[i][0])
      }
      setDataArr((prev) => {
        return [...prev, ...initial_DataArr]
      })

      setIndex((prev) => {
        return [...prev, ...socketData.index]
      })

      let initial_AnomalyScoreArr = []
      for (let j = 0; j < socketData.anomaly_pred.length; j++) {
        initial_AnomalyScoreArr.push(socketData.anomaly_pred[0])
      }
      setAnomalyScoreArr((prev) => {
        return [...prev, ...initial_AnomalyScoreArr]
      })
      console.log('anomalyscore:', initial_AnomalyScoreArr)

      let initial_Threshold = []
      for (let k = 0; k < socketData.thr.length; k++) {
        initial_Threshold.push(socketData.thr[k][0])
      }
      console.log('initial_Thre:', initial_Threshold)

      setThresholdArr((prev) => {
        return [...prev, socketData.thr[0]]
      })

      if (Array.isArray(socketData.feature_names) && socketData.feature_names.length > 0) {
        setPrice(socketData.feature_names[0])
        setVolume(socketData.feature_names[4])
      } else {
      }
      setIndexSize(socketData.index_size)

      if (socketData.is_anormaly[0]) {
        setAnomalyPointsX(index)
        setAnomalyPointsY(dataArr)
      }
    }
  }, [socketData])

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
      x: anomalyPointsX,
      y: anomalyPointsY,
      mode: 'markers',
      name: 'Price Anomalies',
      marker: { color: 'red' },
      hovertemplate: '<b>anomalyPoints</b><br>Index: %{x}<br>anomalyPoints: %{y}',
    },
  ]
  const subPlotData = [
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
      // visible: isVisible,
      hovertemplate: '<b>Anomaly Score</b><br>Index: %{x}<br>Score: %{y}',
    },
    {
      x: index,
      y: thresholdArr,
      name: 'threshold',

      mode: 'lines',
      marker: {
        color: 'green',
        size: 3,
        symbol: 'square',
      },
      line: {
        color: 'green',
        dash: 'dash',
      },
      yaxis: 'y2',
      // visible: yesVisible,
      hovertemplate: '<b>Threshold</b><br>Index: %{x}<br>Threshold: %{y}',
    },
    {
      x: index,
      y: volume,
      name: 'volume',
      type: 'line',
      line: { color: 'blue' },
      mode: 'lines',
      hovertemplate: '<b>Data</b><br>Index: %{x}<br>Data: %{y}',
    },
  ]

  const config = [
    {
      displayModeBar: false,
      responsive: true,
      useResizeHandler: true,
      autosize: true,
    },
  ]

  const layout = {
    title: 'Anomaly Detection Plot',
    titlefont: { size: 20 },
    height: '100%',
    xaxis: {
      title: 'Index',
      titlefont: { size: 20 },
    },
    yaxis: {
      title: 'Price',
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
    margin: {
      t: 80,
      b: 100,
      l: 110,
      r: 100,
    },
    responsive: true,
    useResizeHandler: true,
    autosize: true,
  }
  const subLayout = {
    height: '100%',
    xaxis: {
      title: 'Index',
      titlefont: { size: 20 },
    },
    yaxis: {
      title: 'Volume',
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
    margin: {
      t: 40,
      b: 100,
      l: 110,
      r: 30,
    },
    responsive: true,
    useResizeHandler: true,
    autosize: true,
  }

  useEffect(() => {
    var timestamp = Date.now()
    var newURL = `${originURL}${timestamp}`
    const ws = new WebSocket(newURL)
    ws.onopen = () => {
      console.log(`WebSocket connection`)
    }

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

  // async function load_shap_plot(event) {
  //   event.preventDefault()

  //   try {
  //     const response = await fetch('http://222.121.66.49:8001/load_shap_plot', {
  //       method: 'GET',
  //     })
  //     // console.log('test:', response)
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`)
  //     }

  //     const result = await response.text()

  //     const shapPlotContainer = document.getElementById('shapPlotContainer')
  //     shapPlotContainer.innerHTML = getHtmlElement(result) //html 요소만 잘라옴

  //     addScriptToDom(result)
  //   } catch (error) {
  //     console.error('Error fetching data:', error)
  //   }
  // }

  // function getHtmlElement(text) {
  //   // var scripts = ''
  //   // var cleaned = text.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, function () {
  //   //   scripts += arguments[1] + '\n'
  //   //   return ''
  //   // })
  //   // return cleaned

  //   return text.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
  // }

  // function addScriptToDom(text) {
  //   let scripts = ''
  //   text.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, function () {
  //     scripts += arguments[1] + '\n'
  //   })

  //   // console.log('window.execScript:', window.execScript)
  //   // if (window.execScript) {
  //   //   window.execScript(scripts)
  //   //   console.log('hi')
  //   // } else {

  //   var head = document.getElementsByTagName('head')[0]
  //   var scriptElement = document.createElement('script') //public/index

  //   scriptElement.setAttribute('type', 'text/javascript')
  //   scriptElement.innerText = scripts

  //   head.appendChild(scriptElement)
  //   head.removeChild(scriptElement)
  // }

  const [sliderValue, setSliderValue] = useRecoilState(sliderValueState)
  //             body: JSON.stringify({
  //                   revised_values: [[sliderValue.price, sliderValue.volume]]

  const symbolOptions = {
    EODHD_DAILY: [
      { value: 'DJI.INDX', label: 'DJI.INDX' },
      { value: 'DXY.InDX', label: 'DXY.InDX' },
      { value: 'EURUSD>FOREX', label: 'EURUSD>FOREX' },
      { value: 'GSPC.INDX', label: 'GSPC.INDX' },
      { value: 'IXIC.INDX', label: 'IXIC>INDX' },
      { value: 'NYA.INDX', label: 'NYA>INDX' },
      { value: 'BCOMCL.INDX', label: 'BCOMCL.INDX' },
      { value: 'BCOMCO.INDX', label: 'BCOMCO.INDX' },
      { value: 'BCOMGC.INDX', label: 'BCOMGC.INDX' },
      { value: 'BCOMNG.INDX', label: 'BCOMNG.INDX' },
      { value: 'XAX.INDX', label: 'XAX.INDX' },
      { value: 'BCOMHG.INDX', label: 'BCOMHG.IHDX' },
    ],
    EODHD_REALTIME: [
      { value: 'BTC-USD', label: 'BTC-USD' },
      { value: 'ETH-USD', label: 'ETH-USD' },
    ],
  }
  const datasetOptions = [
    { value: 'EODHD_DAILY', label: 'EODHD_DAILY' },
    { value: 'EODHD_REALTIME', label: 'EODHD_REALTIME' },
  ]
  const modelOptions = [
    { value: 'PCA', label: 'PCA' },
    { value: 'IFOREST', label: 'IFOREST' },
    { value: 'USAD', label: 'USAD' },
    { value: 'ANOMALY TRANSFORMER', label: 'ANOMALY TRANSFORMER' },
  ]

  const onSearch = (value) => {
    console.log('search:', options)
  }
  const onModelChange = (value) => {
    setSelectedModel(value)
  }
  const onTableChange = (value) => {
    setSelectedTable(value)
  }
  const onSymbolChange = (value) => {
    setSelectedSymbol(value)
  }

  const model_DBconfig = () => {
    const URL = 'http://34.64.90.177:9001/set_db_config'
    fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ MODEL_NAME: selectedModel, TABLE_NAME: selectedTable, SYMBOL: selectedSymbol }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the server
        console.log('Response from the server:', data)
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }

  const getSymbolOptions = () => {
    // return selectedTable === 'EODHD_DAILY' ? symbolOptions_Daily : symbolOptions_Realtime;
    console.log(symbolOptions[selectedTable] || [])
    return symbolOptions[selectedTable] || []
  }

  return (
    <Box
      pt={{ base: '130px', md: '80px', xl: '80px' }}
      style={{
        position: 'flex',
        zIndex: 1000,
        width: '100%',
        height: '100%',
        useResizeHandler: 'true',
        responsive: 'true',
        autosize: 'true',
      }}
    >
      <Space direction="horizontal">
        {/*Model Selection*/}
        <div style={{ width: '100%' }}>
          <Select
            style={{
              width: '100%',
              backgroundColor: '#fff',
              border: '1px solid #A3AFCF',
              borderRadius: '10px',
            }}
            defaultValue={selectedModel}
            options={modelOptions}
            onSelect={onModelChange}
          />
        </div>

        {/*DB TABLE Selection*/}
        <div style={{ width: '150px' }}>
          <Select
            style={{
              width: 120,
              backgroundColor: '#fff',
              border: '1px solid #A3AFCF',
              borderRadius: '10px',
            }}
            defaultValue={datasetOptions[0]}
            options={datasetOptions}
            onSelect={onTableChange}
          />
        </div>

        {/*Symbol Selection*/}
        <div style={{ width: '150px' }}>
          <Select
            style={{
              width: 120,
              backgroundColor: '#fff',
              border: '1px solid #A3AFCF',
              borderRadius: '10px',
            }}
            defaultValue={getSymbolOptions()[0].value}
            options={getSymbolOptions()}
            onSelect={onSymbolChange}
          />
        </div>

        <div>
          <Button onClick={model_DBconfig} type="primary">
            {' '}
            SUBMIT
          </Button>
        </div>
      </Space>

      <div className={CSS.Top}>
        <Plot
          data={plotData}
          layout={layout}
          style={{ width: '100%', height: '80%', marginTop: 5 }}
          config={config}
          onClick={handleChartClick}
        />
      </div>
      <div style={{ display: 'flex', marginTop: '10px' }}>
        <Plot
          data={subPlotData}
          layout={subLayout}
          style={{ width: '100%', height: '80%' }}
          config={config}
          onClick={handleChartClick}
        />
        <div className={CSS.sendThr}>
          <Card
            style={{
              width: '90%',
              height: '100%',
              marginBottom: 20,
              marginLeft: 5,
              responsive: true,
              useResizeHandler: true,
              autosize: true,
            }}
          >
            <Space direction="Horizontal">
              <Statistic
                value="THRESHOLD"
                valueStyle={{
                  fontWeight: 500,
                  fontSize: 20,
                  marginBottom: 10,
                  responsive: true,
                  useResizeHandler: true,
                  autosize: true,
                }}
              />
              <Button
                onMouseOver={() => setThreHovering(1)}
                onMouseOut={() => setThreHovering(0)}
                style={{
                  borderColor: '#fff',
                  justifyContent: 'center',
                  marginLeft: '2px',
                }}
              >
                <QuestionCircleOutlined />
              </Button>
              {threHovering ? (
                <span
                  style={{
                    display: 'block',
                    position: 'absolute',
                    top: '5%',
                    right: '55%',
                    backgroundColor: '#4299e1',
                    opacity: '0.7',
                    zIndex: '1',
                    color: '#fff',
                  }}
                >
                  자세히 알아보기
                </span>
              ) : (
                ''
              )}
            </Space>
            <Statistic value={socketData.thr} />
            <ThreSlider currentThr={socketData.thr} stlye={{ marginLeft: '20px' }} />
          </Card>
        </div>
      </div>

      {/* <Card style={{ 
                    width : '100%',
                    height : '90%',
                    responsive: true, 
                    useResizeHandler: true, 
                    autosize: true, 
                    marginTop : 10,
                    marginBottom : 10,  
                  }}>
        <Col style ={{ display : 'flex' }}>
          <Statistic  
                  value='SELECTED DATA' 
                  valueStyle={{
                              fontWeight:500, 
                              fontSize : 20
                              }}/>
          <Button onMouseOver={() => setIsHovering(1)} 
                  onMouseOut={() => setIsHovering(0)} 
                  style={{
                          position:'relative',
                          borderColor:'#fff', 
                          marginLeft : '2px', 
                          justifyContent : 'center', }}>
          <QuestionCircleOutlined  />
          </Button>
          {isHovering ? (
          <span style={{display:'block',position:'absolute',top:'-60%','right':'-15%', backgroundColor:'#4299e1',opacity:'0.7',zIndex:'1' ,color:'#fff'}}>자세히 알아보기</span>
            ) : (
              ""
            )}
        </Col> 
        <Row gutter={16}>
          <Col span={8}><Statistic title="X Data" value={[clickedPoint.clickedXvalue]} />
          </Col>
          <Col span={8}><Statistic title="Y Data" value={[clickedPoint.clickedYvalue]} />
          </Col> 
        </Row>
        <Col style = {{display : 'flex'}}>
            <Statistic  
              value="INDEX SIZE" 
              valueStyle={{
                          fontWeight:500, 
                          fontSize : 20,
                          }}/> 
            <Button onMouseOver={() => setIndexHovering(1)} onMouseOut={() => setIndexHovering(0)}
                    style={{
                            borderColor: '#fff',
                            justifyContent : 'center',
                            marginLeft : '2px'
                          }}>
            <QuestionCircleOutlined />
            </Button>
            {indexHovering ? (
              <span style={{display:'block', position:'absolute', top:'-60%', 'right':'10%', backgroundColor:'#4299e1', opacity:'0.7', zIndex:'1' , color:'#fff'}}>자세히 알아보기</span>
                ) : (
                  ""
                )}
        </Col>
          <Col span={2}><Statistic  value={indexSize} /></Col>
      </Card> */}

      {/* <div className= {CSS.featureBox}>          
    <Col span={12}>
              <Statistic title="DATA" value={thresholdArr[0]}
              valueStyle = {{fontWeight:500, 
                fontSize : 20,}} />
    </Col>
    <Search
        placeholder="Insert Value"
        allowClear
        enterButton="Submit"
        size="large"
        onSearch={onSearch}
      /> */}
      {/* <Checkbox style={{marginLeft : 140,}}onChange={onChange}>{price}</Checkbox> */}
      {/* <FeatureSlider clickedPoint={clickedPoint}/> */}
      {/* <Statistic  
              value='SHAP RESULT' 
              valueStyle={{
                      fontWeight:600
                      }}/>
              <Button onClick={load_shap_plot}>Shap 플롯 로드</Button> 
                      <div
              id="shapPlotContainer"
              style={{ 
                    width: '100%', 
                    height: '150px', 
                    backgroundColor: 'white', 
                    paddingTop: '20px' 
              }}></div>*/}
    </Box>
  )
}

export default AdvancedChart
