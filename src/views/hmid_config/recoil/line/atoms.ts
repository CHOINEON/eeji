/**
 * 2023-05-17 박윤희
 * recoil atoms state
 **/

// atoms.ts
import { atom } from 'recoil'
import { DLINE, LLINE } from './interface'
import { v1 } from 'uuid'

export const LineChartLayoutOptionState = atom<LLINE>({
  key: `LineLayoutOption/${v1()}`,
  default: {
    title: 'Line',
    margin: {
      l: 100,
      r: 100,
      b: 126,
      t: 100,
    },
    showlegend: true,
    xaxis: {
      title: 'X axis title',
    },
    yaxis: {
      title: 'Y axis title',
    },
  },
})

export const LineChartDataOptionState = atom<any>({
  key: `LineDataOption/${v1()}`,
  default: {
    mode: 'lines+markers',
    text: false,
    textposition: 'auto',
    line: {
      shape: 'linear',
      width: 2,
    },
    type: 'scatter',
  },
})

export const LineDrawerState = atom({
  key: `LineDrawer/${v1()}`,
  default: false,
})

export default {
  LineChartLayoutOptionState,
  LineChartDataOptionState,
  LineDrawerState,
}
