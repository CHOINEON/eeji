import { atom } from 'recoil'

export const stepCountStore = atom({
  key: 'ai-modeling-activeStep',
  default: 0,
})
