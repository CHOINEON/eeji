import { atom } from 'recoil'

export const variableStore = atom({
  key: 'variableList',
  default: [],
})

export const usedVariableStore = atom({
  key: 'usedVariable',
  default: [],
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

export const indexColumnStore = atom({
  key: 'indexColumnStore',
  default: '',
})
