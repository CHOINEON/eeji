/**
 * INFINITE OPTIMAL
 * 메뉴 : HMI Designer - GridLayout
 * 시작 날짜 : 2023-03-16
 * 최종 수정 날짜 : 2023-03-17
 * 개발자 : 박윤희 (BAK YUN HEE)
 */

import React from 'react'
import layout_list from '../components/data/layout_list'
import { Grid, GridItem, useColorModeValue } from '@chakra-ui/react'
import WidgetModal from '../components/Modal/WidgetModal'
import LineChartComponent from '../components/Chart/Line/LineChartComponent'
import Plot from 'react-plotly.js'
import ReactDOM from 'react-dom'

interface GridInfoProps {
  gridInfo: string
}

export const GridLayoutBox: React.FC<GridInfoProps> = (props) => {
  //widget Modal
  const [isOpenWidgetModal, setIsOpenWidgetModal] = React.useState<boolean>(false)
  const [WidgetInfo, setWidgetInfo] = React.useState<string>('')

  const [appendChart, setAppendChart] = React.useState<boolean>(false)
  const [LayoutChildOption, setLayoutChildOption] = React.useState<any>()

  const [CursorGridItem, setCursorGridItem] = React.useState<string>('none')

  const [rows, setRows] = React.useState<string>()
  const [cols, setCols] = React.useState<string>()

  const [ItemColor, setItemColor] = React.useState('#0044620f')

  const [BoxId, setBoxId] = React.useState<any>()

  const [ChartLayoutOption, setChartLayoutOption] = React.useState<any>('')
  const [ChartDataOption, setChartDataOption] = React.useState<any>('')

  const theme = useColorModeValue('navy.700', 'white')

  React.useEffect(() => {
    if (theme === 'white') {
      setItemColor('#ffffff0f')
    } else {
      setItemColor('#0044620f')
    }
  }, [theme])

  React.useEffect(() => {
    console.log(WidgetInfo)
    if (WidgetInfo === 'Line') {
      if (BoxId !== undefined && BoxId.length !== 0) {
        if (ChartLayoutOption.length !== 0 && ChartDataOption.length !== 0) {
          const node: any = document.getElementById(BoxId)
          const config = {
            displaylogo: false,
          }

          const Layout: any = {
            ...ChartLayoutOption,
            width: node.clientWidth,
            height: node.clientHeight,
            plot_bgcolor: 'rgba(255,255,255,0)',
            paper_bgcolor: 'rgba(255,255,255,0)',
          }
          const data = <Plot data={ChartDataOption} layout={Layout} config={config} />
          const element = React.createElement(data.type, { data: data.props.data, layout: data.props.layout })
          ReactDOM.render(element, node)
        }
      }
    }
  }, [ChartLayoutOption, ChartDataOption, WidgetInfo, BoxId])

  React.useEffect(() => {
    let cols = 0
    let rows = 0

    if (props.gridInfo !== undefined) {
      if (Number(props.gridInfo.split('*')[0]) === 1) {
        rows = Number(props.gridInfo.split('*')[0]) + 1

        setRows('repeat(' + rows + ', 1fr)')
        setCols('repeat(' + props.gridInfo.split('*')[1] + ', 1fr)')
      } else if (Number(props.gridInfo.split('*')[1]) === 1) {
        cols = Number(props.gridInfo.split('*')[1]) + 1

        setRows('repeat(' + props.gridInfo.split('*')[0] + ', 1fr)')
        setCols('repeat(' + cols + ', 1fr)')
      } else {
        setRows('repeat(' + props.gridInfo.split('*')[0] + ', 1fr)')
        setCols('repeat(' + props.gridInfo.split('*')[1] + ', 1fr)')
      }
    }
  })

  const ClickItem = (item: any) => {
    setBoxId(item.target.id)

    setIsOpenWidgetModal(true)
  }

  const getChartLayout = (props: any) => {
    setChartLayoutOption(props)
  }

  const getChartData = (props: any) => {
    let ChartDataObj: any = {}
    const ChartDataArr: any = []

    const data = [
      {
        x: [1, 2, 3, 4, 5, 6, 7, 8],
        y: [10, 15, null, 17, 14, 12, 10, null, 15],
      },
      {
        x: [1, 2, 3, 4, 5, 6, 7, 8],
        y: [16, null, 13, 10, 8, null, 11, 12],
      },
    ]

    for (let i = 0, len = data.length; i < len; i++) {
      ChartDataObj = {
        ...props,
        x: data[i].x,
        y: data[i].y,
      }

      ChartDataArr.push(ChartDataObj)

      ChartDataObj = new Object()
    }

    setChartDataOption(ChartDataArr)
  }

  const render = () => {
    const arr: any = []

    if (props.gridInfo === 'reset' && props.gridInfo !== undefined) {
      return <div></div>
    } else if (props.gridInfo !== undefined) {
      const r = Number(props.gridInfo.split('*')[0])
      const c = Number(props.gridInfo.split('*')[1])

      for (let i = 0, len = Number(props.gridInfo.split('*')[0]) + Number(props.gridInfo.split('*')[1]); i < len; i++) {
        if (r === c) {
          arr.push(
            <GridItem
              key={i}
              id={i.toString()}
              bg={ItemColor}
              border={CursorGridItem}
              cursor={'pointer'}
              onClick={(e: any) => ClickItem(e)}
            ></GridItem>
          )
        } else {
          if (r > c) {
            if (i !== r) {
              arr.push(
                <GridItem
                  key={i}
                  id={i.toString()}
                  bg={ItemColor}
                  border={CursorGridItem}
                  cursor={'pointer'}
                  onClick={(e: any) => ClickItem(e)}
                ></GridItem>
              )
            } else {
              arr.push(
                <GridItem
                  key={i}
                  id={i.toString()}
                  bg={ItemColor}
                  border={CursorGridItem}
                  cursor={'pointer'}
                  colSpan={r}
                  onClick={(e: any) => ClickItem(e)}
                ></GridItem>
              )
            }
          } else {
            //row가 작은경우
            if (r === 1) {
              if (i === r - 1) {
                arr.push(
                  <GridItem
                    key={i}
                    id={i.toString()}
                    bg={ItemColor}
                    border={CursorGridItem}
                    cursor={'pointer'}
                    colSpan={c}
                    onClick={(e: any) => ClickItem(e)}
                  ></GridItem>
                )
              } else if (i <= c) {
                arr.push(
                  <GridItem
                    key={i}
                    id={i.toString()}
                    bg={ItemColor}
                    border={CursorGridItem}
                    cursor={'pointer'}
                    onClick={(e: any) => ClickItem(e)}
                  ></GridItem>
                )
              }
            }
          }
        }
      }
      return arr
    }
  }

  return (
    <>
      <WidgetModal
        WidgetModalisOpen={isOpenWidgetModal}
        setCloseWidgetModal={(isClose: boolean) => {
          if (isClose) {
            setIsOpenWidgetModal(false)
          }
        }}
        setWidgetInfo={(WidgetInfo: string) => {
          if (WidgetInfo !== undefined) {
            setWidgetInfo(WidgetInfo)
          }
        }}
      />
      <Grid h="40vw" pt={8} templateRows={rows} templateColumns={cols} gap={4}>
        {render()}
      </Grid>

      {/* <LineChartComponent ChartType={WidgetInfo} ChartLayout={getChartLayout} ChartData={getChartData} /> */}
    </>
  )
}

export default GridLayoutBox
