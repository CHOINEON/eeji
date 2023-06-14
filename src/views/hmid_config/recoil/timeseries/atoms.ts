/**
 * 2023-05-24 박윤희
 * recoil atoms state
 **/

// atoms.ts
import { atom } from 'recoil'
import { DTIME, LTIME } from './interface'
import { v1 } from 'uuid'

const selectorOptions: any = {
  buttons: [
    {
      step: 'second',
      stepmode: 'backward',
      count: 1,
      label: '1s',
    },
    {
      step: 'minute',
      stepmode: 'backward',
      count: 1,
      label: '1m',
    },
    {
      step: 'hour',
      stepmode: 'backward',
      count: 1,
      label: '1h',
    },
    {
      step: 'day',
      stepmode: 'backward',
      count: 1,
      label: '1d',
    },
    {
      step: 'month',
      stepmode: 'backward',
      count: 1,
      label: '6M',
    },
    {
      step: 'all',
    },
  ],
}

export const TimeSeriesChartLayoutOptionState = atom<LTIME>({
  key: `TimeSeriesLayoutOption/${v1()}`,
  default: {
    title: 'TimeSeries',
    margin: {
      l: 50,
      r: 50,
      b: 100,
      t: 100,
    },
    showlegend: true,
    xaxis: {
      rangeselector: selectorOptions,
      rangeslider: {},
      autorange: true,
    },
    yaxis: {
      autorange: true,
    },
  },
})

export const TimeSeriesChartDataOptionState = atom<DTIME>({
  key: `TimeSeriesDataOption/${v1()}`,
  default: {
    mode: 'lines',
    text: false,
    textposition: 'auto',
    // line: {
    //   shape: 'linear',
    //   width: 2,
    // },
    type: 'scatter',
  },
})

export const TimeSeriesDrawerState = atom({
  key: `TimeSeriesDrawer/${v1()}`,
  default: false,
})

export default {
  TimeSeriesChartLayoutOptionState,
  TimeSeriesChartDataOptionState,
  TimeSeriesDrawerState,
}
