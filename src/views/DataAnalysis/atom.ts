import { atom } from 'recoil'

export const stepCountStore = atom({
  key: 'activeStep',
  default: 0,
})

export const variableStoreX = atom({
  key: 'variableX',
  default: [],
})

export const variableStoreY = atom({
  key: 'variableY',
  default: [],
})

export const selectedVarStoreX = atom({
  key: 'selectedVarX',
  default: [],
})

export const selectedVarStoreY = atom({
  key: 'selectedVarY',
  default: [],
})

export const defaultStoreX = atom({
  key: 'defaultStoreX',
  default: [],
})

export const tagListStore = atom({
  key: 'tagListStore',
  default: [],
})

export const indexColumnStore = atom({
  key: 'indexColumnStore',
  default: '',
})
