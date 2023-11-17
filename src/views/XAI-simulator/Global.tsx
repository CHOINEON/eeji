import React from 'react'
import styled from '@emotion/styled'
import Title from 'antd/es/typography/Title'
import InfoCircle from 'views/DataAnalysis/components/Icon/InfoCircle'
import Plot from 'react-plotly.js'

const Global = ({ data }: any) => {
  const config = { displaylogo: false, responsive: true, useResizeHandler: true }
  const trace1 = {
    x: ['giraffes', 'orangutans', 'monkeys'],
    y: [20, 14, 23],
    name: 'SF Zoo',
    type: 'bar',
  }

  const trace2 = {
    x: ['giraffes', 'orangutans', 'monkeys'],
    y: [12, 18, 29],
    name: 'LA Zoo',
    type: 'bar',
  }

  // const data: Array<any> = [trace1, trace2]

  const layout = { barmode: 'group' }

  return (
    <>
      <RoundedBox>
        {' '}
        <Title level={4} style={{ color: '#002D65', display: 'inline-block', width: '80%' }}>
          Global Attribution
          <InfoCircle content="각 feature가 전체 예측에 미치는 영향도" />
        </Title>
        <div>
          <Plot
            // config={config}
            layout={{
              width: 320,
              height: 250,
              title: '',
              barmode: 'group',
              margin: {
                l: 50,
                r: 50,
                b: 50,
                t: 50,
                pad: 5,
              },
            }}
            data={data}
          />
        </div>
      </RoundedBox>
    </>
  )
}

export default Global

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
