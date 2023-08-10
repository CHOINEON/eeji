import styled from '@emotion/styled'
import React, { useState, useEffect, useRef } from 'react'
import { DatePicker, Space, Select, Button, Empty, Skeleton, Switch } from 'antd'
import ItemBox from './components/DataEntry/ItemBox'
import axios from 'axios'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { dataFileStore, dataSetStore, stepCountStore } from './store/atom'
import { selectedVarStoreX, selectedVarStoreY, usedVariableStore, variableStore } from './store/variable/atom'
import NewTagSelect from './components/TagTree/NewTagSelect'
import SliderWithNumber from './components/DataEntry/SliderWithNumber'
import Plot from 'react-plotly.js'
import createPlotlyComponent from 'react-plotly.js/factory'
import RadioButtonGroup from './components/DataEntry/RadioButtonGroup'
import { ArrowRightOutlined, DotChartOutlined } from '@ant-design/icons'
import { startEndDateAtom } from './store/base/atom'
import dayjs from 'dayjs'
import ReactDOM from 'react-dom'

const CorrelationViewContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  height: 37vw;
  // border: 1px solid red;
`
const HyperpararmeterWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 4vw 2vw;
  float: left;
  width: 30%;
  height: 100%;
`
const PlotWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 3vw 1vw;
  float: left;
  width: 62%;
`

const defaultLayout: any = {
  automargin: true,
  autoresize: true,
  hovermode: 'closest',
  title: 'CorrPlot',
  plot_bgcolor: 'rgba(255,255,255,0)',
}
const DATE_FORMAT = 'YYYY-MM-DD'

const CorrelationView = () => {
  const { RangePicker } = DatePicker

  const setActiveStep = useSetRecoilState(stepCountStore)
  const selectedDataset = useRecoilState(dataSetStore)
  const selectedFile = useRecoilState(dataFileStore)
  const defaultValue = useRecoilValue(startEndDateAtom)

  const [selectedDates, setSelectedDates] = useState()

  const [plotData, setPlotData] = useState([])
  const [plotImg, setPlotImg] = useState()

  const [scalingOption, setScalingOption] = useState('iqr')
  const [layoutOption, setLayoutOption] = useState(defaultLayout)
  const [featureX, setFeatureX] = useState([])
  const [featureY, setFeatureY] = useState([])

  const [loading, setLoading] = useState<boolean>(false)

  const [optionsX, setOptionsX] = useState([])
  const [optionsY, setOptionsY] = useState([])
  const [defaultOption, setDefaultOption] = useState([])

  const [variableList, setVariableList] = useRecoilState(variableStore)
  const [usedVariable, setUsedVariable] = useRecoilState(usedVariableStore)

  const [checked, setChecked] = useState(false)
  const plotRef = useRef(null)
  const [respData, setRespData] = useState({ plotdata: [], layout: {} })

  const config = {
    displaylogo: false,
    responsive: true,
  }

  useEffect(() => {
    setLoading(false)
  }, [])

  function handleRedrawPlot() {
    console.log('handleRedrawPlot: ')
  }

  useEffect(() => {
    // setOptionsX(variableList)
    // setOptionsY(variableList)
    setDefaultOption(variableList)
  }, [variableList])

  const fetchCorrelationPlot = async () => {
    setLoading(true)

    const param = {
      response_type: 'json', //DB에서 encoded image or json 중 알아서 보내주기로
      dataset_id: selectedDataset[0],
      file_nm: selectedFile[0],
      scaling_method: scalingOption,
      x_value: featureX,
      y_value: featureY,
    }

    // console.log('param:', param)

    await axios
      .post(process.env.REACT_APP_API_SERVER_URL + '/api/corrplot/cplot', param)
      .then((response: any) => {
        setLoading(false)

        setPlotImg(undefined)
        setPlotData(undefined)

        console.log('/api/corrplot/cplot response ::', response)
        // console.log('layout::', response.data.layout)

        if (response.data.image) {
          setPlotImg(response.data.image)
        } else {
          setPlotData(response.data.data)

          //layout 수정
          const layout = response.data.layout
          layout['margin'] = { r: 10, b: 10 }
          setLayoutOption(layout)

          //테스트용...
          setRespData({ plotdata: response.data.data, layout: response.data.layout })
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })

    // image를 그대로 받아오는 경우 ( response_type : 'blob'  인 경우 )
    // await axios
    //   .post<Blob>('http://101.101.209.181:8080' + '/api/corrplot/cplot', param, {
    //     responseType: 'blob',
    //   })
    //   .then((res) => {
    //     const myFile = new File([res.data], 'imageName')
    //     const reader = new FileReader()
    //     reader.onload = (ev) => {
    //       const previewImage = String(ev.target?.result)
    //       console.log('111::', previewImage)
    //       setPlotImg(previewImage) // myImage라는 state에 저장했음
    //     }
    //     reader.readAsDataURL(myFile)
    //   })
  }

  const handleSearchClick = () => {
    fetchCorrelationPlot()
  }

  const handleRadioButtonChange = (value: any) => {
    setScalingOption(value)
  }

  const handleSelect = (param: any) => {
    // console.log('selected:', param)
    if (param.type === 'x') setFeatureX(param.value)
    if (param.type === 'y') setFeatureY(param.value)

    const result = []
    for (let i = 0; i < usedVariable.length; i++) {
      //같은 카테고리에 선택된거 있으면 해제
      if (usedVariable[i].category === param.type) {
        result.push({ value: usedVariable[i].value, used: false })
      }
      //선택된 값은 true처리
      else if (usedVariable[i].value === param.value) {
        result.push({ value: usedVariable[i].value, used: true, category: param.type })
      } else {
        //그 외는 그대로 렌더링
        result.push(usedVariable[i])
      }
    }

    setUsedVariable(result)
  }

  const handleNext = () => {
    setActiveStep(2)
  }

  const onChangeSwitch = (param: any) => {
    // console.log('swithc:', param)
    setChecked(param)
  }

  const handleChange = (dateArray: any) => {
    console.log('datearr[0]:', dateArray[0].format('YYYY-MM-DD'))

    setSelectedDates(dateArray)
  }

  const handleResetButton = (event: any) => {
    // fetchCorrelationPlot()
    const update = {
      title: 'some new title', // updates the title
      'xaxis.range': [-0.8237524999999999, -0.05399250000000011],
      'xaxis.range[0]': -0.8237524999999999,
      'xaxis.range[1]': -0.05399250000000011,
      'yaxis.range': [-0.75151875, 0.12421125000000002],
      'yaxis.range[0]': -0.75151875,
      'yaxis.range[1]': 0.12421125000000002,
      'xaxis.autorange': false,
      'yaxis.autorange': false,
    }

    const updateTest = {
      title: {
        text: '2D scatter plot colored by density',
      },
      xaxis: {
        title: {
          text: 'x3',
        },
        range: [1.4299895079509772, 1.688060492049022],
        type: 'linear',
        // fixedrange: false,
      },
      yaxis: {
        title: {
          text: 'x6',
        },
        range: [1.3455490515780735, 1.604980948421927],
        type: 'linear',
        // fixedrange: false,
      },
      template: {
        data: {
          histogram2dcontour: [
            {
              type: 'histogram2dcontour',
              colorbar: {
                outlinewidth: 0,
                ticks: '',
              },
              colorscale: [
                [0, '#0d0887'],
                [0.1111111111111111, '#46039f'],
                [0.2222222222222222, '#7201a8'],
                [0.3333333333333333, '#9c179e'],
                [0.4444444444444444, '#bd3786'],
                [0.5555555555555556, '#d8576b'],
                [0.6666666666666666, '#ed7953'],
                [0.7777777777777778, '#fb9f3a'],
                [0.8888888888888888, '#fdca26'],
                [1, '#f0f921'],
              ],
            },
          ],
          choropleth: [
            {
              type: 'choropleth',
              colorbar: {
                outlinewidth: 0,
                ticks: '',
              },
            },
          ],
          histogram2d: [
            {
              type: 'histogram2d',
              colorbar: {
                outlinewidth: 0,
                ticks: '',
              },
              colorscale: [
                [0, '#0d0887'],
                [0.1111111111111111, '#46039f'],
                [0.2222222222222222, '#7201a8'],
                [0.3333333333333333, '#9c179e'],
                [0.4444444444444444, '#bd3786'],
                [0.5555555555555556, '#d8576b'],
                [0.6666666666666666, '#ed7953'],
                [0.7777777777777778, '#fb9f3a'],
                [0.8888888888888888, '#fdca26'],
                [1, '#f0f921'],
              ],
            },
          ],
          heatmap: [
            {
              type: 'heatmap',
              colorbar: {
                outlinewidth: 0,
                ticks: '',
              },
              colorscale: [
                [0, '#0d0887'],
                [0.1111111111111111, '#46039f'],
                [0.2222222222222222, '#7201a8'],
                [0.3333333333333333, '#9c179e'],
                [0.4444444444444444, '#bd3786'],
                [0.5555555555555556, '#d8576b'],
                [0.6666666666666666, '#ed7953'],
                [0.7777777777777778, '#fb9f3a'],
                [0.8888888888888888, '#fdca26'],
                [1, '#f0f921'],
              ],
            },
          ],
          heatmapgl: [
            {
              type: 'heatmapgl',
              colorbar: {
                outlinewidth: 0,
                ticks: '',
              },
              colorscale: [
                [0, '#0d0887'],
                [0.1111111111111111, '#46039f'],
                [0.2222222222222222, '#7201a8'],
                [0.3333333333333333, '#9c179e'],
                [0.4444444444444444, '#bd3786'],
                [0.5555555555555556, '#d8576b'],
                [0.6666666666666666, '#ed7953'],
                [0.7777777777777778, '#fb9f3a'],
                [0.8888888888888888, '#fdca26'],
                [1, '#f0f921'],
              ],
            },
          ],
          contourcarpet: [
            {
              type: 'contourcarpet',
              colorbar: {
                outlinewidth: 0,
                ticks: '',
              },
            },
          ],
          contour: [
            {
              type: 'contour',
              colorbar: {
                outlinewidth: 0,
                ticks: '',
              },
              colorscale: [
                [0, '#0d0887'],
                [0.1111111111111111, '#46039f'],
                [0.2222222222222222, '#7201a8'],
                [0.3333333333333333, '#9c179e'],
                [0.4444444444444444, '#bd3786'],
                [0.5555555555555556, '#d8576b'],
                [0.6666666666666666, '#ed7953'],
                [0.7777777777777778, '#fb9f3a'],
                [0.8888888888888888, '#fdca26'],
                [1, '#f0f921'],
              ],
            },
          ],
          surface: [
            {
              type: 'surface',
              colorbar: {
                outlinewidth: 0,
                ticks: '',
              },
              colorscale: [
                [0, '#0d0887'],
                [0.1111111111111111, '#46039f'],
                [0.2222222222222222, '#7201a8'],
                [0.3333333333333333, '#9c179e'],
                [0.4444444444444444, '#bd3786'],
                [0.5555555555555556, '#d8576b'],
                [0.6666666666666666, '#ed7953'],
                [0.7777777777777778, '#fb9f3a'],
                [0.8888888888888888, '#fdca26'],
                [1, '#f0f921'],
              ],
            },
          ],
          mesh3d: [
            {
              type: 'mesh3d',
              colorbar: {
                outlinewidth: 0,
                ticks: '',
              },
            },
          ],
          scatter: [
            {
              fillpattern: {
                fillmode: 'overlay',
                size: 10,
                solidity: 0.2,
              },
              type: 'scatter',
            },
          ],
          parcoords: [
            {
              type: 'parcoords',
              line: {
                colorbar: {
                  outlinewidth: 0,
                  ticks: '',
                },
              },
            },
          ],
          scatterpolargl: [
            {
              type: 'scatterpolargl',
              marker: {
                colorbar: {
                  outlinewidth: 0,
                  ticks: '',
                },
              },
            },
          ],
          bar: [
            {
              error_x: {
                color: '#2a3f5f',
              },
              error_y: {
                color: '#2a3f5f',
              },
              marker: {
                line: {
                  color: '#E5ECF6',
                  width: 0.5,
                },
                pattern: {
                  fillmode: 'overlay',
                  size: 10,
                  solidity: 0.2,
                },
              },
              type: 'bar',
            },
          ],
          scattergeo: [
            {
              type: 'scattergeo',
              marker: {
                colorbar: {
                  outlinewidth: 0,
                  ticks: '',
                },
              },
            },
          ],
          scatterpolar: [
            {
              type: 'scatterpolar',
              marker: {
                colorbar: {
                  outlinewidth: 0,
                  ticks: '',
                },
              },
            },
          ],
          histogram: [
            {
              marker: {
                pattern: {
                  fillmode: 'overlay',
                  size: 10,
                  solidity: 0.2,
                },
              },
              type: 'histogram',
            },
          ],
          scattergl: [
            {
              type: 'scattergl',
              marker: {
                colorbar: {
                  outlinewidth: 0,
                  ticks: '',
                },
              },
            },
          ],
          scatter3d: [
            {
              type: 'scatter3d',
              line: {
                colorbar: {
                  outlinewidth: 0,
                  ticks: '',
                },
              },
              marker: {
                colorbar: {
                  outlinewidth: 0,
                  ticks: '',
                },
              },
            },
          ],
          scattermapbox: [
            {
              type: 'scattermapbox',
              marker: {
                colorbar: {
                  outlinewidth: 0,
                  ticks: '',
                },
              },
            },
          ],
          scatterternary: [
            {
              type: 'scatterternary',
              marker: {
                colorbar: {
                  outlinewidth: 0,
                  ticks: '',
                },
              },
            },
          ],
          scattercarpet: [
            {
              type: 'scattercarpet',
              marker: {
                colorbar: {
                  outlinewidth: 0,
                  ticks: '',
                },
              },
            },
          ],
          carpet: [
            {
              aaxis: {
                endlinecolor: '#2a3f5f',
                gridcolor: 'white',
                linecolor: 'white',
                minorgridcolor: 'white',
                startlinecolor: '#2a3f5f',
              },
              baxis: {
                endlinecolor: '#2a3f5f',
                gridcolor: 'white',
                linecolor: 'white',
                minorgridcolor: 'white',
                startlinecolor: '#2a3f5f',
              },
              type: 'carpet',
            },
          ],
          table: [
            {
              cells: {
                fill: {
                  color: '#EBF0F8',
                },
                line: {
                  color: 'white',
                },
              },
              header: {
                fill: {
                  color: '#C8D4E3',
                },
                line: {
                  color: 'white',
                },
              },
              type: 'table',
            },
          ],
          barpolar: [
            {
              marker: {
                line: {
                  color: '#E5ECF6',
                  width: 0.5,
                },
                pattern: {
                  fillmode: 'overlay',
                  size: 10,
                  solidity: 0.2,
                },
              },
              type: 'barpolar',
            },
          ],
          pie: [
            {
              automargin: true,
              type: 'pie',
            },
          ],
        },
        layout: {
          autotypenumbers: 'strict',
          colorway: [
            '#636efa',
            '#EF553B',
            '#00cc96',
            '#ab63fa',
            '#FFA15A',
            '#19d3f3',
            '#FF6692',
            '#B6E880',
            '#FF97FF',
            '#FECB52',
          ],
          font: {
            color: '#2a3f5f',
          },
          hovermode: 'closest',
          hoverlabel: {
            align: 'left',
          },
          paper_bgcolor: 'white',
          plot_bgcolor: '#E5ECF6',
          polar: {
            bgcolor: '#E5ECF6',
            angularaxis: {
              gridcolor: 'white',
              linecolor: 'white',
              ticks: '',
            },
            radialaxis: {
              gridcolor: 'white',
              linecolor: 'white',
              ticks: '',
            },
          },
          ternary: {
            bgcolor: '#E5ECF6',
            aaxis: {
              gridcolor: 'white',
              linecolor: 'white',
              ticks: '',
            },
            baxis: {
              gridcolor: 'white',
              linecolor: 'white',
              ticks: '',
            },
            caxis: {
              gridcolor: 'white',
              linecolor: 'white',
              ticks: '',
            },
          },
          coloraxis: {
            colorbar: {
              outlinewidth: 0,
              ticks: '',
            },
          },
          colorscale: {
            sequential: [
              [0, '#0d0887'],
              [0.1111111111111111, '#46039f'],
              [0.2222222222222222, '#7201a8'],
              [0.3333333333333333, '#9c179e'],
              [0.4444444444444444, '#bd3786'],
              [0.5555555555555556, '#d8576b'],
              [0.6666666666666666, '#ed7953'],
              [0.7777777777777778, '#fb9f3a'],
              [0.8888888888888888, '#fdca26'],
              [1, '#f0f921'],
            ],
            sequentialminus: [
              [0, '#0d0887'],
              [0.1111111111111111, '#46039f'],
              [0.2222222222222222, '#7201a8'],
              [0.3333333333333333, '#9c179e'],
              [0.4444444444444444, '#bd3786'],
              [0.5555555555555556, '#d8576b'],
              [0.6666666666666666, '#ed7953'],
              [0.7777777777777778, '#fb9f3a'],
              [0.8888888888888888, '#fdca26'],
              [1, '#f0f921'],
            ],
            diverging: [
              [0, '#8e0152'],
              [0.1, '#c51b7d'],
              [0.2, '#de77ae'],
              [0.3, '#f1b6da'],
              [0.4, '#fde0ef'],
              [0.5, '#f7f7f7'],
              [0.6, '#e6f5d0'],
              [0.7, '#b8e186'],
              [0.8, '#7fbc41'],
              [0.9, '#4d9221'],
              [1, '#276419'],
            ],
          },
          xaxis: {
            gridcolor: 'white',
            linecolor: 'white',
            ticks: '',
            title: {
              standoff: 15,
            },
            zerolinecolor: 'white',
            automargin: true,
            zerolinewidth: 2,
          },
          yaxis: {
            gridcolor: 'white',
            linecolor: 'white',
            ticks: '',
            title: {
              standoff: 15,
            },
            zerolinecolor: 'white',
            automargin: true,
            zerolinewidth: 2,
          },
          scene: {
            xaxis: {
              backgroundcolor: '#E5ECF6',
              gridcolor: 'white',
              linecolor: 'white',
              showbackground: true,
              ticks: '',
              zerolinecolor: 'white',
              gridwidth: 2,
            },
            yaxis: {
              backgroundcolor: '#E5ECF6',
              gridcolor: 'white',
              linecolor: 'white',
              showbackground: true,
              ticks: '',
              zerolinecolor: 'white',
              gridwidth: 2,
            },
            zaxis: {
              backgroundcolor: '#E5ECF6',
              gridcolor: 'white',
              linecolor: 'white',
              showbackground: true,
              ticks: '',
              zerolinecolor: 'white',
              gridwidth: 2,
            },
          },
          shapedefaults: {
            line: {
              color: '#2a3f5f',
            },
          },
          annotationdefaults: {
            arrowcolor: '#2a3f5f',
            arrowhead: 0,
            arrowwidth: 1,
          },
          geo: {
            bgcolor: 'white',
            landcolor: '#E5ECF6',
            subunitcolor: 'white',
            showland: true,
            showlakes: true,
            lakecolor: 'white',
          },
          title: {
            x: 0.05,
          },
          mapbox: {
            style: 'light',
          },
        },
      },
      autosize: true,
      font: {
        family: 'NanumGothic',
      },
      margin: {
        r: 10,
        b: 10,
      },
    }

    console.log('handleResetButton', handleResetButton)
    // setLayoutOption(updateTest)

    //console.log('respData:', respData)

    setPlotData(undefined)
    setLayoutOption(undefined)

    setLayoutOption({ ...respData.layout })
    setPlotData([...respData.plotdata])
  }

  function handleRelayout(event: any) {
    // console.log('e:', event)
  }
  //type error...
  const handleDefaultValue = () => {
    // if (selectedDates) {
    //   return [dayjs(defaultValue[0], DATE_FORMAT), dayjs(defaultValue[1], DATE_FORMAT)]
    // }

    return [dayjs(), dayjs()]
  }

  return (
    <>
      <CorrelationViewContainer>
        <PlotWrapper className="rounded-box w-100 h-100">
          <div className="w-100 h-100">
            <Button onClick={handleResetButton}>Reset Axes</Button>
            {plotImg && <img src={plotImg} width="500" height="200" style={{ margin: 'auto' }} />}
            {!plotImg && (
              <Plot
                ref={plotRef}
                // onButtonClicked={handleButtonClick}
                // onClick={() => console.log('clicked')}
                // onRedraw={handleRedrawPlot}
                className="w-100 h-100"
                data={plotData}
                layout={layoutOption}
                config={config}
                // onRedraw={handleRedrawPlot}
                // onRelayout={handleRelayout}
              />
            )}
          </div>
        </PlotWrapper>
        <HyperpararmeterWrapper className="rounded-box">
          <div className="w-100 h-90">
            <Space className="w-100" direction="vertical" size={15}>
              <ItemBox title="Time Series" component={<Switch onChange={onChangeSwitch} checked={checked} />} />
              <ItemBox
                title="Date Range"
                component={
                  <RangePicker
                    size="middle"
                    style={{ width: '100%' }}
                    // defaultValue={handleDefaultValue}
                    onChange={handleChange}
                  />
                }
                visible={checked}
              ></ItemBox>
              <ItemBox
                title="Variable X"
                component={
                  <NewTagSelect
                    style={{ width: '100%', margin: 'auto', float: 'left', minWidth: '150px' }}
                    selectionType="single"
                    type="x"
                    onSelect={handleSelect}
                    selectOptions={defaultOption}
                  />
                }
              />
              <ItemBox
                title="Variable Y"
                component={
                  <NewTagSelect
                    style={{ width: '100%', margin: 'auto', float: 'left', minWidth: '150px' }}
                    selectionType="single"
                    type="y"
                    onSelect={handleSelect}
                    selectOptions={defaultOption}
                  />
                }
              />
              <ItemBox
                title="Scaling Option"
                component={<RadioButtonGroup onChangeValue={handleRadioButtonChange} />}
              />
            </Space>
          </div>
          <div className="w-100 h-10">
            <ItemBox
              title=""
              component={
                <Button type="primary" block onClick={handleSearchClick} loading={loading}>
                  Search
                </Button>
              }
            />
          </div>
        </HyperpararmeterWrapper>
      </CorrelationViewContainer>
      <div style={{ margin: '10px 30px', float: 'right' }}>
        <Button type="text" icon={<ArrowRightOutlined />} onClick={handleNext}>
          NEXT
        </Button>
      </div>
    </>
  )
}

export default CorrelationView
