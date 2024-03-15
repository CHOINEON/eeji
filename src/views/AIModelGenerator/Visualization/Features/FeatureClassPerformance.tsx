import React, { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
// import { Chart, ArcElement, CategoryScale, LinearScale, registerables, Tooltip } from 'chart.js'

import styled from 'styled-components'

const FeatureClassPerformance = (colors: any) => {
  interface PerformanceTable {
    [key: string]: { Accuracy: number }
  }
  const performanceTable: PerformanceTable = {
    '0': { Accuracy: 0.9696969696969697 },
    '1': { Accuracy: 1 },
    '2': { Accuracy: 0.8787878787878788 },
    '3': { Accuracy: 0.5 },
    '4': { Accuracy: 0.9629629629629629 },
    '5': { Accuracy: 0.9565217391304348 },
    '6': { Accuracy: 0.8620689655172413 },
  }

  const dynamicColors = () => {
    const r = Math.floor(Math.random() * 255)
    const g = Math.floor(Math.random() * 255)
    const b = Math.floor(Math.random() * 255)
    return 'rgba(' + r + ',' + g + ',' + b + ', 0.5)'
  }

  const [barData, setBarData] = useState({
    labels: Object.keys(performanceTable),
    datasets: [
      {
        label: '정확도',
        data: Object.values(performanceTable).map((item) => item.Accuracy),
        backgroundColor: Object.keys(performanceTable).map(() => dynamicColors()),
        barThickness: 44,
        borderRadius: 5,
      },
    ],
  })

  const { maxKey, minKey } = Object.keys(performanceTable).reduce(
    (acc, key) => {
      if (performanceTable[key].Accuracy > performanceTable[acc.maxKey].Accuracy) {
        acc.maxKey = key
      }
      if (performanceTable[key].Accuracy < performanceTable[acc.minKey].Accuracy) {
        acc.minKey = key
      }
      return acc
    },
    { maxKey: Object.keys(performanceTable)[0], minKey: Object.keys(performanceTable)[0] }
  )

  const barOptions = {
    maintainAspectRatio: false,

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
    },
    scales: {
      x: {
        grid: {
          drawBorder: false,
          display: false,
        },
      },
      // to remove the y-axis labels
      y: {
        // to remove the y-axis grid
        grid: {
          drawBorder: false,
          display: true,
          color: 'rgba(213, 220, 236, 0.5)',
        },
      },
    },
  }
  return (
    <>
      <ComponentContainer>
        <PerformanceTitle>모델 분석</PerformanceTitle>
        <PerformanceTitleWrap>
          <div>
            <PerformanceSubTitle>3 INEEJI Kim</PerformanceSubTitle>
            <AiIcon>AI</AiIcon>
            <SubTitle>
              {maxKey}에 대한 정확도가 가장 높고 {minKey}에 대한 정확도가 낮습니다.
            </SubTitle>
          </div>
          <PerformanceBox>{maxKey}</PerformanceBox>
        </PerformanceTitleWrap>
        <div>
          <Bar data={barData} options={barOptions} width={'100%'} height={'200px'} />
        </div>
      </ComponentContainer>
    </>
  )
}
export default FeatureClassPerformance

const SubTitle = styled.span`
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif';
  color: #002d65;
  font-weight: normal;
  font-size: 13px;
`
const PerformanceSubTitle = styled.p`
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif';
  color: #002d65;
  font-weight: bold;
  line-height: 1;
  margin: 12.5px 0;
  font-size: 17px;
`
const AiIcon = styled.span`
  background: #31d600 0% 0% no-repeat padding-box;
  border-radius: 5px;
  width: 18px;
  height: 18px;
  line-height: 18px;
  text-align: center;
  color: #fff;
  font-size: 11px;
  display: inline-block;
`
const PerformanceBox = styled.div`
  background: #ff3d50 0% 0% no-repeat padding-box;
  width: 36px;
  height: 36px;
  line-height: 36px;
  text-align: center;
  color: #fff;
  font-size: 14px;
  border-radius: 100%;
`
const ComponentContainer = styled.div`
  margin: 5px;
  padding: 20px 30px;
  box-shadow: 0px 0px 20px #0000001a;
  border: 1px solid #d5dcef;
  background-color: #ffffff;
  border-radius: 18px;
  color: #ffffff;
  font-size: 12px;
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif';
`
const PerformanceTitle = styled.p`
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif';
  color: #002d65;
  font-weight: bold;
  font-size: 20px;
`
const PerformanceTitleWrap = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 27px;
`
