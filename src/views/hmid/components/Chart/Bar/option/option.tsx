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
  MdLabel,
  MdOutlineLegendToggle,
  MdOutlineLineAxis,
} from 'react-icons/md'
import reducer from '../reducer/reducer'
import initialState from '../reducer/initialState'

import type { BarChartProps } from '../interface/interface'

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

export const ChartOption: React.FC<BarChartProps> = (props: any) => {
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const { onClose } = useDisclosure()
  const [isOpen, setIsOpen] = React.useState<boolean>(false)
  const btnRef = React.useRef()

  React.useEffect(() => {
    console.log('[  상위에서 받은 BarChart Props ] : ' + props.ShowBarDrawer)
    setIsOpen(props.ShowBarDrawer)
  }, [props.ShowBarDrawer])

  //처음에 미리 넘기기
  React.useEffect(() => {
    props.ChartLayout({
      type: 'Bar',
      title: state.TITLE,
      // plot_bgcolor: state.PLOT_BG_COLOR_TEXT,
      // paper_bgcolor: state.PAPER_BG_COLOR_TEXT,
      // autosize: true,
      bargap: state.BAR_GAP,
      barmode: state.BAR_MODE,
      //   width: state.WIDTH,
      //   height: state.HEIGHT,
      margin: {
        l: state.MARGIN_LEFT,
        r: state.MARGIN_RIGHT,
        b: state.MARGIN_BOTTOM,
        t: state.MARGIN_TOP,
      },
      showlegend: state.ENABLE_LEGEND,
      // legend: {
      //   x: state.TRANSLATE_X,
      //   xanchor: 'right',
      //   y: state.TRANSLATE_Y,
      //   orientation: state.LEGEND_ORIENTATION,
      //   traceorder: state.LEGEND_TRACEORDER,
      // },
      xaxis: {
        title: state.AXIS_X_TITLE,
        showgrid: state.ENABLE_GRIDX,
        autorange: true,
        autotick: true,
        // 추후 추가 예정
        zeroline: false,
        showline: true,
        //ticks: '',
        showticklabels: true,
      },
      yaxis: {
        title: state.AXIS_Y_TITLE,
        showgrid: state.ENABLE_GRIDY,
        autorange: true,
        autotick: true,
        // 추후 추가 예정
        zeroline: false,
        showline: true,
        //ticks: '',
        showticklabels: true,
      },
    })

    props.ChartData({
      type: 'bar',
      //추후 추가
      text: state.ENABLE_MARKER_LABEL,
      textposition: state.TEXT_POSITION,
    })
  }, [])

  React.useEffect(() => {
    props.ChartData({
      type: 'bar',
      //추후 추가
      text: state.ENABLE_MARKER_LABEL,
      textposition: state.TEXT_POSITION,
    })
  }, [state.ENABLE_TEXT_POSITION, state.TEXT_POSITION])

  React.useEffect(() => {
    props.ChartLayout({
      type: 'Bar',
      title: state.TITLE,
      // plot_bgcolor: state.PLOT_BG_COLOR_TEXT,
      // paper_bgcolor: state.PAPER_BG_COLOR_TEXT,
      // autosize: true,
      bargap: state.BAR_GAP,
      barmode: state.BAR_MODE,
      //   width: state.WIDTH,
      //   height: state.HEIGHT,
      margin: {
        l: state.MARGIN_LEFT,
        r: state.MARGIN_RIGHT,
        b: state.MARGIN_BOTTOM,
        t: state.MARGIN_TOP,
      },
      showlegend: state.ENABLE_LEGEND,
      // legend: {
      //   x: state.TRANSLATE_X,
      //   xanchor: 'right',
      //   y: state.TRANSLATE_Y,
      //   orientation: state.LEGEND_ORIENTATION,
      //   traceorder: state.LEGEND_TRACEORDER,
      // },
      xaxis: {
        title: state.AXIS_X_TITLE,
        showgrid: state.ENABLE_GRIDX,
        autorange: true,
        autotick: true,
        // 추후 추가 예정
        zeroline: false,
        showline: true,
        //ticks: '',
        showticklabels: true,
      },
      yaxis: {
        title: state.AXIS_Y_TITLE,
        showgrid: state.ENABLE_GRIDY,
        autorange: true,
        autotick: true,
        // 추후 추가 예정
        zeroline: false,
        showline: true,
        //ticks: '',
        showticklabels: true,
      },
    })
  }, [
    state.TITLE,
    state.BAR_GAP,
    state.BAR_MODE,
    state.MARGIN_LEFT,
    state.MARGIN_RIGHT,
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
          <DrawerHeader>BarChart Option</DrawerHeader>

          <DrawerBody>
            <Accordion allowToggle>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      <MdSsidChart style={{ display: 'inline-block' }} />
                      <AccordionTitle>Bar Mode</AccordionTitle>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Select
                    icon={<MdArrowDropDown />}
                    value={state.BAR_MODE}
                    variant="filled"
                    // placeholder="Select Bar Mode"
                    onChange={(e) => {
                      dispatch({ type: 'BAR_MODE', data: e.target.value })
                    }}
                  >
                    <option value="stack">stack</option>
                    <option value="group">group</option>
                    <option value="overlay">overlay</option>
                    <option value="relative">relative</option>
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
                      <AccordionTitle>Bar Gap</AccordionTitle>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Margin />
                  <Slider
                    aria-label="slider-ex-4"
                    min={0}
                    max={1}
                    step={0.01}
                    onChange={(val) => {
                      dispatch({ type: 'BAR_GAP', data: val })
                    }}
                    defaultValue={state.BAR_GAP}
                  >
                    <SliderMark
                      value={state.BAR_GAP}
                      textAlign="center"
                      bg="blue.500"
                      color="white"
                      mt="-10"
                      ml="-5"
                      w="12"
                    >
                      {state.BAR_GAP}
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
                    value={state.TEXT_POSITION}
                    onChange={(e: any) => {
                      dispatch({ type: 'TEXT_POSITION', data: e.target.value })
                    }}
                  >
                    <option value="auto">auto</option>
                    <option value="none">none</option>
                    <option value="outside">outside</option>
                    <option value="inside">inside</option>
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
                      dispatch({ type: 'ENABLE_LEGEND', data: e.target.value })
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
