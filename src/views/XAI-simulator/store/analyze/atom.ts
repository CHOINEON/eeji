import { atom, selector, selectorFamily } from 'recoil'

export const customModelStore = atom({
  key: 'customModelSaveResult',
  default: { uuid: '', variable_list: [], selected_var: [], data: [] },
})

interface IPredictResult {
  predict_result: any
}

interface IActiveVariables {
  [key: string]: number
}

export const activeVariables = atom({
  key: 'activeVariables',
  default: {} as IActiveVariables,
})

//original   DO NOT UPDATE THIS VALUE
export const xaiResultStore = atom({
  key: 'xaiResultStore',
  default: {
    sample_size: 0,
    feature_length: 0,
    feature_list: [],
    predict_result: {} as IPredictResult,
    input_data: [],
    xai_local: [] as Array<unknown>,
    xai_pdp: {},
    xai_global: [],
    colors: {},
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
  get: ({ get }: any) => {
    const localAttr = get(xaiResultStore).xai_local
    const activeList = get(activeVariables)
    const filterValuesArray = Object.keys(activeList).filter((key) => !activeList[key])
    // console.log('filterValuesArray:', filterValuesArray)

    //  { 0: true, 1: false, 2: false, 3: false }
    // ['1','2','3']

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
