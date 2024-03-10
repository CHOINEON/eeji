import { atom, selector } from 'recoil'
import { userInfoState } from '../dataset/atom'
import { selectedVarStoreX, selectedVarStoreY } from '../variable/atom'

interface IUserOption {
  set_auto: boolean
  user_id: string
  com_id: string
  dataset_id: string
  date_col: string
  start_date: string
  end_date: string
  x_value: Array<string>
  y_value: string
  type_missing: string
  number_missing: number
  type_outlier: string
  number_std: number
  number_perc: number
  type_scaling: string
  number_ma: number
  type_model: string
  number_epoch: number
  number_beyssian: number
}

export const inputOptionListState = atom({
  key: 'optionList',
  default: {
    set_auto: true,
    user_id: '',
    com_id: '',
    dataset_id: '',
    start_date: null,
    end_date: null,
    x_value: null,
    y_value: '',
    type_missing: null,
    number_missing: null,
    type_outlier: null,
    number_std: null,
    number_perc: null,
    type_scaling: null,
    number_ma: null,
    type_model: null,
    number_epoch: null,
    number_beyssian: null,
  } as IUserOption,
})

export const inputCorrPlotOptionState = atom({
  key: 'corrPlotOption',
  default: {
    user_id: '',
    com_id: '',
    ds_id: '',
    x_col: '풍량',
    y_col: '산소부화율',
    size_col: null,
    color_col: null,
    x_range: null,
    y_range: null,
    size_range: null,
    color_range: null,
    filter_col: '',
    filter_range: null,
    date_range: null,
  },
})

//사용자 지정 옵션(전처리, 학습 )
export const userInputOptionState = selector({
  key: 'userInputOptionState',
  get: ({ get }) => ({
    x_value: get(inputOptionListState).x_value,
    y_value: get(inputOptionListState).y_value,

    type_missing: get(inputOptionListState).type_missing,
    number_missing: get(inputOptionListState).number_missing,
    type_outlier: get(inputOptionListState).type_outlier,
    number_std: get(inputOptionListState).number_std,
    number_perc: get(inputOptionListState).number_perc,
    type_scaling: get(inputOptionListState).type_scaling,
    number_ma: get(inputOptionListState).number_ma,
    type_model: get(inputOptionListState).type_model,
    number_epoch: get(inputOptionListState).number_epoch,
    number_beyssian: get(inputOptionListState).number_beyssian,
  }),
})

//ai model generator 페이지에서 여러 모델 생성한 경우, 사용자가 몇번째 모델 선택한지 저장
export const selectModelState = atom({
  key: 'selectModelState',
  default: 0 as number,
})
