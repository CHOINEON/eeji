import { Select, Card, Typography } from 'antd'
import styled from 'styled-components'
import React, { useEffect, useState } from 'react'
import { Chart as ChartJS } from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'
import { useMutation } from 'react-query'
import fetchChartData from '../../../apis/PriceForecastApi'
import { Line } from 'react-chartjs-2'
import { SubTitle, Title } from 'views/NewDataAnalysis/components/Title'

const { Text, Link } = Typography

ChartJS.register(annotationPlugin)

type OilDataType = {
  [index: string]: IDataTypes
}

type IDataTypes = {
  real_price: object
  pred_price: object
  prediction: object
}

const OilPriceChart = () => {
  const [selectedOption, setSelectedOption] = useState('brent')
  const [priceList, setPriceList] = useState([
    {
      key: 'brent',
      min: 400,
      max: 600,
      title: 'Brent Oil',
      unit: '($/b)',
      source: 'Bloomberg Brent Crude Subindex',
      subtext: '(Prediction update at about 08:15)',
      link: 'https://www.bloomberg.com/quote/BCOMCL:IND',
    },
    {
      key: 'wti',
      min: 80,
      max: 100,
      title: 'WTI Oil',
      unit: '($/b)',
      source: 'Bloomberg WTI Crude Oil Subindex',
      subtext: '(Prediction update at about 08:10)',
      link: 'https://www.bloomberg.com/quote/BCOMCOT:IND',
    },
    {
      key: 'henry',
      min: 0,
      max: 0.15,
      title: 'Henry Hub',
      unit: '(USD/MMBtu)',
      source: 'Bloomberg Natural Gas Subindex',
      subtext: '(Prediction update at about 08:20)',
      link: 'https://www.bloomberg.com/quote/BCOMNG:IND',
    },
  ])

  const options = [
    {
      label: '에너지',
      options: [
        { value: 'brent', label: 'Brent' },
        { value: 'wti', label: 'WTI' },
        { value: 'henry', label: 'Henry' },
        { value: '석탄', label: '석탄', disabled: true },
        { value: '휘발유', label: '휘발유', disabled: true },
        { value: '난방유', label: '난방유', disabled: true },
      ],
    },

    {
      label: '금속',
      options: [
        { value: '스크랩', label: '스크랩', disabled: true },
        { value: '철광석', label: '철광석', disabled: true },
        { value: '금', label: '금', disabled: true },
        { value: '은', label: '은', disabled: true },
        { value: '백금', label: '백금', disabled: true },
        { value: '구리', label: '구리', disabled: true },
      ],
    },
  ]

  const [chartData, setChartData] = useState({ datasets: [] })
  const [data, setData] = useState<OilDataType>()
  const { mutate: mutateChartData } = useMutation(fetchChartData, {
    onSuccess: (result: any) => {
      // console.log('mutate result:', result)
      formatChartData(result)
    },
    onError: (error) => {
      console.error('Error fetching chart data:', error)
      // Handle the error as needed
    },
  })

  useEffect(() => {
    mutateChartData()
  }, [])

  useEffect(() => {
    if (data) {
      const dataToRender = {
        datasets: [
          {
            label: `${selectedOption} price`,
            data: data[selectedOption]?.real_price,
            backgroundColor: ['rgb(87,220,49)'],
            borderColor: ['rgb(87,220,49)'],
            borderWidth: 1,
          },
          {
            label: `${selectedOption} price forecast`,
            data: data[selectedOption]?.pred_price,
            backgroundColor: ['rgb(67,56,247)'],
            borderColor: ['rgb(67,56,247)'],
            borderWidth: 1,
          },
          {
            label: 'prediction',
            data: data[selectedOption]?.prediction,
            borderWidth: 1,
            borderDash: [5],
            backgroundColor: ['rgba(74,64,245, 0.3)'],
            borderColor: ['rgb(67,56,247)'],
            fill: false,
          },
        ],
      }
      setChartData(dataToRender)
      // console.log('data for render:', dataForRender)
    }
  }, [data, selectedOption])

  const formatChartData = (data: any) => {
    const obj: any = {}
    const typeArr = Object.keys(data) //['wti', 'brent', 'henry']

    typeArr.map((key) => {
      obj[key] = formattingData(data[key])
    })
    setData(obj)

    function formattingData(data: any) {
      const dataObj: any = {}

      //실제 과거 값
      const realPrice: Array<any> = []
      data['index_hist'].map((_d: any, i: number) => {
        const value = { x: {}, y: {} }
        value.x = data['index_hist'][i]
        value.y = data['gt_hist'][i]

        realPrice.push(value)
      })

      //과거 예측 값
      const predPrice: Array<any> = []
      data['index_hist'].map((_d: any, i: number) => {
        const value = { x: {}, y: {} }
        value.x = data['index_hist'][i]
        value.y = data['pred_hist'][i]

        predPrice.push(value)
      })

      //미래 예측 값
      const prediction: Array<any> = []
      data['index_pred'].map((_d: any, i: number) => {
        const value = { x: {}, y: {} }
        value.x = data['index_pred'][i]
        value.y = data['predict'][i]

        prediction.push(value)
      })

      dataObj['real_price'] = realPrice
      dataObj['pred_price'] = predPrice
      dataObj['prediction'] = prediction

      return dataObj
    }
  }

  const handleSelect = (item: any) => {
    setSelectedOption(item)
    // //선택된 옵션에 따라 레이아웃 다시 그림
    // const lastDayOfHistoryData = data[item].index_hist.slice(-1)
    // setLayoutOnChart(item, lastDayOfHistoryData)
  }

  function getToday() {
    const date = new Date()
    const year = date.getFullYear()
    const month = ('0' + (date.getMonth() + 1)).slice(-2)
    const day = ('0' + (date.getDate() - 1)).slice(-2)
    const today = `${year}-${month}-${day}`

    return today
  }

  const lastDay = chartData.datasets.filter((x) => x.label === 'prediction')[0]?.data[0].x

  const annotation1 = {
    type: 'line' as const,
    borderDash: [2],
    borderColor: 'black',
    borderWidth: 2,
    click: function ({ chart, element }: any) {
      console.log('Line annotation clicked')
    },
    label: {
      backgroundColor: 'black',
      content: '',
      display: true,
    },
    scaleID: 'x',
    value: lastDay,
  }

  const chartOptions = {
    layout: {
      padding: 20,
      margin: 'auto',
    },
    responsive: true,
    plugins: {
      annotation: {
        annotations: {
          annotation1,
        },
      },
      // legend: {
      //   position: 'right' as const,
      // },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          // text: priceList[0].unit,
          padding: { top: 20, left: 0, right: 0, bottom: 0 },
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: selectedOption === 'henry' ? priceList[2].unit : priceList[0].unit,
          padding: { top: 30, left: 0, right: 30, bottom: 0 },
        },
      },
    },
  }

  return (
    <>
      <ComponentContainer
        style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <div className="my-[30px] ml-[30px] w-full h-[47px]">
          <Title>Commodity Index Forecasting </Title>
          <div style={{ display: 'block', float: 'left', width: '200px', margin: '8px 30px' }}>
            <StyledSelect
              style={{ width: 100, backgroundColor: '#fff', border: '1px solid #A3AFCF', borderRadius: '10px' }}
              defaultValue={options[0].options[0]}
              options={options}
              onSelect={handleSelect}
            />
          </div>
        </div>
        <div style={{ width: '75%', height: '80%' }}>
          <Line data={chartData} options={chartOptions} />
        </div>

        {/* <InnerContainer style={{ width: '20%', padding: '30px' }}>
          <div style={{ height: '80%' }}>
            <SubTitle>XAI</SubTitle>
          </div>
        </InnerContainer> */}
        <div style={{ display: 'block', float: 'right', width: '95%', textAlign: 'right', marginBottom: '30px' }}>
          <span>* 자료출처 : </span>
          <Link href={priceList.find((x) => x.key === selectedOption).link} target="_blank">
            {priceList.find((x) => x.key === selectedOption).source}
          </Link>
          <Text type="secondary"> {priceList.find((x) => x.key === selectedOption).subtext}</Text>
        </div>
      </ComponentContainer>
    </>
  )
}

export default OilPriceChart

const ComponentContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  background-color: #ffffff;
  height: 700px;
  box-shadow: 0px 0px 10px #5951db33;
  border: 1px solid #d5dcef;
  border-radius: 25px;
  opacity: 1;
`

const InnerContainer = styled.div`
  border: 1px solid red;
  display: block;
  float: left;
  width: 90%;
  height: 60%;
  background-color: #f6f8ff;
  border: 1px solid #a3afcf;
  border-radius: 10px;
  opacity: 1;
`

const StyledSelect = styled(Select)`
  border: 1px solid #d5dcef;
  border-radius: 10px;
  background: #fff;
`
const StyledDiv = styled.div`
  color: #002d65;
  margin-left: 10px;
  @font-face {
    font-family: 'Helvetica Neue';
    src: url('https://fonts.cdnfonts.com/css/helvetica-neue-9');
  }
  font-family: 'Helvetica Neue', sans-serif;
`
