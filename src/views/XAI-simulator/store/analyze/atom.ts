import { atom, selector } from 'recoil'

export const customModelStore = atom({
  key: 'customModelSaveResult',
  default: { uuid: '', variable_list: [], selected_var: [], data: [] },
})

interface IPredictResult {
  predict_result: unknown
}

interface IActiveVariables {
  [key: string]: boolean
}

export const activeVariables = atom({
  key: 'activeVariables',
  default: {} as IActiveVariables,
})

export interface ICommodityIndex {
  date: string
  ground_truth: number
  prde_1: number
  prde_2: number
  prde_3: number
  prde_4: number
  prde_5: number
  xai: IxaiResult
}

interface IxaiResult {
  sample_size: number
  feature_length: number
  // feature_list?: Array<unknown>
  predict_result: unknown
  input_data: Array<unknown>
  xai_local: Array<unknown>
  xai_pdp: unknown
  xai_global: Array<unknown>
}

//original   DO NOT UPDATE THIS VALUE
export const xaiResultStore = atom({
  key: 'xaiResultStore',
  default: {
    model_id: '',
    sample_size: 0,
    feature_length: 0,
    feature_list: [],
    predict_result: {} as IPredictResult,
    input_data: [],
    xai_local: [] as Array<unknown>,
    xai_pdp: {},
    xai_global: {},
    colors: {},
    target: '', //240920 XAI 결과 페이지 그래프에 x,y label로 사용하기 위해 추가함
  },
})

export const xaiPaginationStore = atom({
  key: 'xaiPaginationStore',
  default: {
    total: 0,
    page: 1, //1페이지
    offset: 1, //1번 데이터부터 시작(eg. offset = 1  ==>  1 ~ 1+limit까지의 데이터)
    limit: 10,
  },
})

//transformed
export const transformedXaiResultStore = atom({
  key: 'transformedXaiResultStore',
  default: {
    sample_size: 0,
    feature_length: 0,
    feature_list: [],
    xai_local: [] as Array<unknown>,
    xai_pdp: {},
    xai_global: [],
    local_value: [],
    pred_result: {} as IPredictResult,
  },
})

export const localAttrState = selector({
  key: 'localAttrState',
  get: ({ get }) => {
    const localAttr = get(xaiResultStore).xai_local
    const activeList = get(activeVariables)
    const filterValuesArray = Object.keys(activeList).filter((key) => !activeList[key])

    if (filterValuesArray.length > 0) {
      let newObj: Array<any> = []
      newObj = localAttr

      filterValuesArray.map((val: any) => {
        newObj = newObj.map((item: any) => {
          if (val in item) return { ...item, [val]: 0 }
        })
      })
      return newObj
    } else {
      return localAttr
    }
  },
})
