import React, { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { ChartData, Chart as ChartJS, ChartOptions, Legend } from 'chart.js'
import { colorsForStackedBarChart as STACKED_BAR_CHART_COLORS } from 'views/AIModelGenerator/components/Chart/colors'
import ChartDataLabels from 'chartjs-plugin-datalabels'

ChartJS.register(Legend, ChartDataLabels)

const getOrCreateTooltip = (chart: any) => {
  let tooltipEl = chart.canvas.parentNode.querySelector('div')

  if (!tooltipEl) {
    tooltipEl = document.createElement('div')
    tooltipEl.style.background = 'rgba(0, 0, 0, 0.7)'
    tooltipEl.style.borderRadius = '3px'
    tooltipEl.style.color = 'white'
    tooltipEl.style.opacity = 1
    tooltipEl.style.pointerEvents = 'none'
    tooltipEl.style.position = 'absolute'
    tooltipEl.style.transform = 'translate(-50%, 0)'
    tooltipEl.style.transition = 'all .1s ease'

    const table = document.createElement('table')
    table.style.margin = '0px'

    tooltipEl.appendChild(table)
    chart.canvas.parentNode.appendChild(tooltipEl)
  }

  return tooltipEl
}

const externalTooltipHandler = (context: any) => {
  // Tooltip Element
  const { chart, tooltip } = context
  const tooltipEl = getOrCreateTooltip(chart)

  // Hide if no tooltip
  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = 0
    return
  }

  // Set Text
  if (tooltip.body) {
    const titleLines = tooltip.title || []
    const bodyLines = tooltip.body.map((b: any) => b.lines)

    const tableHead = document.createElement('thead')

    titleLines.forEach((title: string) => {
      const tr = document.createElement('tr')
      // tr.style.borderWidth = 0

      const th = document.createElement('th')
      // th.style.borderWidth = 0
      const text = document.createTextNode(title)

      th.appendChild(text)
      tr.appendChild(th)
      tableHead.appendChild(tr)
    })

    const tableBody = document.createElement('tbody')
    bodyLines.forEach((body: any, i: number) => {
      const colors = tooltip.labelColors[i]

      const span = document.createElement('span')
      span.style.background = colors.backgroundColor
      span.style.borderColor = colors.borderColor
      span.style.borderWidth = '2px'
      span.style.marginRight = '10px'
      span.style.height = '10px'
      span.style.width = '10px'
      span.style.display = 'inline-block'

      const tr = document.createElement('tr')
      tr.style.backgroundColor = 'inherit'
      // tr.style.borderWidth = 0

      const td = document.createElement('td')
      // td.style.borderWidth = 0

      const text = document.createTextNode(body)

      td.appendChild(span)
      td.appendChild(text)
      tr.appendChild(td)
      tableBody.appendChild(tr)
    })

    const tableRoot = tooltipEl.querySelector('table')

    // Remove old children
    while (tableRoot.firstChild) {
      tableRoot.firstChild.remove()
    }

    // Add new children
    tableRoot.appendChild(tableHead)
    tableRoot.appendChild(tableBody)
  }

  const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas

  // Display, position, and set styles for font
  tooltipEl.style.opacity = 1
  tooltipEl.style.left = positionX + tooltip.caretX + 'px'
  tooltipEl.style.top = positionY + tooltip.caretY + 'px'
  tooltipEl.style.font = tooltip.options.bodyFont.string
  tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px'
}

// const footer = (tooltipItems: any) => {
//   let sum = 0

//   tooltipItems.forEach(function (tooltipItem: any) {
//     sum += tooltipItem.parsed.y
//   })
//   return 'Sum: ' + sum
// }

const options: ChartOptions<'bar'> = {
  // tooltip: {
  //       enabled: false,
  //       position: 'nearest',
  //       external: externalTooltipHandler
  //     }

  responsive: true,
  maintainAspectRatio: false, //will take up entire container
  indexAxis: 'y',
  plugins: {
    legend: {
      display: false,
    },
    datalabels: {
      formatter: (value, context) => {
        // console.log('context:', context)
        if (value > 0) return value.toFixed(1) + '%'
        else return ''
      },
      color: 'blue',
      labels: {
        title: {
          font: {
            // weight: 'bold',
          },
        },
        value: {
          color: '#FFFFFF',
        },
      },
    },
    tooltip: {
      enabled: false,
      position: 'average',
      external: externalTooltipHandler,
      // callbacks: {
      // footer: footer,
      // },
    },
  },
  scales: {
    x: { stacked: true, display: false, min: 0, max: 100 },
    y: { stacked: true, display: false },
  },
}

interface IDataset {
  label: string
  data: Array<any>
  backgroundColor: string
}

interface IStackedBarChart {
  value: any
  weight: Array<any>
  columns: Array<any>
}

const HorizontalStackedBarChart = (props: IStackedBarChart) => {
  // console.log('HorizontalStackedBarChart props:', props)
  const { weight, columns } = props
  const [chartData, setChartData] = useState<ChartData<'bar'>>({
    datasets: [],
  })

  useEffect(() => {
    // console.log('columns:', columns)
    // console.log('weight:', weight)

    const newArr: Array<IDataset> = []

    //datasets 안에 들어갈 내용
    columns.forEach((col: Array<any>, i: number) => {
      const totalLocalValue: number = Object.values(weight).reduce((sum: number, value: number) => {
        return (sum + value) as number
      }, 0)
      // console.log('total:', totalLocalValue)
      // console.log('weight[i]:', weight[i])

      newArr.push({
        label: columns[i],
        data: [(weight[i] / totalLocalValue) * 100],
        backgroundColor: STACKED_BAR_CHART_COLORS[i],
      })
    })
    // console.log('newArr: ', newArr)

    setChartData({
      labels: [''],
      datasets: newArr,
    })
  }, [props])

  // const data = {
  //   labels: [''],
  //   datasets: [
  //     { label: 'a', data: [42], backgroundColor: '#4169e1' },
  //     { label: 'b', data: [83], backgroundColor: '#87ceeb' },
  //     { label: 'c', data: [31], backgroundColor: '#b0e0e6' },
  //   ],
  // }

  return (
    <div style={{ height: '100%' }}>
      <Bar options={options} data={chartData} height={50} />
    </div>
  )
}

export default HorizontalStackedBarChart
