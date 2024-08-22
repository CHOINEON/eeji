import { atom } from 'recoil'

export const stepCountStore = atom({
  key: 'activeStep',
  default: 0,
})

export const loadingAtom = atom({
  key: 'loadingStatus',
  default: false,
})
