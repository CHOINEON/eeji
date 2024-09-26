import domtoimage from 'dom-to-image'
import { saveAs } from 'file-saver'
// import dynamic from 'next/dynamic'
import { useState } from 'react'
import ChartItem from './ChartItem'
// import Chart from 'react-apexcharts'
// const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })
import { useTranslation } from 'react-i18next'
import './style.css'

const Page = () => {
  const { t } = useTranslation()
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

  const [chartType, setChartType] = useState('line')

  const [layout, setLayout] = useState('/img/icon/layout_06_01.svg')
  const [fullscreenIcon, setFullscreenIcon] = useState('/img/icon/fullscreen.svg')
  const [drawing1, setDrawing1] = useState('/img/left/drawing_01.svg')
  const [drawing2, setDrawing2] = useState('/img/left/drawing_02.svg')
  const [drawing3, setDrawing3] = useState('/img/left/drawing_03.svg')

  const [rightMenu1, setRightMenu1] = useState('/img/right/right_01.svg')
  const [rightMenu2, setRightMenu2] = useState('/img/right/right_02.svg')
  const [rightMenu3, setRightMenu3] = useState('/img/right/right_03.svg')

  const [layoutType, setLayoutType] = useState(18)
  const [isPopup, setIsPopup] = useState(false)
  const [isReset, setIsReset] = useState(false)

  const handleLayout = (type: number, src: string) => {
    setIsPopup(false)
    setLayout(src)
    setLayoutType(type)
  }

  return (
    <div className="bg-[#F5F8FF]  rounded-[25px]">
      <div className="container p-5 h-[800px]">
        <div className="lg:flex items-center justify-between px-4 space-y-4 lg:space-y-0">
          <div className="lg:flex items-center space-y-4 lg:space-y-0">
            <div className="mr-12 text-[20px] lg:text-[32px] font-bold text-[#002D65]">
              {t('Commodity Index Forecast')}
            </div>
            <div className="flex space-x-1">
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
            <div
              className="item"
              onClick={() => {
                setIsPopup(!isPopup)
              }}
            >
              <img
                src={layout}
                alt=""
                // onMouseOver={() => {
                //   setLayout('/img/layout/layout_01_01_on.svg')
                // }}
                // onMouseLeave={() => {
                //   setLayout('/img/layout/layout_01_01.svg')
                // }}
              />
            </div>
            <div className="ml-1 text-[13px] text-[#002D65] cursor-pointer">{t('Save')}</div>
            <div
              className={`item ml-10 mr-2 ${document.fullscreenElement}`}
              onClick={() => {
                // TODO 2024-02-07 웹브라우저 풀스크린 모드 toggle
                if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen()
                  setFullscreenIcon('/img/icon/exit_fullscreen.svg')
                } else {
                  document.exitFullscreen()
                  setFullscreenIcon('/img/icon/fullscreen.svg')
                }
              }}
            >
              <img src={fullscreenIcon} />
            </div>

            <div
              className="item "
              onClick={() => {
                http: domtoimage.toBlob(document.querySelector('#screen-body')).then((blob: any) => {
                  const saveConfirm = window.confirm('이미지를 저장하시겠습니까?')
                  if (saveConfirm === true) {
                    saveAs(blob, 'download.png')
                  }
                })
              }}
            >
              <img src="/img/icon/capture.svg" />
            </div>

            <div
              className="border border-[#D5DCEF] bg-white ml-2 py-[7px] px-2 rounded-[10px] select-none cursor-pointer hover:text-[#372dd5] hover:border-[#372dd5] text-sm text-[#0f2c61]"
              onClick={() => {
                setIsReset(true)
                setTimeout(() => {
                  setIsReset(false)
                }, 100)
              }}
            >
              {t('Reset')}
            </div>
            <div className="item ml-2">
              <img src="/img/icon/setting.svg" />
            </div>
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
                    className={`mr-1.5 group item ${layoutType === 1 ? 'item-active' : ''}`}
                    onClick={() => {
                      handleLayout(1, '/img/icon/layout_01.svg')
                    }}
                  >
                    <img src={`/img/icon/layout_01.svg`} alt="" />
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="text-[#002D65] text-[13px] mr-2 w-[10px]">2</div>
                <div className="flex ">
                  <div
                    className={`mr-1.5 group item ${layoutType === 2 ? 'item-active' : ''}`}
                    onClick={() => {
                      handleLayout(2, '/img/icon/layout_02_01.svg')
                    }}
                  >
                    <img src={`/img/icon/layout_02_01.svg`} alt="" />
                  </div>
                  <div
                    className={`mr-1.5 group item ${layoutType === 3 ? 'item-active' : ''}`}
                    onClick={() => {
                      handleLayout(3, '/img/icon/layout_02_02.svg')
                    }}
                  >
                    <img src={`/img/icon/layout_02_02.svg`} alt="" />
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="text-[#002D65] text-[13px] mr-2 w-[10px]">3</div>
                <div className="flex">
                  <div
                    className={`mr-1.5 group item ${layoutType === 4 ? 'item-active' : ''}`}
                    onClick={() => {
                      handleLayout(4, '/img/icon/layout_03_01.svg')
                    }}
                  >
                    <img src={`/img/icon/layout_03_01.svg`} alt="" />
                  </div>
                  <div
                    className={`mr-1.5 group item ${layoutType === 5 ? 'item-active' : ''}`}
                    onClick={() => {
                      handleLayout(5, '/img/icon/layout_03_02.svg')
                    }}
                  >
                    <img src={`/img/icon/layout_03_02.svg`} alt="" />
                  </div>
                  <div
                    className={`mr-1.5 group item ${layoutType === 6 ? 'item-active' : ''}`}
                    onClick={() => {
                      handleLayout(6, '/img/icon/layout_03_03.svg')
                    }}
                  >
                    <img src={`/img/icon/layout_03_03.svg`} alt="" />
                  </div>
                  <div
                    className={`mr-1.5 group item ${layoutType === 7 ? 'item-active' : ''}`}
                    onClick={() => {
                      handleLayout(7, '/img/icon/layout_03_04.svg')
                    }}
                  >
                    <img src={`/img/icon/layout_03_04.svg`} alt="" />
                  </div>
                  <div
                    className={`mr-1.5 group item ${layoutType === 8 ? 'item-active' : ''}`}
                    onClick={() => {
                      handleLayout(8, '/img/icon/layout_03_05.svg')
                    }}
                  >
                    <img src={`/img/icon/layout_03_05.svg`} alt="" />
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="text-[#002D65] text-[13px] mr-2 w-[10px]">4</div>
                <div className="flex">
                  <div
                    className={`mr-1.5 group item ${layoutType === 9 ? 'item-active' : ''}`}
                    onClick={() => {
                      handleLayout(9, '/img/icon/layout_04_01.svg')
                    }}
                  >
                    <img src={`/img/icon/layout_04_01.svg`} alt="" />
                  </div>
                  <div
                    className={`mr-1.5 group item ${layoutType === 10 ? 'item-active' : ''}`}
                    onClick={() => {
                      handleLayout(10, '/img/icon/layout_04_02.svg')
                    }}
                  >
                    <img src={`/img/icon/layout_04_02.svg`} alt="" />
                  </div>
                  <div
                    className={`mr-1.5 group item ${layoutType === 11 ? 'item-active' : ''}`}
                    onClick={() => {
                      handleLayout(11, '/img/icon/layout_04_03.svg')
                    }}
                  >
                    <img src={`/img/icon/layout_04_03.svg`} alt="" />
                  </div>
                  <div
                    className={`mr-1.5 group item ${layoutType === 12 ? 'item-active' : ''}`}
                    onClick={() => {
                      handleLayout(12, '/img/icon/layout_04_04.svg')
                    }}
                  >
                    <img src={`/img/icon/layout_04_04.svg`} alt="" />
                  </div>
                  <div
                    className={`mr-1.5 group item ${layoutType === 13 ? 'item-active' : ''}`}
                    onClick={() => {
                      handleLayout(13, '/img/icon/layout_04_05.svg')
                    }}
                  >
                    <img src={`/img/icon/layout_04_05.svg`} alt="" />
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="text-[#002D65] text-[13px] mr-2 w-[10px]">5</div>
                <div className="flex">
                  <div
                    className={`mr-1.5 group item ${layoutType === 14 ? 'item-active' : ''}`}
                    onClick={() => {
                      handleLayout(14, '/img/icon/layout_05_01.svg')
                    }}
                  >
                    <img src={`/img/icon/layout_05_01.svg`} alt="" />
                  </div>
                  <div
                    className={`mr-1.5 group item ${layoutType === 15 ? 'item-active' : ''}`}
                    onClick={() => {
                      handleLayout(15, '/img/icon/layout_05_02.svg')
                    }}
                  >
                    <img src={`/img/icon/layout_05_02.svg`} alt="" />
                  </div>
                  <div
                    className={`mr-1.5 group item ${layoutType === 16 ? 'item-active' : ''}`}
                    onClick={() => {
                      handleLayout(16, '/img/icon/layout_05_03.svg')
                    }}
                  >
                    <img src={`/img/icon/layout_05_03.svg`} alt="" />
                  </div>
                  <div
                    className={`mr-1.5 group item ${layoutType === 17 ? 'item-active' : ''}`}
                    onClick={() => {
                      handleLayout(17, '/img/icon/layout_05_04.svg')
                    }}
                  >
                    <img src={`/img/icon/layout_05_04.svg`} alt="" />
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="text-[#002D65] text-[13px] mr-2 w-[10px]">6</div>
                <div className="flex">
                  <div
                    className={`mr-1.5 group item ${layoutType === 18 ? 'item-active' : ''}`}
                    onClick={() => {
                      handleLayout(18, '/img/icon/layout_06_01.svg')
                    }}
                  >
                    <img src={`/img/icon/layout_06_01.svg`} alt="" />
                  </div>
                  <div
                    className={`mr-1.5 group item ${layoutType === 19 ? 'item-active' : ''}`}
                    onClick={() => {
                      handleLayout(19, '/img/icon/layout_06_02.svg')
                    }}
                  >
                    <img src={`/img/icon/layout_06_02.svg`} alt="" />
                  </div>
                  <div
                    className={`mr-1.5 group item ${layoutType === 20 ? 'item-active' : ''}`}
                    onClick={() => {
                      handleLayout(20, '/img/icon/layout_06_03.svg')
                    }}
                  >
                    <img src={`/img/icon/layout_06_03.svg`} alt="" />
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="text-[#002D65] text-[13px] mr-2 w-[10px]">7</div>
                <div className="flex">
                  <div
                    className={`mr-1.5 group item ${layoutType === 21 ? 'item-active' : ''}`}
                    onClick={() => {
                      handleLayout(21, '/img/icon/layout_07_01.svg')
                    }}
                  >
                    <img src={`/img/icon/layout_07_01.svg`} alt="" />
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="text-[#002D65] text-[13px] mr-2 w-[10px]">8</div>
                <div className="flex">
                  <div
                    className={`mr-1.5 group item ${layoutType === 22 ? 'item-active' : ''}`}
                    onClick={() => {
                      handleLayout(22, '/img/icon/layout_08_01.svg')
                    }}
                  >
                    <img src={`/img/icon/layout_08_01.svg`} alt="" />
                  </div>
                  <div
                    className={`mr-1.5 group item ${layoutType === 23 ? 'item-active' : ''}`}
                    onClick={() => {
                      handleLayout(23, '/img/icon/layout_08_02.svg')
                    }}
                  >
                    <img src={`/img/icon/layout_08_02.svg`} alt="" />
                  </div>
                  <div
                    className={`mr-1.5 group item ${layoutType === 24 ? 'item-active' : ''}`}
                    onClick={() => {
                      handleLayout(24, '/img/icon/layout_08_03.svg')
                    }}
                  >
                    <img src={`/img/icon/layout_08_03.svg`} alt="" />
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
    </div>
  )
}

export default Page
