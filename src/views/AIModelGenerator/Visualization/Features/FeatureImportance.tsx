import { ArcElement, CategoryScale, Chart, LinearScale, registerables, Tooltip, TooltipItem } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import zoomPlugin from 'chartjs-plugin-zoom'
import { useEffect, useState } from 'react'
import { Bar, Doughnut } from 'react-chartjs-2'
import { styled } from 'styled-components'

Chart.register(ArcElement, CategoryScale, LinearScale, ChartDataLabels, zoomPlugin, Tooltip, ...registerables)

// Function to generate random color code
const generateDistinctColor = (index: number, total: number): string => {
  const hue = Math.floor((index / total) * 360) // Evenly distribute hue values
  const saturation = 65 + Math.random() * 10 // Saturation between 70% and 80%
  const lightness = 50 + Math.random() * 10 // Lightness between 50% and 60%

  return `hsl(${hue}, ${saturation}%, ${lightness}%)` // Return HSL color as a string
}

// Function to generate an array of distinct colors based on the length of the input data
const generateColorArray = (length: number): string[] => {
  const randomColors = Array.from({ length: length - 1 }, (_, index) => generateDistinctColor(index, length))
  randomColors.push('#D5DCEF') // Add #D5DCEF as the last color
  return randomColors
}

export const shuffleArray = (array: string[]) => {
  // Create a shallow copy of the array to prevent modifying the original array
  const newArray = [...array]
  let currentIndex = newArray.length,
    randomIndex

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // Swap it with the current element.
    ;[newArray[currentIndex], newArray[randomIndex]] = [newArray[randomIndex], newArray[currentIndex]]
  }

  return newArray // Return the shuffled copy
}

const FeatureImportance = ({ data, colors }: any) => {
  const [colorChips, setColorChips] = useState([])

  useEffect(() => {
    if (colors) {
      const colorOrder = data?.labels?.map((el: string) => data?.all_input_x?.indexOf(el))

      const newColor: Array<any> = []
      colorOrder?.map((el: number) => {
        if (el === -1) newColor.push('#9E9E9E')
        else newColor.push(shuffleArray(colors)[el])
      })
      setColorChips(newColor)
    } else {
      setColorChips(generateColorArray(data?.labels?.length))
    }
  }, [data])

  const doughnutData = {
    labels: data?.labels,
    datasets: [
      {
        label: '',
        data: data?.values?.map((val: any) => (val * 100).toFixed(1)),
        backgroundColor: colorChips,
      },
    ],
  }

  const barData = {
    labels: data?.labels,
    datasets: [
      {
        label: '',
        data: data?.values?.map((val: any) => (val * 100).toFixed(1)),
        backgroundColor: colorChips,
        barThickness: 18,
        borderColor: data?.labels?.map(() => '#F6F8FF'),
      },
    ],
  }

  ///bar
  const barOptions = {
    maintainAspectRatio: false, //to obey the custom size
    indexAxis: 'y' as const,
    elements: {
      bar: {
        borderWidth: 1,
      },
    },
    responsive: true,
    plugins: {
      datalabels: {
        display: false,
      },
      legend: {
        display: false,
      },
      title: {
        display: false,
        text: 'TOP 3 Features',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: TooltipItem<'bar'>) => {
            const value = tooltipItem.raw // Use raw value from the tooltip item
            return value + '%' // Append % to the value
          },
        },
      },
    },
    scales: {
      // to remove the labels
      x: {
        ticks: {
          display: false,
        },

        // to remove the x-axis grid
        grid: {
          drawBorder: true,
          display: false,
        },
      },
      // to remove the y-axis labels
      y: {
        ticks: {
          display: true,
          beginAtZero: true,
        },
        // to remove the y-axis grid
        grid: {
          drawBorder: false,
          display: false,
        },
      },
    },
    options: {
      tooltips: {
        callbacks: {
          label: (tooltipItem: TooltipItem<'bar'>) => {
            console.log(tooltipItem)
            const value = tooltipItem.raw // The Y value of the tooltip
            return value + '%' // Append % to the value
          },
        },
      },
    },
  }

  const doughnutOptions = {
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      datalabels: {
        display: false,
        backgroundColor: '#ccc',
        borderRadius: 3,
      },
      legend: {
        display: false,
      },
      title: {
        display: false,
        text: 'TOP 3 Features',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: TooltipItem<'doughnut'>) => {
            const value = tooltipItem.raw // Use raw value from the tooltip item
            return value + '%' // Append % to the value
          },
        },
      },
    },
  }

  return (
    // <div style={{ width: '100%' }}>
    //   <div className="inline-block float-left" style={{ marginLeft: '20px', width: '59%', height: '200px !important' }}>
    //     <Bar data={barData} options={barOptions} width={'100%'} height={'200px'} />
    //   </div>

    //   <div className="inline-block float-left" style={{ width: '30%', marginTop: '20px' }}>
    //     <Doughnut data={doughnutData} options={doughnutOptions} />
    //   </div>
    // </div>
    <div className="w-full flex justify-between">
      <div className="w-[59%] h-[200px]">
        <Bar data={barData} options={barOptions} width={'100%'} height={'200px'} />
      </div>
      <div className="w-[30%] mt-[20px]">
        <Doughnut data={doughnutData} options={doughnutOptions} />
      </div>
    </div>
  )
}

export default FeatureImportance

interface Container {
  width?: any
  height?: any
  minHeight?: any
  position?: string
}

const Container = styled.div`
  width: 100%;
  height: 35vw;
  margin-top: 2vw;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
`

const RoundedBox = styled.div<Container>`
  margin-right: 0.5vw;
  background-color: #fff;
  box-shadow: 0px 5px 10px #4338f733;
  border-radius: 20px;
  padding: 2vw;
  width: ${(props) => (props.width ? props.width : 'auto')};
  height: ${(props) => (props.height ? props.height : 'auto')};
  min-height: ${(props) => (props.minHeight ? props.minHeight : 'auto')};
  position: ${(props) => (props.position ? props.position : 'relative')};
`
