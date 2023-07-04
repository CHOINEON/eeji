import React from 'react'
import styled from '@emotion/styled'
import * as Chakra from '@chakra-ui/react'
import * as ReactIcon from 'react-icons/md'

// import reducer from '../reducer/reducer'
// import initialState from '../reducer/initialState'

import { useRecoilState } from 'recoil'
import * as TimeSeriesAtoms from 'views/hmid_config/recoil/timeseries_사용보류/atoms'

const AccordionTitle = styled.div`
  display: inline-block;
  margin-left: 1vw;
  font-weight: bold;
`

const MarginTitle = styled.div`
  margin: 0.5vw 0;
`

const Margin = styled.div`
  margin: 1.5vw 0;
`

export const TimeSeriesOption: React.FC = () => {
  const [timeSeriesLayout, setTimeSeriesLayout] = useRecoilState(TimeSeriesAtoms.TimeSeriesChartLayoutOptionState)
  const [timeSeriesData, setTimeSeriesData] = useRecoilState(TimeSeriesAtoms.TimeSeriesChartDataOptionState)
  const [showTimeSeriesDrawer, setShowTimeSeriesDrawer] = useRecoilState(TimeSeriesAtoms.TimeSeriesDrawerState)
  const btnRef = React.useRef()

  // const [LineChartData, setLineChartData] = React.useState<any>({
  //   mode: state.LINE_MODE,
  //   //추후 속성 추가 예정
  //   //name: 'vh',
  //   text: state.ENABLE_MARKER_LABEL,
  //   textposition: state.MARKER_LABEL_POSITION,
  //   line: {
  //     shape: state.LINE_SHAPE,
  //     width: state.LINE_WIDTH,
  //     dash: state.LINE_DASH,
  //   },
  //   type: 'scatter',
  //   //autosize: true,
  //   // font: {
  //   //   family: state.FONT_FAMILY,
  //   //   size: state.FONT_SIZE,
  //   //   color: state.FONT_COLOR_TEXT,
  //   // },
  // })
  // const [LineChartLayout, setLineChartLayout] = React.useState<any>({
  //   title: state.TITLE,
  //   margin: {
  //     l: state.MARGIN_LEFT,
  //     r: state.MARGIN_RIGHT,
  //     b: state.MARGIN_BOTTOM,
  //     t: state.MARGIN_TOP,
  //   },
  //   showlegend: state.ENABLE_LEGEND,
  //   xaxis: {
  //     title: state.AXIS_X_TITLE,
  //   },
  //   yaxis: {
  //     title: state.AXIS_Y_TITLE,
  //   },
  // })

  // React.useEffect(() => {
  //   if (props.ChartType === 'Line') {
  //     //setIsOpen(true)
  //   }
  // }, [props.ChartType])

  // React.useEffect(() => {
  //   setIsOpen(props.ShowTimeSeriesDrawer)
  // }, [props.ShowTimeSeriesDrawer])

  // React.useEffect(() => {
  //   props.ChartData({
  //     mode: state.LINE_MODE,
  //     //추후 속성 추가 예정
  //     //name: 'vh',
  //     text: state.ENABLE_MARKER_LABEL,
  //     textposition: state.MARKER_LABEL_POSITION,
  //     line: {
  //       shape: state.LINE_SHAPE,
  //       width: state.LINE_WIDTH,
  //       dash: state.LINE_DASH,
  //     },
  //     type: 'scatter',
  //   })
  //   props.ChartLayout({
  //     title: state.TITLE,
  //     margin: {
  //       l: state.MARGIN_LEFT,
  //       r: state.MARGIN_RIGHT,
  //       b: state.MARGIN_BOTTOM,
  //       t: state.MARGIN_TOP,
  //     },
  //     showlegend: state.ENABLE_LEGEND,
  //     xaxis: {
  //       // title: state.AXIS_X_TITLE,
  //       rangeselector: selectorOptions,
  //       rangeslider: {},
  //       autorange: true,
  //     },
  //     yaxis: {
  //       // title: state.AXIS_Y_TITLE,
  //       autorange: true,
  //       // fixedrange: true,
  //     },
  //   })
  // }, [])

  // React.useEffect(() => {
  //   props.ChartData({
  //     mode: state.LINE_MODE,
  //     //추후 속성 추가 예정
  //     //name: 'vh',
  //     text: state.ENABLE_MARKER_LABEL,
  //     textposition: state.MARKER_LABEL_POSITION,
  //     line: {
  //       shape: state.LINE_SHAPE,
  //       width: state.LINE_WIDTH,
  //       dash: state.LINE_DASH,
  //     },
  //     type: 'scatter',
  //   })
  // }, [
  //   state.LINE_MODE,
  //   state.ENABLE_MARKER_LABEL,
  //   state.MARKER_LABEL_POSITION,
  //   state.LINE_SHAPE,
  //   state.LINE_WIDTH,
  //   state.LINE_DASH,
  // ])

  // React.useEffect(() => {
  //   props.ChartLayout({
  //     title: state.TITLE,
  //     margin: {
  //       l: state.MARGIN_LEFT,
  //       r: state.MARGIN_RIGHT,
  //       b: state.MARGIN_BOTTOM,
  //       t: state.MARGIN_TOP,
  //     },
  //     showlegend: state.ENABLE_LEGEND,
  //     xaxis: {
  //       // title: state.AXIS_X_TITLE,
  //       rangeselector: selectorOptions,
  //       rangeslider: {},
  //       autorange: true,
  //     },
  //     yaxis: {
  //       // title: state.AXIS_Y_TITLE,
  //       autorange: true,
  //       // fixedrange: true,
  //     },
  //   })
  // }, [
  //   state.TITLE,
  //   state.MARGIN_LEFT,
  //   state.MARGIN_RIGHT,
  //   state.LINE_SHAPE,
  //   state.MARGIN_BOTTOM,
  //   state.MARGIN_TOP,
  //   state.ENABLE_LEGEND,
  //   state.AXIS_X_TITLE,
  //   state.AXIS_Y_TITLE,
  // ])

  return (
    <>
      <Chakra.Drawer
        isOpen={showTimeSeriesDrawer}
        placement="right"
        onClose={() => {
          setShowTimeSeriesDrawer(false)
        }}
        finalFocusRef={btnRef}
        size={'sm'}
      >
        <Chakra.DrawerOverlay />
        <Chakra.DrawerContent>
          <Chakra.DrawerCloseButton />
          <Chakra.DrawerHeader>TimeSeriesChart Option</Chakra.DrawerHeader>

          <Chakra.DrawerBody>
            <Chakra.Accordion allowToggle>
              <Chakra.AccordionItem>
                <h2>
                  <Chakra.AccordionButton>
                    <Chakra.Box as="span" flex="1" textAlign="left">
                      <ReactIcon.MdSsidChart style={{ display: 'inline-block' }} />
                      <AccordionTitle>Line Mode</AccordionTitle>
                    </Chakra.Box>
                    <Chakra.AccordionIcon />
                  </Chakra.AccordionButton>
                </h2>
                <Chakra.AccordionPanel pb={4}>
                  <Chakra.Select
                    icon={<ReactIcon.MdArrowDropDown />}
                    value={timeSeriesData.mode}
                    variant="filled"
                    placeholder="Select Line Mode"
                    onChange={(e) => {
                      setTimeSeriesData({
                        ...timeSeriesData,
                        mode: e.target.value,
                      })
                    }}
                  >
                    <option value="lines">lines</option>
                    <option value="markers">markers</option>
                    <option value="lines+markers">lines+markers</option>
                  </Chakra.Select>
                </Chakra.AccordionPanel>
              </Chakra.AccordionItem>

              <Chakra.AccordionItem>
                <h2>
                  <Chakra.AccordionButton>
                    <Chakra.Box as="span" flex="1" textAlign="left">
                      <ReactIcon.MdTitle style={{ display: 'inline-block' }} />
                      <AccordionTitle>Title</AccordionTitle>
                    </Chakra.Box>
                    <Chakra.AccordionIcon />
                  </Chakra.AccordionButton>
                </h2>
                <Chakra.AccordionPanel pb={4}>
                  <Chakra.Input
                    value={timeSeriesLayout.title}
                    onChange={(e: any) => {
                      setTimeSeriesLayout({
                        ...timeSeriesLayout,
                        title: e.target.value,
                      })
                    }}
                  />
                </Chakra.AccordionPanel>
              </Chakra.AccordionItem>

              <Chakra.AccordionItem>
                <h2>
                  <Chakra.AccordionButton>
                    <Chakra.Box as="span" flex="1" textAlign="left">
                      <ReactIcon.MdMargin style={{ display: 'inline-block' }} />
                      <AccordionTitle>Margin</AccordionTitle>
                    </Chakra.Box>
                    <Chakra.AccordionIcon />
                  </Chakra.AccordionButton>
                </h2>
                <Chakra.AccordionPanel pb={4}>
                  <div>
                    <MarginTitle>Margin Top</MarginTitle>
                    <Chakra.Slider
                      aria-label="slider-ex-6"
                      defaultValue={timeSeriesLayout.margin.t}
                      min={0}
                      max={300}
                      onChange={(val) => {
                        setTimeSeriesLayout({
                          ...timeSeriesLayout,
                          margin: {
                            ...timeSeriesLayout.margin,
                            t: val,
                          },
                        })
                      }}
                    >
                      <Chakra.SliderMark
                        value={timeSeriesLayout.margin.t}
                        textAlign="center"
                        bg="blue.500"
                        color="white"
                        mt="-10"
                        ml="-5"
                        w="12"
                      >
                        {timeSeriesLayout.margin.t}
                      </Chakra.SliderMark>
                      <Chakra.SliderTrack bg="blue.100">
                        <Chakra.SliderFilledTrack bg="#00a0e9" />
                      </Chakra.SliderTrack>
                      <Chakra.SliderThumb boxSize={6}>
                        <Chakra.Box color="brand" as={ReactIcon.MdGraphicEq} />
                      </Chakra.SliderThumb>
                    </Chakra.Slider>
                  </div>
                  <div>
                    <MarginTitle>Margin Right</MarginTitle>
                    <Chakra.Slider
                      aria-label="slider-ex-4"
                      min={0}
                      max={300}
                      onChange={(val) => {
                        setTimeSeriesLayout({
                          ...timeSeriesLayout,
                          margin: {
                            ...timeSeriesLayout.margin,
                            r: val,
                          },
                        })
                      }}
                      defaultValue={timeSeriesLayout.margin.r}
                    >
                      <Chakra.SliderMark
                        value={timeSeriesLayout.margin.r}
                        textAlign="center"
                        bg="blue.500"
                        color="white"
                        mt="-10"
                        ml="-5"
                        w="12"
                      >
                        {timeSeriesLayout.margin.r}
                      </Chakra.SliderMark>
                      <Chakra.SliderTrack bg="blue.100">
                        <Chakra.SliderFilledTrack bg="#00a0e9" />
                      </Chakra.SliderTrack>
                      <Chakra.SliderThumb boxSize={6}>
                        <Chakra.Box color="brand" as={ReactIcon.MdGraphicEq} />
                      </Chakra.SliderThumb>
                    </Chakra.Slider>
                  </div>
                  <div>
                    <MarginTitle>Margin Bottom</MarginTitle>
                    <Chakra.Slider
                      aria-label="slider-ex-4"
                      min={0}
                      max={300}
                      onChange={(val) =>
                        setTimeSeriesLayout({
                          ...timeSeriesLayout,
                          margin: {
                            ...timeSeriesLayout.margin,
                            b: val,
                          },
                        })
                      }
                      defaultValue={timeSeriesLayout.margin.b}
                    >
                      <Chakra.SliderMark
                        value={timeSeriesLayout.margin.b}
                        textAlign="center"
                        bg="blue.500"
                        color="white"
                        mt="-10"
                        ml="-5"
                        w="12"
                      >
                        {timeSeriesLayout.margin.b}
                      </Chakra.SliderMark>
                      <Chakra.SliderTrack bg="blue.100">
                        <Chakra.SliderFilledTrack bg="#00a0e9" />
                      </Chakra.SliderTrack>
                      <Chakra.SliderThumb boxSize={6}>
                        <Chakra.Box color="brand" as={ReactIcon.MdGraphicEq} />
                      </Chakra.SliderThumb>
                    </Chakra.Slider>
                  </div>
                  <div>
                    <MarginTitle>Margin Left</MarginTitle>
                    <Chakra.Slider
                      aria-label="slider-ex-4"
                      min={0}
                      max={300}
                      onChange={(val) =>
                        setTimeSeriesLayout({
                          ...timeSeriesLayout,
                          margin: {
                            ...timeSeriesLayout.margin,
                            l: val,
                          },
                        })
                      }
                      defaultValue={timeSeriesLayout.margin.l}
                    >
                      <Chakra.SliderMark
                        value={timeSeriesLayout.margin.l}
                        textAlign="center"
                        bg="blue.500"
                        color="white"
                        mt="-10"
                        ml="-5"
                        w="12"
                      >
                        {timeSeriesLayout.margin.l}
                      </Chakra.SliderMark>
                      <Chakra.SliderTrack bg="blue.100">
                        <Chakra.SliderFilledTrack bg="#00a0e9" />
                      </Chakra.SliderTrack>
                      <Chakra.SliderThumb boxSize={6}>
                        <Chakra.Box color="brand" as={ReactIcon.MdGraphicEq} />
                      </Chakra.SliderThumb>
                    </Chakra.Slider>
                  </div>
                </Chakra.AccordionPanel>
              </Chakra.AccordionItem>

              {/* <Chakra.AccordionItem>
                <h2>
                  <Chakra.AccordionButton>
                    <Chakra.Box as="span" flex="1" textAlign="left">
                      <ReactIcon.MdLineWeight style={{ display: 'inline-block' }} />
                      <AccordionTitle>Line Width</AccordionTitle>
                    </Chakra.Box>
                    <Chakra.AccordionIcon />
                  </Chakra.AccordionButton>
                </h2>
                <Chakra.AccordionPanel pb={4}>
                  <Margin />
                  <Chakra.Slider
                    aria-label="slider-ex-4"
                    min={0}
                    max={50}
                    onChange={(val) => {
                      setTimeSeriesData({
                        ...timeSeriesData,
                        line: {
                          ...timeSeriesData.line,
                          width: val,
                        },
                      })
                    }}
                    defaultValue={timeSeriesData.line.width}
                  >
                    <Chakra.SliderMark
                      value={timeSeriesData.line.width}
                      textAlign="center"
                      bg="blue.500"
                      color="white"
                      mt="-10"
                      ml="-5"
                      w="12"
                    >
                      {timeSeriesData.line.width}
                    </Chakra.SliderMark>
                    <Chakra.SliderTrack bg="blue.100">
                      <Chakra.SliderFilledTrack bg="#00a0e9" />
                    </Chakra.SliderTrack>
                    <Chakra.SliderThumb boxSize={6}>
                      <Chakra.Box color="brand" as={ReactIcon.MdGraphicEq} />
                    </Chakra.SliderThumb>
                  </Chakra.Slider>
                </Chakra.AccordionPanel>
              </Chakra.AccordionItem> */}

              {/* <Chakra.AccordionItem>
                <h2>
                  <Chakra.AccordionButton>
                    <Chakra.Box as="span" flex="1" textAlign="left">
                      <ReactIcon.MdLineStyle style={{ display: 'inline-block' }} />
                      <AccordionTitle>Line Dash</AccordionTitle>
                    </Chakra.Box>
                    <Chakra.AccordionIcon />
                  </Chakra.AccordionButton>
                </h2>
                <Chakra.AccordionPanel pb={4}>
                  <Chakra.Select
                    icon={<ReactIcon.MdArrowDropDown />}
                    value={state.LINE_DASH}
                    variant="filled"
                    onChange={(e) => {
                      console.log(e.target.value)
                      dispatch({ type: 'LINE_DASH', data: e.target.value })
                    }}
                  >
                    <option value="solid">solid</option>
                    <option value="dot">dot</option>
                    <option value="dashdot">dashdot</option>
                    <option value="longdashdot">longdashdot</option>
                    <option value="dash">dash</option>
                    <option value="longdash">longdash</option>
                  </Chakra.Select>
                </Chakra.AccordionPanel>
              </Chakra.AccordionItem> */}

              {/* <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      <MdLabel style={{ display: 'inline-block' }} />
                      <AccordionTitle>Marker</AccordionTitle>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <div>Enable / Disable Marker Label</div>
                  <Switch
                    size="lg"
                    colorScheme="brand"
                    value={state.ENABLE_MARKER_LABEL}
                    onChange={() => {
                      dispatch({ type: 'ENABLE_MARKER_LABEL' })
                      dispatch({ type: 'ENABLE_SELECT_MARKER_LABEL_POSITION' })
                    }}
                  />
                </AccordionPanel>{' '}
                <AccordionPanel pb={4}>
                  <div>Marker Text Position</div>
                  <Select
                    icon={<MdArrowDropDown />}
                    variant="filled"
                    disabled={state.ENABLE_SELECT_MARKER_LABEL_POSITION}
                    // placeholder="Text & Position"
                    value={state.MAKER_LABEL_POSITION}
                    onChange={(e: any) => {
                      dispatch({ type: 'MARKER_LABEL_POSITION', data: e.target.value })
                    }}
                  >
                    <option value="auto">auto</option>
                    <option value="none">none</option>
                    <option value="top left">top left</option>
                    <option value="top center">top center</option>
                    <option value="top right">top right</option>
                    <option value="middle left">middle left</option>
                    <option value="middle center">middle center</option>
                    <option value="middle right">middle right</option>
                    <option value="bottom left">bottom left</option>
                    <option value="bottom center">bottom center</option>
                    <option value="bottom right">bottom right</option>
                  </Select>
                </AccordionPanel>
              </AccordionItem> */}

              <Chakra.AccordionItem>
                <h2>
                  <Chakra.AccordionButton>
                    <Chakra.Box as="span" flex="1" textAlign="left">
                      <ReactIcon.MdOutlineLegendToggle style={{ display: 'inline-block' }} />
                      <AccordionTitle>Legend</AccordionTitle>
                    </Chakra.Box>
                    <Chakra.AccordionIcon />
                  </Chakra.AccordionButton>
                </h2>
                <Chakra.AccordionPanel pb={4}>
                  <div>Enable / Disable Legend</div>
                  <Chakra.Switch
                    size="lg"
                    colorScheme="brand"
                    isChecked={timeSeriesLayout.showlegend}
                    onChange={(val: any) => {
                      setTimeSeriesLayout({
                        ...timeSeriesLayout,
                        showlegend: val,
                      })
                    }}
                  />
                </Chakra.AccordionPanel>
              </Chakra.AccordionItem>

              {/* <Chakra.AccordionItem>
                <h2>
                  <Chakra.AccordionButton>
                    <Chakra.Box as="span" flex="1" textAlign="left">
                      <ReactIcon.MdOutlineLineAxis style={{ display: 'inline-block' }} />
                      <AccordionTitle>Axis</AccordionTitle>
                    </Chakra.Box>
                    <Chakra.AccordionIcon />
                  </Chakra.AccordionButton>
                </h2>
                <Chakra.AccordionPanel pb={4}>
                  <AccordionTitle>Set X Axis Title.</AccordionTitle>
                  <Chakra.Input
                    value={state.AXIS_X_TITLE}
                    onChange={(e) => dispatch({ type: 'AXIS_X_TITLE', data: e.target.value })}
                  />
                  <AccordionTitle>Set Y Axis Title.</AccordionTitle>
                  <Chakra.Input
                    value={state.AXIS_Y_TITLE}
                    onChange={(e) => dispatch({ type: 'AXIS_Y_TITLE', data: e.target.value })}
                  />
                </Chakra.AccordionPanel>
              </Chakra.AccordionItem> */}
            </Chakra.Accordion>
          </Chakra.DrawerBody>

          <Chakra.DrawerFooter>
            <Chakra.Button
              variant="outline"
              mr={3}
              onClick={() => {
                setShowTimeSeriesDrawer(false)
              }}
            >
              Cancel
            </Chakra.Button>
            <Chakra.Button
              colorScheme="brand"
              onClick={() => {
                setShowTimeSeriesDrawer(false)
              }}
            >
              Save
            </Chakra.Button>
          </Chakra.DrawerFooter>
        </Chakra.DrawerContent>
      </Chakra.Drawer>
    </>
  )
}

export default TimeSeriesOption
