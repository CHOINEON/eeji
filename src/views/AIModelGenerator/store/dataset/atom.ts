import dayjs from 'dayjs'
import { atom } from 'recoil'

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
  columns?: Array<any>
  numericCols?: Array<string>
  nonNumericCols?: Array<string>
  objectName?: string
  encoding: string
}

export const uploadedDataState = atom({
  key: 'uploadedData',
  default: {
    file: null,
    name: '',
    content: [],
    // size: 0,
    rowCount: 0,
    colCount: 0,
    startDate: '',
    endDate: '',
    columns: [],
    numericCols: [],
    nonNumericCols: [],
    objectName: '',
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
    algo_type: undefined,
    date_format: '',
    name: '',
    date_col: '',
    target_y: '',
    desc: '',
  } as IOption,
})

//GCS Signed url
interface IGoogleSignedUrlRes {
  surl: string
  uuid: string
  blobName: string
}

export const signedUrlState = atom({
  key: 'signedUrlState',
  default: { surl: '', uuid: '', blobName: '' } as IGoogleSignedUrlRes,
})
