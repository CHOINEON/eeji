/**
 * 2023-05-22 박윤희
 * recoil selector
 **/

import { TimeSeriesChartLayoutOptionState, TimeSeriesChartDataOptionState, TimeSeriesDrawerState } from './atoms'

import { selector } from 'recoil'
import * as inter from './interface'

export const TimeSeriesChartDataOptionSelector = selector<inter.DTIME>({
  key: 'TimeSeriesChartDataOptionSelector',
  get: ({ get }) => {
    const result = get(TimeSeriesChartDataOptionState)
    return result
  },
  set: ({ get, set }, newValue: inter.DTIME | any) => {
    const defaultResult: inter.DTIME = get(TimeSeriesChartDataOptionState)
    const newResult: inter.DTIME = {
      mode: (newValue as inter.DTIME).mode || defaultResult.mode,
      text: (newValue as inter.DTIME).text || defaultResult.text,
      textposition: (newValue as inter.DTIME).textposition || defaultResult.textposition,
      // line: {
      //   shape: (newValue as inter.DTIME).line.shape || defaultResult.line.shape,
      //   width: (newValue as inter.DTIME).line.width || defaultResult.line.width,
      // },
      type: 'scatter',
    }
    set(TimeSeriesChartDataOptionState, newResult)
  },
})

export const TimeSeriesChartLayoutOptionSelector = selector<inter.LTIME>({
  key: 'TimeSeriesChartLayoutOptionSelector',
  get: ({ get }) => {
    TimeSeriesChartLayoutOptionSelector
    const result = get(TimeSeriesChartLayoutOptionState)
    return result
  },
  set: ({ get, set }, newValue: inter.LTIME | any) => {
    const defaultResult: inter.LTIME = get(TimeSeriesChartLayoutOptionState)
    const newResult: inter.LTIME = {
      title: (newValue as inter.LTIME).title || defaultResult.title,
      margin: {
        l: (newValue as inter.LTIME).margin.l || defaultResult.margin.l,
        r: (newValue as inter.LTIME).margin.r || defaultResult.margin.r,
        b: (newValue as inter.LTIME).margin.b || defaultResult.margin.b,
        t: (newValue as inter.LTIME).margin.t || defaultResult.margin.t,
      },
      showlegend: (newValue as inter.LTIME).showlegend || defaultResult.showlegend,
      xaxis: {
        rangeselector: (newValue as inter.LTIME).xaxis.rangeselector || defaultResult.xaxis.rangeselector,
        rangeslider: (newValue as inter.LTIME).xaxis.rangeslider || defaultResult.xaxis.rangeslider,
        autorange: (newValue as inter.LTIME).xaxis.autorange || defaultResult.xaxis.autorange,
      },
      yaxis: {
        autorange: (newValue as inter.LTIME).yaxis.autorange || defaultResult.yaxis.autorange,
      },
    }
    set(TimeSeriesChartLayoutOptionState, newResult)
  },
})

export const TimeSeriesDrawerSelector = selector({
  key: 'LineDrawerSelector',
  get: ({ get }) => get(TimeSeriesDrawerState),
  set: ({ set }, newValue) => set(TimeSeriesDrawerState, newValue),
})
