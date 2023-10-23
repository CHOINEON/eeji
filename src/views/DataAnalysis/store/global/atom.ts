import { atom } from 'recoil'

export const stepCountStore = atom({
  key: 'activeStep',
  default: 0,
})
