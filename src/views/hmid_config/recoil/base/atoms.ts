/**
 * 2023-05-23 박윤희
 * recoil atoms state
 **/

// atoms.ts
import { atom } from 'recoil'
import { v1 } from 'uuid'

//state
export const CompanyId = atom({
  key: `CompanyId/${v1()}`,
  default: window.localStorage.getItem('companyId'),
})

export const LayoutTitle = atom({
  key: `LayoutTitle/${v1()}`,
  default: '',
})

export const LineChartData = atom({
  key: `LineChartData/${v1()}`,
  default: [],
})

export const NowDate = atom({
  key: `NowDate/${v1()}`,
  default: '',
})

export const WsDataTest = atom({
  key: `WsDataTest/${v1()}`,
  default: {},
})

export default { CompanyId, LayoutTitle, LineChartData, NowDate, WsDataTest }
