import React from 'react'
import styled from '@emotion/styled'
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  useDisclosure,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Select,
  Input,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Switch,
} from '@chakra-ui/react'
import {
  MdArrowDropDown,
  MdSsidChart,
  MdTitle,
  MdMargin,
  MdGraphicEq,
  MdLineWeight,
  MdLineStyle,
  MdLabel,
  MdOutlineLegendToggle,
  MdOutlineLineAxis,
} from 'react-icons/md'
import reducer from '../reducer/reducer'
import initialState from '../reducer/initialState'

import type { LineChartProps } from '../interface/interface'

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

export const ChartOption: React.FC<LineChartProps> = (props: any) => {
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const { onClose } = useDisclosure()
  const [isOpen, setIsOpen] = React.useState<boolean>(false)
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

  React.useEffect(() => {
    setIsOpen(props.ShowDrawer)
  }, [props.ShowDrawer])

  React.useEffect(() => {
    props.ChartData({
      mode: state.LINE_MODE,
      //추후 속성 추가 예정
      //name: 'vh',
      text: state.ENABLE_MARKER_LABEL,
      textposition: state.MARKER_LABEL_POSITION,
      line: {
        shape: state.LINE_SHAPE,
        width: state.LINE_WIDTH,
        dash: state.LINE_DASH,
      },
      type: 'scatter',
    })
  }, [
    state.LINE_MODE,
    state.ENABLE_MARKER_LABEL,
    state.MARKER_LABEL_POSITION,
    state.LINE_SHAPE,
    state.LINE_WIDTH,
    state.LINE_DASH,
  ])

  React.useEffect(() => {
    props.ChartLayout({
      title: state.TITLE,
      margin: {
        l: state.MARGIN_LEFT,
        r: state.MARGIN_RIGHT,
        b: state.MARGIN_BOTTOM,
        t: state.MARGIN_TOP,
      },
      showlegend: state.ENABLE_LEGEND,
      xaxis: {
        title: state.AXIS_X_TITLE,
      },
      yaxis: {
        title: state.AXIS_Y_TITLE,
      },
    })
  }, [
    state.TITLE,
    state.MARGIN_LEFT,
    state.MARGIN_RIGHT,
    state.LINE_SHAPE,
    state.MARGIN_BOTTOM,
    state.MARGIN_TOP,
    state.ENABLE_LEGEND,
    state.AXIS_X_TITLE,
    state.AXIS_Y_TITLE,
  ])

  return (
    <>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={() => {
          setIsOpen(false)
          props.setShowDrawer(false)
        }}
        finalFocusRef={btnRef}
        size={'sm'}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>LineChart Option</DrawerHeader>

          <DrawerBody>
            <Accordion allowToggle>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      <MdSsidChart style={{ display: 'inline-block' }} />
                      <AccordionTitle>Line Mode</AccordionTitle>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Select
                    icon={<MdArrowDropDown />}
                    value={state.LINE_MODE}
                    variant="filled"
                    placeholder="Select Line Mode"
                    onChange={(e) => {
                      dispatch({ type: 'LINE_MODE', data: e.target.value })
                    }}
                  >
                    <option value="lines">lines</option>
                    <option value="markers">markers</option>
                    <option value="lines+markers">lines+markers</option>
                  </Select>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      <MdTitle style={{ display: 'inline-block' }} />
                      <AccordionTitle>Title</AccordionTitle>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Input
                    value={state.TITLE}
                    onChange={(e: any) => {
                      dispatch({ type: 'TITLE', data: e.target.value })
                    }}
                  />
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      <MdMargin style={{ display: 'inline-block' }} />
                      <AccordionTitle>Margin</AccordionTitle>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <div>
                    <MarginTitle>Margin Top</MarginTitle>
                    <Slider
                      aria-label="slider-ex-6"
                      defaultValue={state.MARGIN_TOP}
                      min={0}
                      max={300}
                      onChange={(val) => {
                        dispatch({ type: 'MARGIN_TOP', data: val })
                      }}
                    >
                      <SliderMark
                        value={state.MARGIN_TOP}
                        textAlign="center"
                        bg="blue.500"
                        color="white"
                        mt="-10"
                        ml="-5"
                        w="12"
                      >
                        {state.MARGIN_TOP}
                      </SliderMark>
                      <SliderTrack bg="blue.100">
                        <SliderFilledTrack bg="#00a0e9" />
                      </SliderTrack>
                      <SliderThumb boxSize={6}>
                        <Box color="brand" as={MdGraphicEq} />
                      </SliderThumb>
                    </Slider>
                  </div>
                  <div>
                    <MarginTitle>Margin Right</MarginTitle>
                    <Slider
                      aria-label="slider-ex-4"
                      min={0}
                      max={300}
                      onChange={(val) => {
                        dispatch({ type: 'MARGIN_RIGHT', data: val })
                      }}
                      defaultValue={state.MARGIN_RIGHT}
                    >
                      <SliderMark
                        value={state.MARGIN_RIGHT}
                        textAlign="center"
                        bg="blue.500"
                        color="white"
                        mt="-10"
                        ml="-5"
                        w="12"
                      >
                        {state.MARGIN_RIGHT}
                      </SliderMark>
                      <SliderTrack bg="blue.100">
                        <SliderFilledTrack bg="#00a0e9" />
                      </SliderTrack>
                      <SliderThumb boxSize={6}>
                        <Box color="brand" as={MdGraphicEq} />
                      </SliderThumb>
                    </Slider>
                  </div>
                  <div>
                    <MarginTitle>Margin Bottom</MarginTitle>
                    <Slider
                      aria-label="slider-ex-4"
                      min={0}
                      max={300}
                      onChange={(val) => dispatch({ type: 'MARGIN_BOTTOM', data: val })}
                      defaultValue={state.MARGIN_BOTTOM}
                    >
                      <SliderMark
                        value={state.MARGIN_BOTTOM}
                        textAlign="center"
                        bg="blue.500"
                        color="white"
                        mt="-10"
                        ml="-5"
                        w="12"
                      >
                        {state.MARGIN_BOTTOM}
                      </SliderMark>
                      <SliderTrack bg="blue.100">
                        <SliderFilledTrack bg="#00a0e9" />
                      </SliderTrack>
                      <SliderThumb boxSize={6}>
                        <Box color="brand" as={MdGraphicEq} />
                      </SliderThumb>
                    </Slider>
                  </div>
                  <div>
                    <MarginTitle>Margin Left</MarginTitle>
                    <Slider
                      aria-label="slider-ex-4"
                      min={0}
                      max={300}
                      onChange={(val) => dispatch({ type: 'MARGIN_LEFT', data: val })}
                      defaultValue={state.MARGIN_LEFT}
                    >
                      <SliderMark
                        value={state.MARGIN_LEFT}
                        textAlign="center"
                        bg="blue.500"
                        color="white"
                        mt="-10"
                        ml="-5"
                        w="12"
                      >
                        {state.MARGIN_LEFT}
                      </SliderMark>
                      <SliderTrack bg="blue.100">
                        <SliderFilledTrack bg="#00a0e9" />
                      </SliderTrack>
                      <SliderThumb boxSize={6}>
                        <Box color="brand" as={MdGraphicEq} />
                      </SliderThumb>
                    </Slider>
                  </div>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      <MdLineWeight style={{ display: 'inline-block' }} />
                      <AccordionTitle>Line Width</AccordionTitle>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Margin />
                  <Slider
                    aria-label="slider-ex-4"
                    min={0}
                    max={50}
                    onChange={(val) => {
                      dispatch({ type: 'LINE_WIDTH', data: val })
                    }}
                    defaultValue={state.LINE_WIDTH}
                  >
                    <SliderMark
                      value={state.LINE_WIDTH}
                      textAlign="center"
                      bg="blue.500"
                      color="white"
                      mt="-10"
                      ml="-5"
                      w="12"
                    >
                      {state.LINE_WIDTH}
                    </SliderMark>
                    <SliderTrack bg="blue.100">
                      <SliderFilledTrack bg="#00a0e9" />
                    </SliderTrack>
                    <SliderThumb boxSize={6}>
                      <Box color="brand" as={MdGraphicEq} />
                    </SliderThumb>
                  </Slider>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
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
                  </Select>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
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
              </AccordionItem>

              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      <MdOutlineLegendToggle style={{ display: 'inline-block' }} />
                      <AccordionTitle>Legend</AccordionTitle>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <div>Enable / Disable Legend</div>
                  <Switch
                    size="lg"
                    colorScheme="brand"
                    value={state.ENABLE_LEGEND}
                    onChange={(e) => {
                      dispatch({ type: 'ENABLE_LEGEND' })
                    }}
                  />
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      <MdOutlineLineAxis style={{ display: 'inline-block' }} />
                      <AccordionTitle>Axis</AccordionTitle>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <AccordionTitle>Set X Axis Title.</AccordionTitle>
                  <Input
                    value={state.AXIS_X_TITLE}
                    onChange={(e) => dispatch({ type: 'AXIS_X_TITLE', data: e.target.value })}
                  />
                  <AccordionTitle>Set Y Axis Title.</AccordionTitle>
                  <Input
                    value={state.AXIS_Y_TITLE}
                    onChange={(e) => dispatch({ type: 'AXIS_Y_TITLE', data: e.target.value })}
                  />
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </DrawerBody>

          <DrawerFooter>
            <Button
              variant="outline"
              mr={3}
              onClick={() => {
                setIsOpen(false)
                props.setShowDrawer(false)
              }}
            >
              Cancel
            </Button>
            <Button
              colorScheme="brand"
              onClick={() => {
                setIsOpen(false)
                props.setShowDrawer(false)
              }}
            >
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default ChartOption
