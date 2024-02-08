import styled from '@emotion/styled'
import React from 'react'

//https://javascript.plainenglish.io/build-a-progress-bar-with-react-js-48228ab53f57
//declare with interface to have the benefits of "extends" in the future...(sorry for my TMI)
interface ProgressbarProps {
  currentValue: number
  maxValue: number
  label?: string
}

const Progressbar = ({ currentValue, maxValue, label }: ProgressbarProps) => {
  return (
    <>
      <label htmlFor="progress-bar">{label}</label>
      <ProgressBar id="progress-bar" value={currentValue} max={maxValue} data-label={currentValue + ' %'}>
        {currentValue}%
      </ProgressBar>
    </>
  )
}

export default Progressbar

const ProgressBar = styled.progress`
  position: relative;
  appearance: none;
  height: 18px;
  border-radius: 18px;
  color: #4338f7;
  opacity: 1;

  :before {
    content: attr(data-label);
    font-size: 0.8em;
    color: #4338f7;
    font-family: 'Noto Sans';
    font-weight: bold;
    vertical-align: 0;
    position: absolute;
    left: 1em;
    right: 0;
  }

  /* Chrome and Safari */
  &::-webkit-progress-bar {
    background: transparent;
    border: 1px solid #4338f7;
    border-radius: 100px;
  }

  &::-webkit-progress-value {
    background: linear-gradient(90deg, #4338f724, #4338f79a);
    border-radius: 18px;
    transition: width 1s;
    // margin: 1px;
    // border-top-left-radius: 100px;
    // border-bottom-left-radius: 100px;
  }

  /* Firefox */
  &::-moz-progress-bar {
    background-color: linear-gradient(90deg, #4338f724, #4338f79a);
    border-radius: 18px;
    // border-top-left-radius: 100px;
    // border-bottom-left-radius: 100px;
  }
`
const ProgressDone = styled.span<{ value: any }>`
  opacity: 1;
`
