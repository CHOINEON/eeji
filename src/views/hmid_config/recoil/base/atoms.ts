/**
 * 2023-05-23 박윤희
 * recoil atoms state
 **/

// atoms.ts
import { atom } from 'recoil'

//state
export const CompanyId = atom({
  key: 'CompanyId',
  default: window.localStorage.getItem('companyId'),
})

export const LayoutTitle = atom({
  key: 'LayoutTitle',
  default: '',
})

export default { CompanyId, LayoutTitle }
