import { atom } from 'recoil'

export const stepCountStore = atom({
  key: 'activeStep',
  default: 0,
})

export const dataSetStore = atom({
  key: 'selectedDataSet',
  default: '',
})

export const dataFileStore = atom({
  key: 'selectedFileName',
  default: '',
})

export const tagListStore = atom({
  key: 'tagListStore',
  default: [],
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
