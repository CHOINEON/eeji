import dayjs from 'dayjs'
import { atom, selector, selectorFamily } from 'recoil'

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
  ds_id: string
  name?: string
  size?: number
  rowCount?: number
  colCount?: number
  startDate?: string
  endDate?: string
  descr?: string
  dateCol?: string
  targetY?: string
  non_numeric_cols?: string | null
  numeric_cols?: string | null
  isClassification?: number
}

export const selectedDataState = atom({
  key: 'selectedData',
  default: {
    ds_id: '',
    name: '',
    size: 0,
    rowCount: 0,
    colCount: 0,
    startDate: '',
    endDate: '',
    descr: '',
    dateCol: '',
    targetY: '',
    non_numeric_cols: '',
    numeric_cols: '',
    isClassification: 1,
  } as IDataset,
})

interface IOption {
  algo_type: number
  date_format: string
  name: string
  date_col?: string
  target_y: string
  desc?: string
}

export const dataPropertyState = atom({
  key: 'dataProperty',
  default: {
    algo_type: 1,
    date_format: '',
    name: '',
    date_col: '',
    target_y: '',
    desc: '',
  } as IOption,
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
