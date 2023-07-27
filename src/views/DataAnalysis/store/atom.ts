import { atom } from 'recoil'

export const stepCountStore = atom({
  key: 'activeStep',
  default: 0,
})

// export const selectedDataStore = atom({
//   key: 'selectedData',
//   default: [
//     { key: 'data_set', value: '' },
//     { key: 'data_file', value: '' },
//   ],
// })

// export const loadingStore = atom({
//   key: 'loading',
//   default: false,
// })

export const dataSetStore = atom({
  key: 'selectedDataSet',
  default: '',
})

export const dataFileStore = atom({
  key: 'selectedFileName',
  default: '',
})

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

export const excludeHistoryStore = atom<Array<TEST> | undefined>({
  key: 'excludeHistoryStore',
  default: [],
})

export interface TEST {
  start?: string
  end?: string
  datetime: string
}
