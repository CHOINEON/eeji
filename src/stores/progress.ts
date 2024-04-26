import { atom } from 'recoil'

export const ProgressState = atom({
  key: 'progress',
  default: {
    percent: 0,
    isLoading: false,
  },
})
