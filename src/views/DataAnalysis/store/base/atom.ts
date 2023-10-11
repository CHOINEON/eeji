import dayjs from 'dayjs'
import { get } from 'lodash'
import { atom, selector, selectorFamily } from 'recoil'
import { StringDecoder } from 'string_decoder'

export const userInfoState = atom({
  key: 'userInfo',
  default: {
    user_id: '',
    com_id: '',
  },
})

export const startEndDateAtom = atom({
  key: 'startEndDate',
  default: [dayjs(), dayjs()],
})

// export const uploadDataAtom = atom({
//   key: 'uploadData',
//   default: [],
// })

interface UploadData {
  error?: string
  file?: File
  name?: string
  content?: Array<any>
  rowCount?: number
  colCount?: number
  startDate?: string
  endDate?: string
}

//
export const uploadedDataState = atom({
  key: 'uploadedData',
  default: {
    file: undefined,
    name: '',
    content: [],
    // size: 0,
    rowCount: 0,
    colCount: 0,
    startDate: '',
    endDate: '',
  } as UploadData,
})

interface IDataset {
  id: string
  name?: string
  size?: number
  rowCount?: number
  colCount?: number
  startDate?: string
  endDate?: string
  descr?: string
}

export const selectedDataState = atom({
  key: 'selectedData',
  default: {
    id: '',
    name: '',
    size: 0,
    rowCount: 0,
    colCount: 0,
    startDate: '',
    endDate: '',
    descr: '',
  } as IDataset,
})

interface IOption {
  name: string
  date_col: string
  desc: string
}

export const dataPropertyState = atom({
  key: 'dataProperty',
  default: {} as IOption,
})

//사용자가 입력한 properties 저장소
// export const dataProperty = selector({
//   key: 'dataProperty',
//   get: ({ get }) => ({
//     name: get(dataPropertyState).name,
//     desc: get(dataPropertyState).desc,
//     date_col: get(dataPropertyState).date_col,
//   }),
// })

//summary fetching state( 'standby' /requested / completed/ failed)
export const summaryFetchState = atom({
  key: 'summaryFetchState',
  default: 'standby',
})
