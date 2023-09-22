import { atom } from 'recoil'

export const sliderValueState = atom({
  key: 'sliderValueState',
  default: { price: 0, volume: 0 },
})
