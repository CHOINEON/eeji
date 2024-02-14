import styled from '@emotion/styled'
import React from 'react'
import process_icon from 'assets/img/components/processing.svg'

interface ProgressbarProps {
  currentValue: number
  maxValue: number
  label?: string
}

const Progressbar = ({ currentValue, maxValue, label }: ProgressbarProps) => {
  // const barWidth = (currentValue / maxValue) * 100
  return (
    <>
      <label htmlFor="progress-bar">{label}</label>
      <ProgressBar id="progress-bar" value={currentValue} max={maxValue} data-label="Processing">
        {currentValue}%
      </ProgressBar>
      <Marker icon={process_icon} />
    </>
  )
}

export default Progressbar

const ProgressBar = styled.progress<{ value: number; max: number }>`
  position: relative;
  appearance: none;
  width: 100%;
  height: 21px;
  border-radius: 18px;
  color: #4338f7;
  opacity: 1;

  :before {
    // content: attr(data-label);
    content: attr(data-label);
    font-size: 0.8em;
    color: #4338f7;
    font-family: 'Noto Sans';
    font-weight: bold;
    vertical-align: 0;
    position: absolute;
    left: 1em;
    // right: 0em;
  }

  /* Chrome and Safari */
  &::-webkit-progress-bar {
    background: transparent;
    border: 1px solid #4338f7;
    border-radius: 100px;
    padding: 1px;
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

  /* Adding the process_icon */
  &::after {
    content: '';
    position: absolute;
    top: 1px;
    left: ${(props: any) => `${(props.value / props.max) * 100 - 10}%`};
    width: 30px; /* Adjust width and height as needed */
    height: 19px; /* Adjust width and height as needed */
    background-image: url(${process_icon});
    background-size: contain;
    background-repeat: no-repeat;
    border-radius: 50%;
  }
`

const Marker = styled.div<{ icon: any }>`
  position: absolute;
  left: 0;
  right: 8em;
  background-image: url(${(props: any) => props.icon});
  background-size: contain;
`
