import domtoimage from 'dom-to-image'
import { saveAs } from 'file-saver'
// import dynamic from 'next/dynamic'
import { useState } from 'react'
import ChartItem from './ChartItem'
import ApexCharts from 'react-apexcharts'
// import Chart from 'react-apexcharts'
// const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

const Page = () => {
  // TODO 2024-03-06

  // useEffect(() => {
  //   axios
  //     .get('/api/index_predict/get_symbol_list/admin?is_daily=1&symbol=BCOMZS.INDX')
  //     .then(({ data }) => {
  //       console.log(data)
  //     })
  //     .catch((error) => console.error(error))
  //     .then(() => {})
  // }, [])

  const [range, setRange] = useState('day')
  const [chartType, setChartType] = useState('line')

  const [layout, setLayout] = useState('/img/layout/layout_00.svg')
  const [fullscreen, setFullscreen] = useState('/img/top_right/fullscreen.svg')
  const [capture, setCapture] = useState('/img/top_right/capture.svg')
  const [setting, setSetting] = useState('/img/top_right/setting.svg')

  const [drawing1, setDrawing1] = useState('/img/left/drawing_01.svg')
  const [drawing2, setDrawing2] = useState('/img/left/drawing_02.svg')
  const [drawing3, setDrawing3] = useState('/img/left/drawing_03.svg')

  const [rightMenu1, setRightMenu1] = useState('/img/right/right_01.svg')
  const [rightMenu2, setRightMenu2] = useState('/img/right/right_02.svg')
  const [rightMenu3, setRightMenu3] = useState('/img/right/right_03.svg')

  const [layoutType, setLayoutType] = useState(1)
  const [isPopup, setIsPopup] = useState(false)
  const [isReset, setIsReset] = useState(false)

  const handleLayout = (type: number) => {
    setIsPopup(false)
    setLayoutType(type)
  }

  return (
    <section className="bg-[#F5F8FF]">
      <div className="container p-5 h-screen">
        <div className="lg:flex items-center justify-between px-4 space-y-4 lg:space-y-0">
          <div className="lg:flex items-center space-y-4 lg:space-y-0">
            <div className="mr-12 text-[20px] lg:text-[32px] font-bold text-[#002D65]">Commodity Index Forecasting</div>
            <div className="flex space-x-1">
              <img
                src={range === 'day' ? '/img/top/day_on.svg' : '/img/top/day.svg'}
                alt=""
                onClick={() => {
                  setRange('day')
                }}
                className="cursor-pointer"
              />
              <img
                src={range === 'month' ? '/img/top/month_on.svg' : '/img/top/month.svg'}
                alt=""
                onClick={() => {
                  // setRange('month')
                }}
                className="cursor-pointer"
              />
              <img
                src={chartType === 'candle' ? '/img/top/candle_on.svg' : '/img/top/candle.svg'}
                alt=""
                onClick={() => {
                  // setChartType('candle')
                }}
                // className="cursor-pointer"
              />

              <img
                src={chartType === 'line' ? '/img/top/line_on.svg' : '/img/top/line.svg'}
                alt=""
                onClick={() => {
                  setChartType('line')
                }}
                className="cursor-pointer"
              />

              {/* <Image
            className="cursor-pointer"
            src={`./${src}`}
            alt=""
            width={30}
            height={30}
          /> */}
            </div>
          </div>

          <div className="flex items-center">
            <img
              src={layout}
              alt=""
              onMouseOver={() => {
                setLayout('/img/layout/layout_01_01_on.svg')
              }}
              onMouseLeave={() => {
                setLayout('/img/layout/layout_01_01.svg')
              }}
              onClick={() => {
                setIsPopup(!isPopup)
              }}
              className="cursor-pointer"
            />
            <div className="ml-1 text-[13px] text-[#002D65] cursor-pointer">Save</div>
            <img
              src={fullscreen}
              // src={document.fullscreenElement ? '/img/top_right/fullscreen_on.svg' : '/img/top_right/fullscreen.svg'}
              alt=""
              onMouseOver={() => {
                setFullscreen('/img/top_right/fullscreen_on.svg')
              }}
              onMouseLeave={() => {
                setFullscreen('/img/top_right/fullscreen.svg')
              }}
              onClick={() => {
                // TODO 2024-02-07 웹브라우저 풀스크린 모드 toggle
                if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen()
                } else {
                  document.exitFullscreen()
                }
              }}
              className="cursor-pointer ml-10 mr-2"
            />
            <img
              src={capture}
              alt=""
              onMouseOver={() => {
                setCapture('/img/top_right/capture_on.svg')
              }}
              onMouseLeave={() => {
                setCapture('/img/top_right/capture.svg')
              }}
              onClick={() => {
                //localhost:3000/img/layout/layout_02_01_on.svg
                // const node = document.getElementById('screen-body')
                http: domtoimage.toBlob(document.querySelector('#screen-body')).then((blob: any) => {
                  const saveConfirm = window.confirm('이미지를 저장하시겠습니까?')
                  if (saveConfirm === true) {
                    saveAs(blob, 'download.png')
                  }
                })
              }}
              className="cursor-pointer"
            />

            <div
              className="border border-[#D5DCEF] bg-white ml-2 py-[7px] px-2 rounded-[10px] select-none cursor-pointer hover:text-[#372dd5] hover:border-[#372dd5] text-sm text-[#0f2c61]"
              onClick={() => {
                setIsReset(true)
                setTimeout(() => {
                  setIsReset(false)
                }, 100)
              }}
            >
              Reset
            </div>
            <img
              src={setting}
              alt=""
              onMouseOver={() => {
                setSetting('/img/top_right/setting_on.svg')
              }}
              onMouseLeave={() => {
                setSetting('/img/top_right/setting.svg')
              }}
              className="cursor-pointer ml-2"
            />
          </div>
        </div>

        {/* box 시작 */}
        <div className="bg-white h-[calc(100%-65px)] rounded-2xl shadow-indigo-200 shadow-sm p-3 mt-2 relative ">
          {/* 레이아웃 팝업 시작 */}
          <div
            className={`absolute right-[90px] top-[35px] bg-white popup transition-all duration-100 z-[1001] ${
              // className={`fixed right-[110px] top-[110px] bg-white popup transition-all duration-100 z-[100] ${
              // isPopup ? 'visible translate-y-0 scale-100 slideInUp' : 'invisible -translate-y-3 scale-95 '
              isPopup ? 'slideInDown' : 'invisible'
            }`}
          >
            <div className="space-y-4 px-2 py-3 shadow-indigo-200 shadow-sm rounded-xl border border-[#D5DCEF] bg-white">
              <div className="flex items-center">
                <div className="text-[#002D65] text-[13px] mr-2 w-[10px]">1</div>
                <div className="flex ">
                  <div
                    className="mr-1.5 group"
                    onClick={() => {
                      handleLayout(1)
                    }}
                  >
                    <img
                      src={`/img/layout/layout_01_01${layoutType === 1 ? '_on' : ''}.svg`}
                      alt=""
                      className="icon-off"
                    />
                    <img src="/img/layout/layout_01_01_on.svg" alt="" className="icon-on" />
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="text-[#002D65] text-[13px] mr-2 w-[10px]">2</div>
                <div className="flex ">
                  <div
                    className="mr-1.5 group"
                    onClick={() => {
                      handleLayout(2)
                    }}
                  >
                    <img
                      src={`/img/layout/layout_02_01${layoutType === 2 ? '_on' : ''}.svg`}
                      alt=""
                      className="icon-off"
                    />
                    <img src="/img/layout/layout_02_01_on.svg" alt="" className="icon-on" />
                  </div>
                  <div
                    className="mr-1.5 group"
                    onClick={() => {
                      handleLayout(3)
                    }}
                  >
                    <img
                      src={`/img/layout/layout_02_02${layoutType === 3 ? '_on' : ''}.svg`}
                      alt=""
                      className="icon-off"
                    />
                    <img src="/img/layout/layout_02_02_on.svg" alt="" className="icon-on" />
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="text-[#002D65] text-[13px] mr-2 w-[10px]">3</div>
                <div className="flex">
                  <div
                    className="mr-1.5 group"
                    onClick={() => {
                      handleLayout(4)
                    }}
                  >
                    <img
                      src={`/img/layout/layout_03_01${layoutType === 4 ? '_on' : ''}.svg`}
                      alt=""
                      className="icon-off"
                    />
                    <img src="/img/layout/layout_03_01_on.svg" alt="" className="icon-on" />
                  </div>
                  <div
                    className="mr-1.5 group"
                    onClick={() => {
                      handleLayout(5)
                    }}
                  >
                    <img
                      src={`/img/layout/layout_03_02${layoutType === 5 ? '_on' : ''}.svg`}
                      alt=""
                      className="icon-off"
                    />
                    <img src="/img/layout/layout_03_02_on.svg" alt="" className="icon-on" />
                  </div>
                  <div
                    className="mr-1.5 group"
                    onClick={() => {
                      handleLayout(6)
                    }}
                  >
                    <img
                      src={`/img/layout/layout_03_03${layoutType === 6 ? '_on' : ''}.svg`}
                      alt=""
                      className="icon-off"
                    />
                    <img src="/img/layout/layout_03_03_on.svg" alt="" className="icon-on" />
                  </div>
                  <div
                    className="mr-1.5 group"
                    onClick={() => {
                      handleLayout(7)
                    }}
                  >
                    <img
                      src={`/img/layout/layout_03_04${layoutType === 7 ? '_on' : ''}.svg`}
                      alt=""
                      className="icon-off"
                    />
                    <img src="/img/layout/layout_03_04_on.svg" alt="" className="icon-on" />
                  </div>
                  <div
                    className="mr-1.5 group"
                    onClick={() => {
                      handleLayout(8)
                    }}
                  >
                    <img
                      src={`/img/layout/layout_03_05${layoutType === 8 ? '_on' : ''}.svg`}
                      alt=""
                      className="icon-off"
                    />
                    <img src="/img/layout/layout_03_05_on.svg" alt="" className="icon-on" />
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="text-[#002D65] text-[13px] mr-2 w-[10px]">4</div>
                <div className="flex">
                  <div
                    className="mr-1.5 group"
                    onClick={() => {
                      handleLayout(9)
                    }}
                  >
                    <img
                      src={`/img/layout/layout_04_01${layoutType === 9 ? '_on' : ''}.svg`}
                      alt=""
                      className="icon-off"
                    />
                    <img src="/img/layout/layout_04_01_on.svg" alt="" className="icon-on" />
                  </div>
                  <div
                    className="mr-1.5 group"
                    onClick={() => {
                      handleLayout(10)
                    }}
                  >
                    <img
                      src={`/img/layout/layout_04_02${layoutType === 10 ? '_on' : ''}.svg`}
                      alt=""
                      className="icon-off"
                    />
                    <img src="/img/layout/layout_04_02_on.svg" alt="" className="icon-on" />
                  </div>
                  <div
                    className="mr-1.5 group"
                    onClick={() => {
                      handleLayout(11)
                    }}
                  >
                    <img
                      src={`/img/layout/layout_04_03${layoutType === 11 ? '_on' : ''}.svg`}
                      alt=""
                      className="icon-off"
                    />
                    <img src="/img/layout/layout_04_03_on.svg" alt="" className="icon-on" />
                  </div>
                  <div
                    className="mr-1.5 group"
                    onClick={() => {
                      handleLayout(12)
                    }}
                  >
                    <img
                      src={`/img/layout/layout_04_04${layoutType === 12 ? '_on' : ''}.svg`}
                      alt=""
                      className="icon-off"
                    />
                    <img src="/img/layout/layout_04_04_on.svg" alt="" className="icon-on" />
                  </div>
                  <div
                    className="mr-1.5 group"
                    onClick={() => {
                      handleLayout(13)
                    }}
                  >
                    <img
                      src={`/img/layout/layout_04_05${layoutType === 13 ? '_on' : ''}.svg`}
                      alt=""
                      className="icon-off"
                    />
                    <img src="/img/layout/layout_04_05_on.svg" alt="" className="icon-on" />
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="text-[#002D65] text-[13px] mr-2 w-[10px]">5</div>
                <div className="flex">
                  <div
                    className="mr-1.5 group"
                    onClick={() => {
                      handleLayout(14)
                    }}
                  >
                    <img
                      src={`/img/layout/layout_05_01${layoutType === 14 ? '_on' : ''}.svg`}
                      alt=""
                      className="icon-off"
                    />
                    <img src="/img/layout/layout_05_01_on.svg" alt="" className="icon-on" />
                  </div>
                  <div
                    className="mr-1.5 group"
                    onClick={() => {
                      handleLayout(15)
                    }}
                  >
                    <img
                      src={`/img/layout/layout_05_02${layoutType === 15 ? '_on' : ''}.svg`}
                      alt=""
                      className="icon-off"
                    />
                    <img src="/img/layout/layout_05_02_on.svg" alt="" className="icon-on" />
                  </div>
                  <div
                    className="mr-1.5 group"
                    onClick={() => {
                      handleLayout(16)
                    }}
                  >
                    <img
                      src={`/img/layout/layout_05_03${layoutType === 16 ? '_on' : ''}.svg`}
                      alt=""
                      className="icon-off"
                    />
                    <img src="/img/layout/layout_05_03_on.svg" alt="" className="icon-on" />
                  </div>
                  <div
                    className="mr-1.5 group"
                    onClick={() => {
                      handleLayout(17)
                    }}
                  >
                    <img
                      src={`/img/layout/layout_05_04${layoutType === 17 ? '_on' : ''}.svg`}
                      alt=""
                      className="icon-off"
                    />
                    <img src="/img/layout/layout_05_04_on.svg" alt="" className="icon-on" />
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="text-[#002D65] text-[13px] mr-2 w-[10px]">6</div>
                <div className="flex">
                  <div
                    className="mr-1.5 group"
                    onClick={() => {
                      handleLayout(18)
                    }}
                  >
                    <img
                      src={`/img/layout/layout_06_01${layoutType === 18 ? '_on' : ''}.svg`}
                      alt=""
                      className="icon-off"
                    />
                    <img src="/img/layout/layout_06_01_on.svg" alt="" className="icon-on" />
                  </div>
                  <div
                    className="mr-1.5 group"
                    onClick={() => {
                      handleLayout(19)
                    }}
                  >
                    <img
                      src={`/img/layout/layout_06_02${layoutType === 19 ? '_on' : ''}.svg`}
                      alt=""
                      className="icon-off"
                    />
                    <img src="/img/layout/layout_06_02_on.svg" alt="" className="icon-on" />
                  </div>
                  <div
                    className="mr-1.5 group"
                    onClick={() => {
                      handleLayout(20)
                    }}
                  >
                    <img
                      src={`/img/layout/layout_06_03${layoutType === 20 ? '_on' : ''}.svg`}
                      alt=""
                      className="icon-off"
                    />
                    <img src="/img/layout/layout_06_03_on.svg" alt="" className="icon-on" />
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="text-[#002D65] text-[13px] mr-2 w-[10px]">7</div>
                <div className="flex">
                  <div
                    className="mr-1.5 group"
                    onClick={() => {
                      handleLayout(21)
                    }}
                  >
                    <img
                      src={`/img/layout/layout_07_01${layoutType === 21 ? '_on' : ''}.svg`}
                      alt=""
                      className="icon-off"
                    />
                    <img src="/img/layout/layout_07_01_on.svg" alt="" className="icon-on" />
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="text-[#002D65] text-[13px] mr-2 w-[10px]">8</div>
                <div className="flex">
                  <div
                    className="mr-1.5 group"
                    onClick={() => {
                      handleLayout(22)
                    }}
                  >
                    <img
                      src={`/img/layout/layout_08_01${layoutType === 22 ? '_on' : ''}.svg`}
                      alt=""
                      className="icon-off"
                    />
                    <img src="/img/layout/layout_08_01_on.svg" alt="" className="icon-on" />
                  </div>
                  <div
                    className="mr-1.5 group"
                    onClick={() => {
                      handleLayout(23)
                    }}
                  >
                    <img
                      src={`/img/layout/layout_08_02${layoutType === 23 ? '_on' : ''}.svg`}
                      alt=""
                      className="icon-off"
                    />
                    <img src="/img/layout/layout_08_02_on.svg" alt="" className="icon-on" />
                  </div>
                  <div
                    className="mr-1.5 group"
                    onClick={() => {
                      handleLayout(24)
                    }}
                  >
                    <img
                      src={`/img/layout/layout_08_03${layoutType === 24 ? '_on' : ''}.svg`}
                      alt=""
                      className="icon-off"
                    />
                    <img src="/img/layout/layout_08_03_on.svg" alt="" className="icon-on" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 레이아웃 팝업 시작 */}

          <div className="flex justify-between h-full" id="screen-body">
            <div className="w-[50px] h-full bg-[#F6F8FF] border border-[#D5DCEF] rounded-xl flex flex-col items-center hidden">
              <img
                src={drawing1}
                alt=""
                onMouseOver={() => {
                  setDrawing1('/img/left/drawing_01_on.svg')
                }}
                onMouseLeave={() => {
                  setDrawing1('/img/left/drawing_01.svg')
                }}
                className="cursor-pointer w-[36px] h-[36px] mt-1"
              />
              <img
                src={drawing2}
                alt=""
                onMouseOver={() => {
                  setDrawing2('/img/left/drawing_02_on.svg')
                }}
                onMouseLeave={() => {
                  setDrawing2('/img/left/drawing_02.svg')
                }}
                className="cursor-pointer w-[36px] h-[36px] mt-1"
              />
              <img
                src={drawing3}
                alt=""
                onMouseOver={() => {
                  setDrawing3('/img/left/drawing_03_on.svg')
                }}
                onMouseLeave={() => {
                  setDrawing3('/img/left/drawing_03.svg')
                }}
                className="cursor-pointer w-[36px] h-[36px] mt-1"
              />
            </div>
            <div className="bg-white border border-[#D5DCEF] items-stretch w-full mx-2 rounded-xl p-3 h-full ">
              {
                {
                  1: (
                    <div className="grid grid-cols-1 gap-2 h-full">
                      <ChartItem chart_id="chart-1" is_reset={`${isReset}`} />
                    </div>
                  ),
                  2: (
                    <div className="grid grid-cols-2 gap-2 h-full">
                      <ChartItem chart_id="chart-1" is_reset={`${isReset}`} />
                      <ChartItem chart_id="chart-2" is_reset={`${isReset}`} />
                    </div>
                  ),
                  3: (
                    <div className="grid grid-rows-2 gap-2 h-full">
                      <ChartItem chart_id="chart-1" is_reset={`${isReset}`} />
                      <ChartItem chart_id="chart-2" is_reset={`${isReset}`} />
                    </div>
                  ),
                  4: (
                    <div className="grid grid-rows-3 gap-2 h-full">
                      <ChartItem chart_id="chart-1" is_reset={`${isReset}`} />
                      <ChartItem chart_id="chart-2" is_reset={`${isReset}`} />
                      <ChartItem chart_id="chart-3" is_reset={`${isReset}`} />
                    </div>
                  ),
                  5: (
                    <div className="grid grid-cols-3 gap-2 h-full">
                      <ChartItem chart_id="chart-1" is_reset={`${isReset}`} />
                      <ChartItem chart_id="chart-2" is_reset={`${isReset}`} />
                      <ChartItem chart_id="chart-3" is_reset={`${isReset}`} />
                    </div>
                  ),
                  6: (
                    <div className="grid grid-cols-2 gap-2 h-full">
                      <ChartItem chart_id="chart-1" is_reset={`${isReset}`} />
                      <div className="grid grid-rows-2 gap-2">
                        <ChartItem chart_id="chart-2" is_reset={`${isReset}`} />
                        <ChartItem chart_id="chart-3" is_reset={`${isReset}`} />
                      </div>
                    </div>
                  ),
                  7: (
                    <div className="grid grid-rows-2 gap-2 h-full">
                      <ChartItem chart_id="chart-1" is_reset={`${isReset}`} />
                      <div className="grid grid-cols-2 gap-2">
                        <ChartItem chart_id="chart-2" is_reset={`${isReset}`} />
                        <ChartItem chart_id="chart-3" is_reset={`${isReset}`} />
                      </div>
                    </div>
                  ),
                  8: (
                    <div className="grid grid-cols-2 gap-2 h-full">
                      <div className="grid grid-rows-2 gap-2">
                        <ChartItem chart_id="chart-1" is_reset={`${isReset}`} />
                        <ChartItem chart_id="chart-2" is_reset={`${isReset}`} />
                      </div>
                      <ChartItem chart_id="chart-3" is_reset={`${isReset}`} />
                    </div>
                  ),
                  9: (
                    <div className="grid grid-cols-2 gap-2 h-full">
                      <div className="grid grid-rows-2 gap-2">
                        <ChartItem chart_id="chart-1" is_reset={`${isReset}`} />
                        <ChartItem chart_id="chart-2" is_reset={`${isReset}`} />
                      </div>
                      <div className="grid grid-rows-2 gap-2">
                        <ChartItem chart_id="chart-3" is_reset={`${isReset}`} />
                        <ChartItem chart_id="chart-4" is_reset={`${isReset}`} />
                      </div>
                    </div>
                  ),
                  10: (
                    <div className="grid grid-cols-4 gap-2 h-full">
                      <ChartItem chart_id="chart-1" is_reset={`${isReset}`} />
                      <ChartItem chart_id="chart-2" is_reset={`${isReset}`} />
                      <ChartItem chart_id="chart-3" is_reset={`${isReset}`} />
                      <ChartItem chart_id="chart-4" is_reset={`${isReset}`} />
                    </div>
                  ),
                  11: (
                    <div className="grid grid-rows-4 gap-2 h-full">
                      <ChartItem chart_id="chart-1" is_reset={`${isReset}`} />
                      <ChartItem chart_id="chart-2" is_reset={`${isReset}`} />
                      <ChartItem chart_id="chart-3" is_reset={`${isReset}`} />
                      <ChartItem chart_id="chart-4" is_reset={`${isReset}`} />
                    </div>
                  ),
                  12: (
                    <div className="grid grid-cols-2 gap-2 h-full">
                      <ChartItem chart_id="chart-1" is_reset={`${isReset}`} />
                      <div className="grid grid-rows-3 gap-2">
                        <ChartItem chart_id="chart-2" is_reset={`${isReset}`} />
                        <ChartItem chart_id="chart-3" is_reset={`${isReset}`} />
                        <ChartItem chart_id="chart-4" is_reset={`${isReset}`} />
                      </div>
                    </div>
                  ),
                  13: (
                    <div className="grid grid-rows-3 gap-2 h-full">
                      <div className="grid grid-cols-2 gap-2">
                        <ChartItem chart_id="chart-1" is_reset={`${isReset}`} />
                        <ChartItem chart_id="chart-2" is_reset={`${isReset}`} />
                      </div>
                      <ChartItem chart_id="chart-3" is_reset={`${isReset}`} />
                      <ChartItem chart_id="chart-4" is_reset={`${isReset}`} />
                    </div>
                  ),
                  14: (
                    <div className="grid grid-rows-2 gap-2 h-full">
                      <ChartItem chart_id="chart-1" is_reset={`${isReset}`} />
                      <div className="grid grid-cols-4 gap-2">
                        <ChartItem chart_id="chart-2" is_reset={`${isReset}`} />
                        <ChartItem chart_id="chart-3" is_reset={`${isReset}`} />
                        <ChartItem chart_id="chart-4" is_reset={`${isReset}`} />
                        <ChartItem chart_id="chart-5" is_reset={`${isReset}`} />
                      </div>
                    </div>
                  ),
                  15: (
                    <div className="grid grid-cols-2 gap-2 h-full">
                      <ChartItem chart_id="chart-1" is_reset={`${isReset}`} />
                      <div className="grid grid-rows-4 gap-2">
                        <ChartItem chart_id="chart-2" is_reset={`${isReset}`} />
                        <ChartItem chart_id="chart-3" is_reset={`${isReset}`} />
                        <ChartItem chart_id="chart-4" is_reset={`${isReset}`} />
                        <ChartItem chart_id="chart-5" is_reset={`${isReset}`} />
                      </div>
                    </div>
                  ),
                  16: (
                    <div className="grid grid-rows-2 gap-2 h-full">
                      <div className="grid grid-cols-2 gap-2">
                        <ChartItem chart_id="chart-1" is_reset={`${isReset}`} />
                        <ChartItem chart_id="chart-2" is_reset={`${isReset}`} />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <ChartItem chart_id="chart-3" is_reset={`${isReset}`} />
                        <ChartItem chart_id="chart-4" is_reset={`${isReset}`} />
                        <ChartItem chart_id="chart-5" is_reset={`${isReset}`} />
                      </div>
                    </div>
                  ),
                  17: (
                    <div className="grid grid-cols-5 gap-2 h-full">
                      <ChartItem chart_id="chart-1" is_reset={`${isReset}`} />
                      <ChartItem chart_id="chart-2" is_reset={`${isReset}`} />
                      <ChartItem chart_id="chart-3" is_reset={`${isReset}`} />
                      <ChartItem chart_id="chart-4" is_reset={`${isReset}`} />
                      <ChartItem chart_id="chart-5" is_reset={`${isReset}`} />
                    </div>
                  ),
                  18: (
                    <div className="grid grid-rows-2 gap-2 h-full">
                      <div className="grid grid-cols-3 gap-2 h-full">
                        <ChartItem chart_id="chart-1" is_reset={`${isReset}`} />
                        <ChartItem chart_id="chart-2" is_reset={`${isReset}`} />
                        <ChartItem chart_id="chart-3" is_reset={`${isReset}`} />
                      </div>
                      <div className="grid grid-cols-3 gap-2 h-full">
                        <ChartItem chart_id="chart-4" is_reset={`${isReset}`} />
                        <ChartItem chart_id="chart-5" is_reset={`${isReset}`} />
                        <ChartItem chart_id="chart-6" is_reset={`${isReset}`} />
                      </div>
                    </div>
                  ),
                  19: (
                    <div className="grid grid-rows-3 gap-2 h-full">
                      <div className="grid grid-cols-2 gap-2 h-full">
                        <ChartItem chart_id="chart-1" is_reset={`${isReset}`} />
                        <ChartItem chart_id="chart-2" is_reset={`${isReset}`} />
                      </div>
                      <div className="grid grid-cols-2 gap-2 h-full">
                        <ChartItem chart_id="chart-3" is_reset={`${isReset}`} />
                        <ChartItem chart_id="chart-4" is_reset={`${isReset}`} />
                      </div>
                      <div className="grid grid-cols-2 gap-2 h-full">
                        <ChartItem chart_id="chart-5" is_reset={`${isReset}`} />
                        <ChartItem chart_id="chart-6" is_reset={`${isReset}`} />
                      </div>
                    </div>
                  ),
                  20: (
                    <div className="grid grid-cols-6 gap-2 h-full">
                      <ChartItem chart_id="chart-1" is_reset={`${isReset}`} />
                      <ChartItem chart_id="chart-2" is_reset={`${isReset}`} />
                      <ChartItem chart_id="chart-3" is_reset={`${isReset}`} />
                      <ChartItem chart_id="chart-4" is_reset={`${isReset}`} />
                      <ChartItem chart_id="chart-5" is_reset={`${isReset}`} />
                      <ChartItem chart_id="chart-6" is_reset={`${isReset}`} />
                    </div>
                  ),
                  21: (
                    <div className="grid grid-cols-7 gap-2 h-full">
                      <ChartItem chart_id="chart-1" is_reset={`${isReset}`} />
                      <ChartItem chart_id="chart-2" is_reset={`${isReset}`} />
                      <ChartItem chart_id="chart-3" is_reset={`${isReset}`} />
                      <ChartItem chart_id="chart-4" is_reset={`${isReset}`} />
                      <ChartItem chart_id="chart-5" is_reset={`${isReset}`} />
                      <ChartItem chart_id="chart-6" is_reset={`${isReset}`} />
                      <ChartItem chart_id="chart-7" is_reset={`${isReset}`} />
                    </div>
                  ),
                  22: (
                    <div className="grid grid-rows-2 gap-2 h-full">
                      <div className="grid grid-cols-4 gap-2 h-full">
                        <ChartItem chart_id="chart-1" is_reset={`${isReset}`} />
                        <ChartItem chart_id="chart-2" is_reset={`${isReset}`} />
                        <ChartItem chart_id="chart-3" is_reset={`${isReset}`} />
                        <ChartItem chart_id="chart-4" is_reset={`${isReset}`} />
                      </div>
                      <div className="grid grid-cols-4 gap-2 h-full">
                        {' '}
                        <ChartItem chart_id="chart-5" is_reset={`${isReset}`} />
                        <ChartItem chart_id="chart-6" is_reset={`${isReset}`} />
                        <ChartItem chart_id="chart-7" is_reset={`${isReset}`} />
                        <ChartItem chart_id="chart-8" is_reset={`${isReset}`} />
                      </div>
                    </div>
                  ),
                  23: (
                    <div className="grid grid-rows-4 gap-2 h-full">
                      <div className="grid grid-cols-2 gap-2 h-full">
                        <ChartItem chart_id="chart-1" is_reset={`${isReset}`} />
                        <ChartItem chart_id="chart-2" is_reset={`${isReset}`} />
                      </div>
                      <div className="grid grid-cols-2 gap-2 h-full">
                        <ChartItem chart_id="chart-3" is_reset={`${isReset}`} />
                        <ChartItem chart_id="chart-4" is_reset={`${isReset}`} />
                      </div>
                      <div className="grid grid-cols-2 gap-2 h-full">
                        <ChartItem chart_id="chart-5" is_reset={`${isReset}`} />
                        <ChartItem chart_id="chart-6" is_reset={`${isReset}`} />
                      </div>
                      <div className="grid grid-cols-2 gap-2 h-full">
                        <ChartItem chart_id="chart-7" is_reset={`${isReset}`} />
                        <ChartItem chart_id="chart-8" is_reset={`${isReset}`} />
                      </div>
                    </div>
                  ),
                  24: (
                    <div className="grid grid-cols-8 gap-2 h-full">
                      <ChartItem chart_id="chart-1" is_reset={`${isReset}`} />
                      <ChartItem chart_id="chart-2" is_reset={`${isReset}`} />
                      <ChartItem chart_id="chart-3" is_reset={`${isReset}`} />
                      <ChartItem chart_id="chart-4" is_reset={`${isReset}`} />
                      <ChartItem chart_id="chart-5" is_reset={`${isReset}`} />
                      <ChartItem chart_id="chart-6" is_reset={`${isReset}`} />
                      <ChartItem chart_id="chart-7" is_reset={`${isReset}`} />
                      <ChartItem chart_id="chart-8" is_reset={`${isReset}`} />
                    </div>
                  ),
                }[layoutType]
              }
            </div>
            <div className="w-[50px] h-full bg-[#F6F8FF] border border-[#D5DCEF] rounded-xl flex flex-col items-center hidden">
              <img
                src={rightMenu1}
                alt=""
                onMouseOver={() => {
                  setRightMenu1('/img/right/right_01_on.svg')
                }}
                onMouseLeave={() => {
                  setRightMenu1('/img/right/right_01.svg')
                }}
                className="cursor-pointer w-[36px] h-[36px] mt-1"
              />
              <img
                src={rightMenu2}
                alt=""
                onMouseOver={() => {
                  setRightMenu2('/img/right/right_02_on.svg')
                }}
                onMouseLeave={() => {
                  setRightMenu2('/img/right/right_02.svg')
                }}
                className="cursor-pointer w-[36px] h-[36px] mt-1"
              />
              <img
                src={rightMenu3}
                alt=""
                onMouseOver={() => {
                  setRightMenu3('/img/right/right_03_on.svg')
                }}
                onMouseLeave={() => {
                  setRightMenu3('/img/right/right_03.svg')
                }}
                className="cursor-pointer w-[36px] h-[36px] mt-1"
              />
            </div>
          </div>
        </div>
        {/* box 종료 */}
      </div>
    </section>
  )
}

export default Page
