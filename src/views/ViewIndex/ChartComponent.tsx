import { ColorType, createChart } from 'lightweight-charts'
import { useEffect, useRef } from 'react'

export interface SeriesData {
  data: { time: string; value: number }[]
  // colors?: {
  lineColor?: string
  //   areaTopColor?: string
  //   areaBottomColor?: string
  // }
}

export interface ChartProps {
  series: SeriesData[]
  colors?: {
    backgroundColor?: string
    textColor?: string
  }
}

const ChartComponent = (props: ChartProps) => {
  const { series, colors: { backgroundColor = 'black', textColor = 'white' } = {} } = props

  const chartContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth })
      }
    }

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
      },
      width: chartContainerRef.current.clientWidth,
      height: 300,
    })

    if (series && series.length > 0) {
      // Iterate over each series and add it to the chart
      series?.forEach((singleSeries) => {
        const { data, lineColor } = singleSeries

        // Check if data is defined and is an array
        if (Array.isArray(data) && data.length > 0) {
          const newSeries = chart.addAreaSeries({
            lineColor,
          })

          newSeries.setData(data)
        } else {
          console.warn('Invalid data for series:', singleSeries)
        }
      })
    }

    chart.timeScale().fitContent()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [series, backgroundColor, textColor])

  return <div ref={chartContainerRef} />
}

export default ChartComponent
