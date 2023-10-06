import { atom } from 'recoil'

export const sliderValueState = atom({
  key: 'sliderValueState',
  default: { price: 0, volume: 0 },
})

export const ThreValueState = atom({
  key: 'ThreValueState',
  default: { Threshold: 0 },
})
