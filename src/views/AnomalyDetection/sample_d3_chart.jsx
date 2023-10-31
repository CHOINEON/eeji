/* eslint-disable prettier/prettier */
import { Box} from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import Plot from 'react-plotly.js'
import { Space, Button, Card, Statistic, Col, Row, Select, Input } from 'antd'
import { QuestionCircleOutlined, } from '@ant-design/icons';
import { Checkbox } from 'antd'
import FeatureSlider from './components/Slider'
import CSS from './components/style.module.css'
import { useRecoilState } from 'recoil'
import { sliderValueState} from './atom'
import ThreSlider from './components/ThrSlider'

const AdvancedChart = () => {

  const originURL = 'ws://34.64.217.237:9001/ws/web'
  //'ws://222.121.66.49:8001/ws/web' 성엽ver
  const [socketData, setSocketData] = useState({})
  const [chartData, setChartData] = useState([])
  const [index, setIndex] = useState([])
  const [dataArr, setDataArr] = useState([])
  const [testData, setTestData] = useState([])
  const [subData, setSubData] = useState([])
  const [anomalyScoreArr, setAnomalyScoreArr] = useState([])
  const [thresholdArr, setThresholdArr] = useState([])

  // Control panel을 위한 useState
  const [indexSize, setIndexSize] = useState([])
  const [price, setPrice] = useState([])
  const [volume, setVolume] = useState([])
  const [clickedPoint, setClickedPoint] = useState({ x: null, y: null })
  const [isHovering, setIsHovering] = useState(0)
  const [dataHovering, setDataHovering] = useState(0)
  const [indexHovering, setIndexHovering] = useState(0)
  const [threHovering, setThreHovering] = useState(0)

  const { Search } = Input;
  const handleChartClick = (data) => {
    for (const point of data.points) 
        {
          const clickedXvalue = point.x
          const clickedYvalue = point.y
          console.log('클릭한 포인트 (내부):', clickedXvalue, clickedYvalue)
          setClickedPoint({ clickedXvalue, clickedYvalue })
        }
  }

  useEffect(() => {
    if (socketData.data) {
      setChartData(socketData.data)

      setDataArr((prev) => {
        return [...prev, socketData.data[0][0]]
      })
      setIndex((prev) => {
        return [...prev, socketData.index[0]]
      })
      setAnomalyScoreArr((prev) => {
        return [...prev, socketData.anomaly_pred[0]]
      })
      setThresholdArr((prev) => {
        return [...prev, socketData.thr[0]]
      })
      if (Array.isArray(socketData.feature_names) && socketData.feature_names.length > 0) {
        // 배열의 첫 번째 요소에 접근
        setPrice(socketData.feature_names[0])
        setVolume(socketData.feature_names[4])
      } else {
      }
      setIndexSize(socketData.index_size)

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
        }
      ]
      setTestData(plotData)
    }
  }, [socketData])

  useEffect(() => {
    if (socketData.data) {
      setChartData(socketData.data)

      setIndex((prev) => {
        return [...prev, socketData.index[0]]
      })
      setAnomalyScoreArr((prev) => {
        return [...prev, socketData.anomaly_pred[0]]
      })
      setThresholdArr((prev) => {
        return [...prev, socketData.thr[0]]
      })

      const subplotData = [
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
            dash : 'dash',
                },
          yaxis: 'y2',
          // visible: yesVisible,
          hovertemplate: '<b>Threshold</b><br>Index: %{x}<br>Threshold: %{y}',
        },
        {
          x : index,
          y : volume,
          name: 'volume',
          type : 'line',
          line : { color : 'blue',},
          mode : 'lines',
          hovertemplate: '<b>Data</b><br>Index: %{x}<br>Data: %{y}'
        }
      ]
      setSubData(subplotData)
    }
  }, [socketData])

const config = [{
    displayModeBar: false,
    responsive: true,
    useResizeHandler: true,
    autosize: true,
  }];  

const layout = {
    title: 'Anomaly Detection Plot',
    titlefont: { size: 20 },
    height : '30px',
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
    margin: {
        t: 80,
        b: 100,
        l: 110,
        r: 100,
        },
    // displayModeBar: false,
    responsive: true,
    useResizeHandler: true,
    autosize: true,
  }
  const subLayout = {
    title: 'Sub Plot',
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
    margin: {
        t: 80,
        b: 100,
        l: 110,
        r: 100,
        },
    
    // displayModeBar: false,
    responsive: true,
    useResizeHandler: true,
    autosize: true,
  }
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

  // const [isVisible, setIsVisible] = useState(true)
  // const handleScoreToggle = () => {
  //   setIsVisible(!isVisible)
  // }
  // const [yesVisible, setYesVisible] = useState(true)
  // const handleThreToggle = () => {
  //   setYesVisible(!yesVisible)
  // }

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

const editParam = () => {
  const secURL = 'http://34.64.217.237:9001/set_thr'
  
    fetch( secURL, {
            method: "PUT",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                  revised_values: [[sliderValue.price, sliderValue.volume]]
            })
          })
        .then((response)=>response.json())
      };
  
  const options = [
    { value: 'DBconeection1', label: 'DBconeection1' },
    { value: 'DBconnection2', label: 'DBconnection2' },
    { value: 'DBconnection2', label: 'DBconnection2' },
  ]
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
    console.log('search:', options);
  };

return (
  <Box
      pt={{ base: '130px', md: '80px', xl: '80px' }}
      style={{
              position: 'relative',
              zIndex: 1000,
              width: '100%',
              height: '100%',
              useResizeHandler: 'true',
              responsive: 'true',
              autosize: 'true',
              }}>
    <Space direction='horizontal'>
      <div style={{ width: '100%' }}>
        <Select
              style={{ 
                      width: '100%', 
                      backgroundColor: '#fff', 
                      border: '1px solid #A3AFCF', 
                      borderRadius: '10px' 
                    }}
              defaultValue={modelOptions[0]}
              options={modelOptions}
              onSelect={onSearch}
            />
      </div>
      <div style={{ width: '150px' }}>
        <Select
            style={{ 
                    width: 120, 
                    backgroundColor: '#fff', 
                    border: '1px solid #A3AFCF', 
                    borderRadius: '10px' 
                    }}
            defaultValue={datasetOptions[0]}
            options={datasetOptions}
            onSelect={onSearch}
        /> 
        </div> 
        <div style={{ width: '150px' }}>  
          <Select
            style={{ 
                    width: 120, 
                    backgroundColor: '#fff', 
                    border: '1px solid #A3AFCF', 
                    borderRadius: '10px' 
                    }}
            defaultValue={options[0]}
            options={options}
            onSelect={onSearch}
            />
        </div>  
        <div>
          <Button 
                type="primary"
                style={{marginBottom : '18px'}}> SUBMIT 
          </Button> 
        </div>  
    </Space>
  <div className = {CSS.Top}>
  <Plot
    data={testData}
    layout={layout}
    useResizeHandler={true}
    responsive={true}
    autosize={true}
    style={{ width: '100%' , height:'300px'}}
    config={config}
    onClick={handleChartClick}
  />
  </div>     
  <div className = {CSS.SecondChart}>
    <Plot
      data={subData}
      layout={subLayout}
      useResizeHandler={true}
      responsive={true}
      autosize={true}
      style={{ width: '100%', height:'300px' }}
      config={config}
      onClick={handleChartClick}
    />
  </div>
    
  <div className={CSS.Panel} 
        style = {{ 
                  responsive: true, 
                  useResizeHandler: true, 
                  autosize: true, 
                  width : '100%'}}>
    <Space direction="Horizontal">
      <Card style={{ 
                  width : '100%',
                  responsive: true, 
                  useResizeHandler: true, 
                  autosize: true, 
                  marginTop : 20,
                  marginBottom : 10,  
                  }}>
      <Col style ={{display : 'flex' }}>
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
        <span style={{display:'block',position:'absolute',top:'-60%','right':'10%', backgroundColor:'#4299e1',opacity:'0.7',zIndex:'1' ,color:'#fff'}}>자세히 알아보기</span>
          ) : (
            ""
          )}
      </Col> 
      <Row gutter={16}>
        <Col span={8}>
          <Statistic title="X Data" value={[clickedPoint.clickedXvalue]} />
        </Col>
        <Col span={8}>
          <Statistic title="Y Data" value={[clickedPoint.clickedYvalue]} />
        </Col> 
      </Row>
      
      <div className= {CSS.sendValueBox}>

</div>

        {/* <Statistic  
          value="IMPORT DATA" 
          valueStyle={{
                        fontWeight:500, 
                        fontSize : 20
                      }}/> 
        <Button onMouseOver={() => setDataHovering(1)} onMouseOut={() => setDataHovering(0)} 
                style={{
                        borderColor:'#fff',
                        justifyContent : 'center', 
                        marginLeft : '2px'}}>
        <QuestionCircleOutlined />
        </Button>
        {dataHovering ? (
        <span style={{display:'block',position:'absolute',top:'-60%','right':'10%', backgroundColor:'#4299e1',opacity:'0.7',zIndex:'1' ,color:'#fff'}}>자세히 알아보기</span>
          ) : (
            ""
          )} */}
      
      
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
      <Row gutter={16}>
        <Col span={12}>
          <Statistic title="DATA" value={indexSize} />
        </Col>
      </Row>     
      </Card>

<div className= {CSS.featureBox}>
  <Card style={{ 
              
              marginTop : 20,  
              responsive: true, 
              useResizeHandler: true, 
              autosize: true, 
             height : '290px'
}}>            
<Col span={12}>
              <Statistic title="DATA" value={thresholdArr[0]}
              valueStyle = {{fontWeight:500, 
                fontSize : 20,}} />
        </Col>
                   
  <Statistic  value="SEND TEST VALUE"  
              valueStyle={{
                    fontWeight:500, 
                    fontSize : 20,
                    marginBottom : 10,
                    responsive: true, 
                    useResizeHandler: true, 
                    autosize: true, 
                  }}
  />
  {/* <Checkbox style={{marginLeft : 140,}}onChange={onChange}>{price}</Checkbox> */} 
  <Search
      placeholder="Insert Value"
      allowClear
      enterButton="Submit"
      size="large"
      onSearch={onSearch}
    />       
  {/* <Statistic  value="FEATURES"  
              valueStyle={{
                    fontWeight:500, 
                    fontSize : 20,
                    marginBottom : 10,
                    responsive: true, 
                    useResizeHandler: true, 
                    autosize: true, 
                  }}
  /> */}
  {/* <Checkbox style={{marginLeft : 140,}}onChange={onChange}>{price}</Checkbox> */} 
  {/* <FeatureSlider clickedPoint={clickedPoint}/> 
  <Button 
        type="primary" 
        onClick={editParam} 
        style = {{
          justifyContent: 'center',
          alignItems : 'center',
          marginTop  : '10px',
  }}> SUBMIT 
  </Button>  */}
  </Card> 
</div>

{/* <div className= {CSS.sendValueBox}>
  <Card style={{ 
              height: '100%',
              marginTop : 20,  
              responsive: true, 
              useResizeHandler: true, 
              autosize: true, 
              }}>                   
  <Statistic  value="SEND TEST VALUE"  
              valueStyle={{
                    fontWeight:500, 
                    fontSize : 20,
                    marginBottom : 10,
                    responsive: true, 
                    useResizeHandler: true, 
                    autosize: true, 
                  }}
  /> */}
  {/* <Checkbox style={{marginLeft : 140,}}onChange={onChange}>{price}</Checkbox> */} 
  {/* <Search
      placeholder="Insert Value"
      allowClear
      enterButton="Submit"
      size="large"
      onSearch={onSearch}
    />
  </Card> 
</div> */}

<div className= {CSS.sendThr}>
  <Card style={{ 
              height: '100%',
              marginTop : 20,  
              responsive: true, 
              useResizeHandler: true, 
              autosize: true, 
              width : '60%'
}}> <Space direction="Horizontal">                    
  <Statistic  value="THRESHOLD"  
              valueStyle={{
                    fontWeight:500, 
                    fontSize : 20,
                    marginBottom : 10,
                    responsive: true, 
                    useResizeHandler: true, 
                    autosize: true, 
                  }}
  /><Button onMouseOver={() => setThreHovering(1)} onMouseOut={() => setThreHovering(0)}
  style={{
          borderColor: '#fff',
          justifyContent : 'center',
          marginLeft : '2px'
  }}>
<QuestionCircleOutlined />
</Button>
{threHovering ? (
<span style={{display:'block', position:'absolute',top : '5%', 'right':'85%', backgroundColor:'#4299e1', opacity:'0.7', zIndex:'1' , color:'#fff'}}>자세히 알아보기</span>
) : (
""
)}</Space>
  <Statistic  value={socketData.thr} />
  {/* <Checkbox style={{marginLeft : 140,}}onChange={onChange}>{price}</Checkbox> */} 
  <ThreSlider currentThr={socketData.thr}/> 
  </Card> 
</div>
{/* <div className= {CSS.ThreBox}>
  <Card style={{ 
              height: 370,
              marginTop : 20,  
              responsive: true, 
              useResizeHandler: true, 
              autosize: true, 
              width : '100%'
  }}>         
  <Space direction="Horizontal">         
    <Statistic  value="THRESHOLD "  
                valueStyle={{
                      fontWeight:500, 
                      fontSize : 20,}}/>
                      <Button onMouseOver={() => setThreHovering(1)} onMouseOut={() => setThreHovering(0)}
              style={{
                      borderColor: '#fff',
                      justifyContent : 'center',
                      marginLeft : '2px'
              }}>
      <QuestionCircleOutlined />
      </Button>
      {threHovering ? (
        <span style={{display:'block', position:'absolute',top : '5%', 'right':'10%', backgroundColor:'#4299e1', opacity:'0.7', zIndex:'1' , color:'#fff'}}>자세히 알아보기</span>
          ) : (
            ""
          )} </Space> 
      <Row gutter={16}>
      <Col span={10}>
      
        <Statistic  value={socketData.thr} />
      </Col>
      </Row>
        <ThreSlider currentThr={socketData.thr}/> 
        
  </Card> 
</div> */}
</Space>
</div>
{/* <Card style={{ 
            height:250,
            responsive: true, 
            useResizeHandler: true, 
            autosize: true, 
            width: '100%' 
            }}>
    <div style={{ 
                fontSize: '20px', 
                textAlign: 'center' 
            }}> 
        <Statistic  
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
      }}></div>
    </div>
</Card>  */}
</Box>
)
}

export default AdvancedChart
