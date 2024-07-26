import { IModelInfo } from 'apis/type/Model'
import { atom, selector } from 'recoil'

export const modelListAtom = atom({
  key: 'modelList',
  default: [],
})

export const selectedModelAtom = atom({
  key: 'selectedModel',
  default: {} as IModelInfo,
})

//TODO: 왜 ModelListAtom의 값이 비어있을까...
export const completedModelsSelector = selector({
  key: 'completedModelsSelector',
  get: ({ get }) => {
    const modelList = get(modelListAtom)
    console.log('modelList:', modelList)
    const completed = modelList.filter((i: IModelInfo) => i.state === '7')

    return completed
  },
})
