import dayjs from 'dayjs'
import { get } from 'lodash'
import { atom, selector, selectorFamily } from 'recoil'

export const startEndDateAtom = atom({
  key: 'startEndDate',
  default: [dayjs(), dayjs()],
})

export const uploadDataAtom = atom({
  key: 'uploadData',
  default: [],
})

export const uploadFileInfoAtom = atom({
  key: 'uploadFileInfo',
  default: { name: '', size: 0, type: '' },
})

interface IOption {
  name: string
  date_col: string
  desc: string
}

export const optionListState = atom({
  key: 'optionList',
  default: {} as IOption,
})

export const inputOptionState = selector({
  key: 'inputOptionState',
  get: ({ get }) => ({
    name: get(optionListState).name,
    desc: get(optionListState).desc,
    date_col: get(optionListState).date_col,
  }),
})
