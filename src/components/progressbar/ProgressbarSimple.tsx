import styled from '@emotion/styled'
import React, { useEffect } from 'react'
import Progressbar from './Progressbar'

interface ProgressbarProps {
  currentValue: number
  maxValue: number
  label?: string
  loadingText?: string
  onCompleted?: () => void
}

const ProgressbarSimple = ({ currentValue, maxValue, label, onCompleted, loadingText }: ProgressbarProps) => {
  useEffect(() => {
    if (currentValue === 100) onCompleted()
  })

  return (
    <Wrapper>
      {' '}
      <TextContainer>{currentValue + ' %'}</TextContainer>
      <Progressbar currentValue={currentValue} maxValue={maxValue} label={label} />
      <DescTextContainer>{loadingText ? loadingText : '데이터를 분석 중입니다.'}</DescTextContainer>
    </Wrapper>
  )
}

export default ProgressbarSimple

const Wrapper = styled.div`
  // border: 1px solid red;
  padding: 20% 2%;
  width: 100%;
  text-align: center;
  display: block;
  float: left;
  height: 276px;
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
