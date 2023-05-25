/**
 * 2023-05-22 박윤희
 * recoil selector
 **/

import { LineChartLayoutOptionState, LineChartDataOptionState, LineDrawerState } from './atoms'

import { selector } from 'recoil'
import * as inter from './interface'

export const LineChartDataOptionSelector = selector<inter.DLINE>({
  key: 'LineChartDataOptionSelector',
  get: ({ get }) => {
    const result = get(LineChartDataOptionState)
    return result
  },
  set: ({ get, set }, newValue: inter.DLINE | any) => {
    const defaultResult: inter.DLINE = get(LineChartDataOptionState)
    const newResult: inter.DLINE = {
      mode: (newValue as inter.DLINE).mode || defaultResult.mode,
      text: (newValue as inter.DLINE).text || defaultResult.text,
      textposition: (newValue as inter.DLINE).textposition || defaultResult.textposition,
      line: {
        shape: (newValue as inter.DLINE).line.shape || defaultResult.line.shape,
        width: (newValue as inter.DLINE).line.width || defaultResult.line.width,
      },
      type: 'scatter',
    }
    set(LineChartDataOptionState, newResult)
  },
})

export const LineChartLayoutOptionSelector = selector<inter.LLINE>({
  key: 'LineChartDataOptionSelector',
  get: ({ get }) => {
    const result = get(LineChartLayoutOptionState)
    return result
  },
  set: ({ get, set }, newValue: inter.LLINE | any) => {
    const defaultResult: inter.LLINE = get(LineChartLayoutOptionState)
    const newResult: inter.LLINE = {
      title: (newValue as inter.LLINE).title || defaultResult.title,
      margin: {
        l: (newValue as inter.LLINE).margin.l || defaultResult.margin.l,
        r: (newValue as inter.LLINE).margin.r || defaultResult.margin.r,
        b: (newValue as inter.LLINE).margin.b || defaultResult.margin.b,
        t: (newValue as inter.LLINE).margin.t || defaultResult.margin.t,
      },
      showlegend: (newValue as inter.LLINE).showlegend || defaultResult.showlegend,
      xaxis: {
        title: (newValue as inter.LLINE).xaxis.title || defaultResult.xaxis.title,
      },
      yaxis: {
        title: (newValue as inter.LLINE).yaxis.title || defaultResult.yaxis.title,
      },
    }
    set(LineChartLayoutOptionState, newResult)
  },
})

export const LineDrawerSelector = selector({
  key: 'LineDrawerSelector',
  get: ({ get }) => get(LineDrawerState),
  set: ({ set }, newValue) => set(LineDrawerState, newValue),
})
