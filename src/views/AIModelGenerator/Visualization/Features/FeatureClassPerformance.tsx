import { useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { useRecoilValue } from 'recoil'
import styled from 'styled-components'
import { lowChromaticColorChips } from 'views/AIModelGenerator/components/Chart/colors'
import { filteredResultState } from 'views/AIModelGenerator/store/response/atoms'

const FeatureClassPerformance = () => {
  const performanceData: any = useRecoilValue(filteredResultState('performance'))[0]

  interface PerformanceTable {
    [key: string | number]: { Accuracy: number }
  }

  //TODO : 컬러 랜덤으로 돌리기
  const randomColors = () => {
    return lowChromaticColorChips.slice(performanceData.length)
  }

  const [barData, setBarData] = useState({
    labels: Object.keys(performanceData),
    datasets: [
      {
        label: '정확도',
        data: Object.values(performanceData).map((item: PerformanceTable) => item.Accuracy),
        backgroundColor: lowChromaticColorChips.slice(performanceData.length), //Object.keys(performanceData).map(() => randomColors()),
        barThickness: 44,
        borderRadius: 5,
      },
    ],
  })

  const { maxKey, minKey } = Object.keys(performanceData).reduce(
    (acc, key) => {
      if (performanceData[key].Accuracy > performanceData[acc.maxKey].Accuracy) {
        acc.maxKey = key
      }
      if (performanceData[key].Accuracy < performanceData[acc.minKey].Accuracy) {
        acc.minKey = key
      }
      return acc
    },
    { maxKey: Object.keys(performanceData)[0], minKey: Object.keys(performanceData)[0] }
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
      {Object.keys(performanceData).length > 0 && (
        <ComponentContainer>
          <PerformanceTitle>모델 분석</PerformanceTitle>
          <PerformanceTitleWrap>
            <div>
              <AiIcon>AI</AiIcon>
              <SubTitle>
                {maxKey}에 대한 정확도가 가장 높고, {minKey}에 대한 정확도가 낮습니다.
              </SubTitle>
            </div>
          </PerformanceTitleWrap>
          <div>
            <Bar data={barData} options={barOptions} width={'100%'} height={'130px'} />
          </div>
        </ComponentContainer>
      )}
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
  margin-right: 10px;
`

const ComponentContainer = styled.div`
  margin: 5px;
  white-space: wrap;
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
