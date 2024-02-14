import styled from '@emotion/styled'
import React from 'react'
import Progressbar from './Progressbar'

interface ProgressbarProps {
  currentValue: number
  maxValue: number
  label?: string
}

const ProgressbarSimple = ({ currentValue, maxValue, label }: ProgressbarProps) => {
  return (
    <Wrapper>
      {' '}
      <TextContainer>{currentValue + ' %'}</TextContainer>
      <Progressbar currentValue={currentValue} maxValue={maxValue} label={label} />
      <DescTextContainer>데이터를 분석중입니다.</DescTextContainer>
    </Wrapper>
  )
}

export default ProgressbarSimple

const Wrapper = styled.div`
  border: 1px solid red;
  padding: 1%;
  text-align: center;
`

const Text = styled.p`
  font-family: 'Helvetica Neue';
  font-size: 13px;
  color: #4338f7;
`

const TextContainer = styled(Text)`
  font-weight: bold;
  font-size: 35px;
  margin-bottom: 13px;
`

const DescTextContainer = styled(Text)`
  margin-top: 17px;
`
