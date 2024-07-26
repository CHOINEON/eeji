import { IModelInfo } from 'apis/type/Model'
import { atom } from 'recoil'

export const modelListAtom = atom({
  key: 'modelList',
  default: [],
})

export const selectedModelAtom = atom({
  key: 'selectedModel',
  default: {} as IModelInfo,
})
