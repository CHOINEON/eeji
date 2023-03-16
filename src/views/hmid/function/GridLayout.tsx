import React from 'react'
import layout_list from '../components/data/layout_list'
import { Grid, GridItem, useColorModeValue } from '@chakra-ui/react'
import WidgetModal from '../components/Modal/WidgetModal'
import LineChartComponent from '../components/Chart/Line/LineChartComponent'
import Plot from 'react-plotly.js'

interface GridInfoProps {
  gridInfo: string
}

export const GridLayoutBox: React.FC<GridInfoProps> = (props) => {
  //widget Modal
  const [isOpenWidgetModal, setIsOpenWidgetModal] = React.useState<boolean>(false)
  const [WidgetInfo, setWidgetInfo] = React.useState<string>('')

  const [appendChart, setAppendChart] = React.useState<boolean>(false)

  const [CursorGridItem, setCursorGridItem] = React.useState<string>('none')
  const [LayoutChildOption, setLayoutChildOption] = React.useState<any>()

  const [rows, setRows] = React.useState<string>()
  const [cols, setCols] = React.useState<string>()

  const [ItemColor, setItemColor] = React.useState('#0044620f')

  const [ChartLayoutOption, setChartLayoutOption] = React.useState<any>({
    yaxis: {
      title: 'K6 예열실 1단 온도(Cº)',
      titlefont: {
        family: 'Arial, sans-serif',
        size: 25,
        color: '#fff',
        type: 'lines',
      },
      line: {
        color: 'purple',
        width: 10,
      },

      tickfont: {
        color: '#fff',
        size: 22,
      },
    },
    plot_bgcolor: '#080808',
    paper_bgcolor: '#080808',
    autosize: true,
    title: 'K6 소성로',
    font: {
      size: 25,
      color: '#fff',
    },
  })
  const [ChartDataOption, setChartDataOption] = React.useState<any>([
    {
      x: [1, 2, 3, 4],
      y: [10, 15, 13, 17],
      mode: 'lines',
    },
    {
      x: [1, 2, 3, 4],
      y: [16, 5, 11, 9],
      mode: 'lines',
    },
  ])

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
    }
  }, [WidgetInfo])

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
    console.log(item)
    const node: any = document.getElementById(item.target.id)
    console.log(node)

    const data = <Plot data={ChartDataOption} layout={ChartLayoutOption} />
    // console.log(data)
    // console.log(data.type)
    // console.log(data.props)

    const element = React.createElement(data.type, { data: data.props.data, layout: data.props.layout })
    const element2 = React.createElement('h1', { className: 'greeting' }, 'Hello ')

    console.log('----------------------------------------------')
    console.log(element)
    node.appendChild(element2)
    // const test = mount(<div>Test !!!!</div>)
    // node.appendChild(test)
    // console.log(item.target.css)
    setIsOpenWidgetModal(true)
  }

  const getChartLayout = (props: any) => {
    console.log(props)
  }

  const getChartData = (props: any) => {
    console.log(props)
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

      <LineChartComponent ChartType={WidgetInfo} ChartLayout={getChartLayout} ChartData={getChartData} />
    </>
  )
}

export default GridLayoutBox
