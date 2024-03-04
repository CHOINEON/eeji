import { Box } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { Button, Col, Row, Tag, Select, Card } from 'antd'
import Title from 'antd/es/typography/Title'
import axios from 'axios'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  Colors,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ScriptableContext,
} from 'chart.js'
import { ChartData } from 'chart.js'
import React, { MouseEventHandler, useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import AnalysisResult from './AnalysisResult'
import { customModelStore } from './store/analyze/atom'
import UploadPage from './UploadPage'
import HistorySidebar from 'components/sidebar/HistorySidebar'
import PDP_DynamicRenderChart from 'views/AIModelGenerator/components/Chart/PDP_Plot/PDP_DynamicRenderChart'

const XAIsimulator = () => {
  const analysisResult = useRecoilValue(customModelStore)
  const [options, setOptions] = useState(['Zhejiang', 'Jiangsu'])
  // useEffect(() => {
  //   console.log('result:', analysisResult.data)
  // }, [analysisResult])
  const [DataSet1, setDataSet1] = useState({
    datasets: [
      {
        label: 'Dataset 1',
        data: [
          0.5335981249809265, 0.7968889474868774, 1.3384120464324951, 2.4175448417663574, 4.557618618011475,
          8.800612449645996, 17.259397506713867, 34.15509033203125, 67.92066955566406, 135.4190216064453,
        ],
        borderColor: '#FF6384',
        backgroundColor: '#FFB1C1',
      },
    ],
    labels: [
      '[0.0]',
      '[11.11]',
      '[22.22]',
      '[33.33]',
      '[44.44]',
      '[55.56]',
      '[66.67]',
      '[77.78]',
      '[88.89]',
      '[100.0]',
    ],
  })
  const [DataSet2, setDataSet2] = useState({
    datasets: [
      {
        label: 'Dataset 2',
        data: [
          0.4988256096839905, 0.6118679046630859, 0.7849935293197632, 1.0999717712402344, 1.707023024559021,
          2.907533645629883, 5.292050361633301, 10.05984878540039, 19.594501495361328, 38.663185119628906,
        ],
        borderColor: '#36a2eb',
        backgroundColor: '#FFB1C1',
      },
    ],
    labels: [
      '[0.0]',
      '[11.11]',
      '[22.22]',
      '[33.33]',
      '[44.44]',
      '[55.56]',
      '[66.67]',
      '[77.78]',
      '[88.89]',
      '[100.0]',
    ],
  })

  const [DataSet3, setDataSet3] = useState({
    datasets: [
      {
        label: 'Dataset 3',
        data: [
          0.7170343995094299, 1.2933645248413086, 2.4239859580993652, 4.631820201873779, 8.962608337402344,
          17.553211212158203, 34.663360595703125, 68.83564758300781, 137.1204071044922, 273.6230163574219,
        ],
        borderColor: '#cc65fe',
        backgroundColor: '#FFB1C1',
      },
    ],
    labels: [
      '[0.0]',
      '[11.11]',
      '[22.22]',
      '[33.33]',
      '[44.44]',
      '[55.56]',
      '[66.67]',
      '[77.78]',
      '[88.89]',
      '[100.0]',
    ],
  })
  const [DataSet4, setDataSet4] = useState({
    datasets: [
      {
        label: 'Dataset 4',
        data: [
          0.43038254976272583, 0.5029453039169312, 0.7003320455551147, 1.1245694160461426, 1.9931961297988892,
          3.74906849861145, 7.255787372589111, 14.266334533691406, 28.287391662597656, 56.31697082519531,
        ],
        borderColor: '#ffce56',
        backgroundColor: '#FFB1C1',
      },
    ],
    labels: [
      '[0.0]',
      '[11.11]',
      '[22.22]',
      '[33.33]',
      '[44.44]',
      '[55.56]',
      '[66.67]',
      '[77.78]',
      '[88.89]',
      '[100.0]',
    ],
  })

  return (
    <>
      <Box
        style={{
          position: 'relative',
          zIndex: 1000,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ margin: '20px 0' }}>
          <Title> Partical Dependence Plot CO </Title>
          <div style={{ display: 'block' }}>
            <Select style={{ width: '20%' }} />
          </div>{' '}
        </div>
        {/* {analysisResult.data.length > 0 ? <AnalysisResult /> : <UploadPage />} */}
        <Card style={{ width: '100%' }}>
          <ChartWrapper>
            <Line data={DataSet1} />
          </ChartWrapper>
          <ChartWrapper>
            <Line data={DataSet2} />
          </ChartWrapper>
          <ChartWrapper>
            <Line data={DataSet3} />
          </ChartWrapper>
          <ChartWrapper>
            <Line data={DataSet4} />
          </ChartWrapper>
        </Card>
      </Box>
    </>
  )
}

export default XAIsimulator

const ChartWrapper = styled.div`
  // display: ${(props: any) => (props.toggle ? 'block' : 'none')};
  // border: 1px solid pink;
  width: 30%;
  height: 200px;
  // width: ${(props: any) => (props.isClassification === 1 ? '200px' : '100%')};
  // height: ${(props: any) => (props.isClassification === 1 ? '600px' : '100%')};
  position: relative;
  float: left;
  margin: 10px;
`
