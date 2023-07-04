import React from 'react'
import styled from '@emotion/styled'
import * as Chakra from '@chakra-ui/react'
import * as ReactIcons from 'react-icons/md'

import { useRecoilState } from 'recoil'
import * as LineAtoms from 'views/hmid_config/recoil/line_사용보류/atoms'

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

export const ChartOption: React.FC = () => {
  const [lineLayout, setLineLayout] = useRecoilState(LineAtoms.LineChartLayoutOptionState)
  const [lineData, setLineData] = useRecoilState(LineAtoms.LineChartDataOptionState)
  const [showLineDrawer, setShowLineDrawer] = useRecoilState(LineAtoms.LineDrawerState)
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
  //   setIsOpen(props.ShowDrawer)
  // }, [props.ShowDrawer])

  // React.useEffect(() => {
  //   props.ChartData({
  //     mode: lineData.LINE_MODE,
  //     //추후 속성 추가 예정
  //     //name: 'vh',
  //     text: lineData.ENABLE_MARKER_LABEL,
  //     textposition: lineData.MARKER_LABEL_POSITION,
  //     line: {
  //       shape: lineData.LINE_SHAPE,
  //       width: lineData.LINE_WIDTH,
  //       // dash: lineData.LINE_DASH,
  //     },
  //     type: 'scatter',
  //   })
  //   props.ChartLayout({
  //     title: lineData.TITLE,
  //     margin: {
  //       l: lineData.MARGIN_LEFT,
  //       r: lineData.MARGIN_RIGHT,
  //       b: lineData.MARGIN_BOTTOM,
  //       t: lineData.MARGIN_TOP,
  //     },
  //     showlegend: lineData.ENABLE_LEGEND,
  //     xaxis: {
  //       title: lineData.AXIS_X_TITLE,
  //     },
  //     yaxis: {
  //       title: lineData.AXIS_Y_TITLE,
  //     },
  //   })
  // }, [])

  // React.useEffect(() => {
  //   props.ChartData({
  //     mode: lineData.LINE_MODE,
  //     //추후 속성 추가 예정
  //     //name: 'vh',
  //     text: lineData.ENABLE_MARKER_LABEL,
  //     textposition: lineData.MARKER_LABEL_POSITION,
  //     line: {
  //       shape: lineData.LINE_SHAPE,
  //       width: lineData.LINE_WIDTH,
  //       // dash: lineData.LINE_DASH,
  //     },
  //     type: 'scatter',
  //   })
  // }, [
  //   lineData.LINE_MODE,
  //   lineData.ENABLE_MARKER_LABEL,
  //   lineData.MARKER_LABEL_POSITION,
  //   lineData.LINE_SHAPE,
  //   lineData.LINE_WIDTH,
  //   // lineData.LINE_DASH,
  // ])

  // React.useEffect(() => {
  //   props.ChartLayout({
  //     title: lineData.TITLE,
  //     margin: {
  //       l: lineData.MARGIN_LEFT,
  //       r: lineData.MARGIN_RIGHT,
  //       b: lineData.MARGIN_BOTTOM,
  //       t: lineData.MARGIN_TOP,
  //     },
  //     showlegend: lineData.ENABLE_LEGEND,
  //     xaxis: {
  //       title: lineData.AXIS_X_TITLE,
  //     },
  //     yaxis: {
  //       title: lineData.AXIS_Y_TITLE,
  //     },
  //   })
  // }, [
  //   lineData.TITLE,
  //   lineData.MARGIN_LEFT,
  //   lineData.MARGIN_RIGHT,
  //   lineData.LINE_SHAPE,
  //   lineData.MARGIN_BOTTOM,
  //   lineData.MARGIN_TOP,
  //   lineData.ENABLE_LEGEND,
  //   lineData.AXIS_X_TITLE,
  //   lineData.AXIS_Y_TITLE,
  // ])

  return (
    <>
      <Chakra.Drawer
        isOpen={showLineDrawer}
        placement="right"
        onClose={() => {
          setShowLineDrawer(false)
        }}
        finalFocusRef={btnRef}
        size={'sm'}
      >
        <Chakra.DrawerOverlay />
        <Chakra.DrawerContent>
          <Chakra.DrawerCloseButton />
          <Chakra.DrawerHeader>LineChart Option</Chakra.DrawerHeader>

          <Chakra.DrawerBody>
            <Chakra.Accordion allowToggle>
              <Chakra.AccordionItem>
                <h2>
                  <Chakra.AccordionButton>
                    <Chakra.Box as="span" flex="1" textAlign="left">
                      <ReactIcons.MdSsidChart style={{ display: 'inline-block' }} />
                      <AccordionTitle>Line Mode</AccordionTitle>
                    </Chakra.Box>
                    <Chakra.AccordionIcon />
                  </Chakra.AccordionButton>
                </h2>
                <Chakra.AccordionPanel pb={4}>
                  <Chakra.Select
                    icon={<ReactIcons.MdArrowDropDown />}
                    value={lineData.mode}
                    variant="filled"
                    placeholder="Select Line Mode"
                    onChange={(e) => {
                      setLineData({
                        ...lineData,
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
                      <ReactIcons.MdTitle style={{ display: 'inline-block' }} />
                      <AccordionTitle>Title</AccordionTitle>
                    </Chakra.Box>
                    <Chakra.AccordionIcon />
                  </Chakra.AccordionButton>
                </h2>
                <Chakra.AccordionPanel pb={4}>
                  <Chakra.Input
                    value={lineLayout.title}
                    onChange={(e: any) => {
                      setLineLayout({
                        ...lineLayout,
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
                      <ReactIcons.MdMargin style={{ display: 'inline-block' }} />
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
                      defaultValue={lineLayout.margin.t}
                      min={0}
                      max={300}
                      onChange={(val) => {
                        setLineLayout({
                          ...lineLayout,
                          margin: {
                            ...lineLayout.margin,
                            t: val,
                          },
                        })
                      }}
                    >
                      <Chakra.SliderMark
                        value={lineLayout.margin.t}
                        textAlign="center"
                        bg="blue.500"
                        color="white"
                        mt="-10"
                        ml="-5"
                        w="12"
                      >
                        {lineLayout.margin.t}
                      </Chakra.SliderMark>
                      <Chakra.SliderTrack bg="blue.100">
                        <Chakra.SliderFilledTrack bg="#00a0e9" />
                      </Chakra.SliderTrack>
                      <Chakra.SliderThumb boxSize={6}>
                        <Chakra.Box color="brand" as={ReactIcons.MdGraphicEq} />
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
                        setLineLayout({
                          ...lineLayout,
                          margin: {
                            ...lineLayout.margin,
                            r: val,
                          },
                        })
                      }}
                      defaultValue={lineLayout.margin.r}
                    >
                      <Chakra.SliderMark
                        value={lineLayout.margin.r}
                        textAlign="center"
                        bg="blue.500"
                        color="white"
                        mt="-10"
                        ml="-5"
                        w="12"
                      >
                        {lineLayout.margin.r}
                      </Chakra.SliderMark>
                      <Chakra.SliderTrack bg="blue.100">
                        <Chakra.SliderFilledTrack bg="#00a0e9" />
                      </Chakra.SliderTrack>
                      <Chakra.SliderThumb boxSize={6}>
                        <Chakra.Box color="brand" as={ReactIcons.MdGraphicEq} />
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
                        setLineLayout({
                          ...lineLayout,
                          margin: {
                            ...lineLayout.margin,
                            b: val,
                          },
                        })
                      }
                      defaultValue={lineLayout.margin.b}
                    >
                      <Chakra.SliderMark
                        value={lineLayout.margin.b}
                        textAlign="center"
                        bg="blue.500"
                        color="white"
                        mt="-10"
                        ml="-5"
                        w="12"
                      >
                        {lineLayout.margin.b}
                      </Chakra.SliderMark>
                      <Chakra.SliderTrack bg="blue.100">
                        <Chakra.SliderFilledTrack bg="#00a0e9" />
                      </Chakra.SliderTrack>
                      <Chakra.SliderThumb boxSize={6}>
                        <Chakra.Box color="brand" as={ReactIcons.MdGraphicEq} />
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
                        setLineLayout({
                          ...lineLayout,
                          margin: {
                            ...lineLayout.margin,
                            l: val,
                          },
                        })
                      }
                      defaultValue={lineLayout.margin.l}
                    >
                      <Chakra.SliderMark
                        value={lineLayout.margin.l}
                        textAlign="center"
                        bg="blue.500"
                        color="white"
                        mt="-10"
                        ml="-5"
                        w="12"
                      >
                        {lineLayout.margin.l}
                      </Chakra.SliderMark>
                      <Chakra.SliderTrack bg="blue.100">
                        <Chakra.SliderFilledTrack bg="#00a0e9" />
                      </Chakra.SliderTrack>
                      <Chakra.SliderThumb boxSize={6}>
                        <Chakra.Box color="brand" as={ReactIcons.MdGraphicEq} />
                      </Chakra.SliderThumb>
                    </Chakra.Slider>
                  </div>
                </Chakra.AccordionPanel>
              </Chakra.AccordionItem>

              <Chakra.AccordionItem>
                <h2>
                  <Chakra.AccordionButton>
                    <Chakra.Box as="span" flex="1" textAlign="left">
                      <ReactIcons.MdLineWeight style={{ display: 'inline-block' }} />
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
                      setLineData({
                        ...lineData,
                        line: {
                          ...lineData.line,
                          width: val,
                        },
                      })
                    }}
                    defaultValue={lineData.line.width}
                  >
                    <Chakra.SliderMark
                      value={lineData.line.width}
                      textAlign="center"
                      bg="blue.500"
                      color="white"
                      mt="-10"
                      ml="-5"
                      w="12"
                    >
                      {lineData.line.width}
                    </Chakra.SliderMark>
                    <Chakra.SliderTrack bg="blue.100">
                      <Chakra.SliderFilledTrack bg="#00a0e9" />
                    </Chakra.SliderTrack>
                    <Chakra.SliderThumb boxSize={6}>
                      <Chakra.Box color="brand" as={ReactIcons.MdGraphicEq} />
                    </Chakra.SliderThumb>
                  </Chakra.Slider>
                </Chakra.AccordionPanel>
              </Chakra.AccordionItem>

              {/* <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      <MdLineStyle style={{ display: 'inline-block' }} />
                      <AccordionTitle>Line Dash</AccordionTitle>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Select
                    icon={<MdArrowDropDown />}
                    value={lineData.LINE_DASH}
                    variant="filled"
                    onChange={(e) => {
                      console.log(e.target.value)
                      setLineData({
                        ...lineData,
                        
                      })
                    }}
                  >
                    <option value="solid">solid</option>
                    <option value="dot">dot</option>
                    <option value="dashdot">dashdot</option>
                    <option value="longdashdot">longdashdot</option>
                    <option value="dash">dash</option>
                    <option value="longdash">longdash</option>
                  </Select>
                </AccordionPanel>
              </AccordionItem> */}

              <Chakra.AccordionItem>
                <h2>
                  <Chakra.AccordionButton>
                    <Chakra.Box as="span" flex="1" textAlign="left">
                      <ReactIcons.MdLabel style={{ display: 'inline-block' }} />
                      <AccordionTitle>Marker</AccordionTitle>
                    </Chakra.Box>
                    <Chakra.AccordionIcon />
                  </Chakra.AccordionButton>
                </h2>
                <Chakra.AccordionPanel pb={4}>
                  <div>Enable / Disable Marker Label</div>
                  <Chakra.Switch
                    size="lg"
                    colorScheme="brand"
                    isChecked={lineData.text}
                    // value={lineData.ENABLE_MARKER_LABEL}
                    onChange={(val: any) => {
                      setLineData({
                        ...lineData,
                        text: val,
                      })
                    }}
                  />
                </Chakra.AccordionPanel>{' '}
                <Chakra.AccordionPanel pb={4}>
                  <div>Marker Text Position</div>
                  <Chakra.Select
                    icon={<ReactIcons.MdArrowDropDown />}
                    variant="filled"
                    // disabled={lineData.textposition}
                    // placeholder="Text & Position"
                    value={lineData.textposition}
                    onChange={(e: any) => {
                      setLineData({
                        ...lineData,
                        textposition: e.target.value,
                      })
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
                  </Chakra.Select>
                </Chakra.AccordionPanel>
              </Chakra.AccordionItem>

              <Chakra.AccordionItem>
                <h2>
                  <Chakra.AccordionButton>
                    <Chakra.Box as="span" flex="1" textAlign="left">
                      <ReactIcons.MdOutlineLegendToggle style={{ display: 'inline-block' }} />
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
                    isChecked={lineLayout.showlegend}
                    // value={lineData.ENABLE_LEGEND}
                    onChange={(val: any) => {
                      setLineLayout({
                        ...lineLayout,
                        showlegend: val,
                      })
                      // dispatch({ type: 'ENABLE_LEGEND' })
                    }}
                  />
                </Chakra.AccordionPanel>
              </Chakra.AccordionItem>

              <Chakra.AccordionItem>
                <h2>
                  <Chakra.AccordionButton>
                    <Chakra.Box as="span" flex="1" textAlign="left">
                      <ReactIcons.MdOutlineLineAxis style={{ display: 'inline-block' }} />
                      <AccordionTitle>Axis</AccordionTitle>
                    </Chakra.Box>
                    <Chakra.AccordionIcon />
                  </Chakra.AccordionButton>
                </h2>
                <Chakra.AccordionPanel pb={4}>
                  <AccordionTitle>Set X Axis Title.</AccordionTitle>
                  <Chakra.Input
                    value={lineLayout.xaxis.title}
                    onChange={(e) =>
                      setLineLayout({
                        ...lineLayout,
                        xaxis: {
                          ...lineLayout.xaxis,
                          title: e.target.value,
                        },
                      })
                    }
                  />
                  <AccordionTitle>Set Y Axis Title.</AccordionTitle>
                  <Chakra.Input
                    value={lineLayout.yaxis.title}
                    onChange={(e) =>
                      setLineLayout({
                        ...lineLayout,
                        yaxis: {
                          ...lineLayout.yaxis,
                          title: e.target.value,
                        },
                      })
                    }
                  />
                </Chakra.AccordionPanel>
              </Chakra.AccordionItem>
            </Chakra.Accordion>
          </Chakra.DrawerBody>

          <Chakra.DrawerFooter>
            <Chakra.Button
              variant="outline"
              mr={3}
              onClick={() => {
                setShowLineDrawer(false)
              }}
            >
              Cancel
            </Chakra.Button>
            <Chakra.Button
              colorScheme="brand"
              onClick={() => {
                setShowLineDrawer(false)
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

export default ChartOption
