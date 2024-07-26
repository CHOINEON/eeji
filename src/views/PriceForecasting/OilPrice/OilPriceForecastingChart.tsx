import { Select, Spin, Typography } from 'antd'
import { Chart as ChartJS } from 'chart.js'
import annotationPlugin, { AnnotationOptions } from 'chartjs-plugin-annotation'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import zoomPlugin from 'chartjs-plugin-zoom'
import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { useMutation } from 'react-query'
import styled from 'styled-components'
import { Title } from 'views/AIModelGenerator/components/Input/Text'
import fetchChartData from '../../../apis/PriceForecastApi'
const { Text, Link } = Typography

ChartJS.register(zoomPlugin, annotationPlugin, ChartDataLabels)

type DataType = {
  [key: string]: IDataTypes
}

type IDataTypes = {
  industry: Array<string>
  sector: Array<string>
  link: Array<string>
  gt_hist: Array<number>
  pred_hist: Array<number>
  index_hist: Array<string>
  predict: Array<number>
  index_pred: Array<string>
  currency: Array<string>
}

const OilPriceChart = () => {
  const [loading, setLoading] = useState(false)
  const [selectedOption, setSelectedOption] = useState('')
  const [chartData, setChartData] = useState({ datasets: [] })
  const [dataSource, setDataSource] = useState({}) //DB에서 받아온 데이터
  const [selectedData, setSelectedData] = useState<DataType>() //전체 지표 중 사용자가 선택한 데이터만 저장

  //TODO. 서버에서 보내주는 데이터에 맞게 자동으로 select option 생성하도록 코드 수정해야 함
  const selectOptions = [
    {
      label: 'energy',
      options: [
        { value: 'BCOMCL.INDX', label: 'Bloomberg WTI Crude Oil Subindex', disabled: false },
        { value: 'BCOMCO.INDX', label: 'Bloomberg Brent Crude Subindex', disabled: false },
        { value: 'BCOMNG.INDX', label: 'Bloomberg Natural Gas Subindex', disabled: false },
      ],
    },
    {
      label: 'metal',
      options: [
        { value: 'BCOMAL.INDX', label: 'Bloomberg Aluminum Subindex', disabled: false },
        { value: 'BCOMGC.INDX', label: 'Bloomberg Gold Subindex', disabled: false },
        { value: 'BCOMHG.INDX', label: 'Bloomberg Copper Subindex', disabled: false },
        { value: 'BCOMNI.INDX', label: 'Bloomberg Nickel Subindex', disabled: false },
        { value: 'BCOMZS.INDX', label: 'Bloomberg Zinc Subindex', disabled: false },
      ],
    },
  ]

  const { mutate: mutateChartData } = useMutation(fetchChartData, {
    onSuccess: (result: any) => {
      console.log('mutate result:', result)
      setLoading(false)
      setDataSource(result)
      // formatChartData(result)
    },
    onError: (error) => {
      console.error('Error fetching chart data:', error)
      // Handle the error as needed
    },
  })

  useEffect(() => {
    setLoading(true)
    mutateChartData()
    setSelectedOption('BCOMCL.INDX')
    // setDataSource(testData)
  }, [])

  useEffect(() => {
    //dataSource 필터링 하기 위해 array로 변환
    const asArray = Object.entries(dataSource)
    const filtered: any = asArray.filter((d: any) => d[0] === selectedOption)

    if (asArray.length > 0) {
      // const filteredArr = filtered[0][1]['link'][0]

      const newObj = {
        industry: filtered[0][1]['industry'][0],
        sector: filtered[0][1]['sector'][0],
        link: filtered[0][1]['link'][0],
        gt_hist: filtered[0][1]['gt_hist'],
        pred_hist: filtered[0][1]['pred_hist'],
        index_hist: filtered[0][1]['index_hist'],
        predict: filtered[0][1]['predict'],
        index_pred: filtered[0][1]['index_pred'],
        currency: filtered[0][1]['currency'][0],
      }
      setSelectedData(newObj)
      // setChartData(formattingData(newObj))
    }
  }, [dataSource, selectedOption])

  useEffect(() => {
    // console.log('selectedOption:', selectedOption)
    if (selectedData && selectedData) {
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
        // setLastDay(data.index_hist.slice(-1)[0])
        dataObj['lastDay'] = data.index_hist.slice(-1)[0]

        // console.log('dataObj::', dataObj)
        return dataObj
      }
      const reformattedData = formattingData(selectedData)
      // console.log('reformattedData:', reformattedData)

      const dataToRender = {
        datasets: [
          {
            label: `${selectedOption} price`,
            data: reformattedData?.real_price,
            backgroundColor: ['rgb(87,220,49)'],
            borderColor: ['rgb(87,220,49)'],
            borderWidth: 1,
          },
          {
            label: `${selectedOption} price forecast`,
            data: reformattedData?.pred_price,
            backgroundColor: ['rgb(67,56,247)'],
            borderColor: ['rgb(67,56,247)'],
            borderWidth: 1,
          },
          {
            label: 'prediction',
            data: reformattedData?.prediction,
            borderWidth: 1,
            borderDash: [5],
            backgroundColor: ['rgba(74,64,245, 0.3)'],
            borderColor: ['rgb(67,56,247)'],
            fill: false,
          },
        ],
      }

      setChartData(dataToRender)
    }
  }, [selectedOption, selectedData])

  const handleSelect = (item: any) => {
    setSelectedOption(item)
  }

  const lastDay = chartData.datasets.filter((x) => x.label === 'prediction')[0]?.data[0].x

  const annotation1: AnnotationOptions = {
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

  const chartOptions: any = {
    layout: {
      padding: 20,
      margin: 'auto',
    },
    responsive: true,
    plugins: {
      //왜 안되냐고....
      datalabels: {
        display: false,
      },
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
      mode: 'nearest', //as const,
      intersect: false,
      axis: 'x',
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          // text: 'x text',
          padding: { top: 20, left: 0, right: 0, bottom: 0 },
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: selectedData?.currency || 'USD',
          padding: { top: 30, left: 0, right: 30, bottom: 0 },
        },
      },
    },
  }

  return (
    <>
      <Spin tip="지표 데이터 로드 중..." spinning={loading} style={{ marginTop: '100px' }}>
        <ComponentContainer
          style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <div className="my-[30px] ml-[30px] w-full h-[47px]">
            <Title>Commodity Index Forecast</Title>
            <div style={{ display: 'block', float: 'left', width: '300px', margin: '8px 30px' }}>
              <Select
                style={{ backgroundColor: '#fff', border: '1px solid #A3AFCF', borderRadius: '10px' }}
                // defaultValue={options[0].options[0].value}
                value={selectedOption}
                options={selectOptions}
                onChange={handleSelect}
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
            <Link href={selectedData?.link.toString()} target="_blank">
              <Text type="secondary"> {selectedData?.link}</Text>
            </Link>
          </div>
        </ComponentContainer>
      </Spin>
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
