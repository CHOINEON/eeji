import { atom } from 'recoil'

// export const stepCountStore = atom({
//   key: 'ai-modeling-activeStep',
//   default: 0,
// })

export const runModalAtom = atom({
  key: 'modelRunModal',
  default: false,
})

export const modelListAtom = atom({
  key: 'modelList',
  default: [],
})
