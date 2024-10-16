import { ColorType, createChart } from 'lightweight-charts'
import { useEffect, useRef } from 'react'

export interface SeriesData {
  data: { time: string; value: number }[]
  lineColor?: string
}

export interface ChartProps {
  series: SeriesData[]
  colors?: {
    backgroundColor?: string
    textColor?: string
  }
}

const ChartComponent = (props: ChartProps) => {
  const { series, colors: { backgroundColor = 'white', textColor = 'black' } = {} } = props
  const chartContainerRef = useRef<HTMLDivElement | null>(null)
  const chartInstanceRef = useRef<any>(null) // To store the chart instance

  useEffect(() => {
    if (!chartContainerRef.current) return

    // Create chart instance
    const chart = createChart(chartContainerRef.current, {
      layout: {
        fontFamily: 'Helvetica Neue',
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
      },
      width: chartContainerRef.current.clientWidth,
      height: 300,
    })

    chartInstanceRef.current = chart // Store the chart instance for future use

    if (series && series.length > 0) {
      series.forEach((singleSeries) => {
        const { data, lineColor } = singleSeries

        if (Array.isArray(data) && data.length > 0) {
          const newSeries = chart.addAreaSeries({ lineColor })
          newSeries.setData(data)
        } else {
          console.warn('Invalid data for series:', singleSeries)
        }
      })
    }

    chart.timeScale().fitContent()

    const resizeObserver = new ResizeObserver(() => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth })
      }
    })

    resizeObserver.observe(chartContainerRef.current)

    return () => {
      resizeObserver.disconnect()
      chart.remove()
    }
  }, [series, backgroundColor, textColor])

  return <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }} />
}

export default ChartComponent
