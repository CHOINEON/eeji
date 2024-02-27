import styled from 'styled-components'
import PropsTypes from 'prop-types'

const YAxis = styled.text`
  transform: rotate(-90deg);
  text-anchor: middle;
  font-size: １rem;
`

const XAxis = styled.text`
  font-size: １rem;
`

function AxisLabel({ innerHeight, innerWidth, axisPadding, yLabel, xLabel, marginLeft }: any) {
  return (
    <g>
      <YAxis y={-axisPadding} x={-innerHeight / 2}>
        {yLabel}
      </YAxis>
      <XAxis y={innerHeight + axisPadding} x={innerWidth / 2 - marginLeft}>
        {xLabel}
      </XAxis>
    </g>
  )
}

AxisLabel.propTypes = {
  y: PropsTypes.number,
  yLabel: PropsTypes.string,
  xLabel: PropsTypes.string,
  axisPadding: PropsTypes.number,
  marginLeft: PropsTypes.number,
  innerHeight: PropsTypes.number,
  innerWidth: PropsTypes.number,
}

export default AxisLabel
