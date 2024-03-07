import { atom, selector, selectorFamily } from 'recoil'

export const customModelStore = atom({
  key: 'customModelSaveResult',
  default: { uuid: '', variable_list: [], selected_var: [], data: [] },
})

interface IPredictResult {
  predict_result: any
}

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

export const localAttrState = selectorFamily({
  key: 'localAttrState',
  get:
    (params: any) =>
    ({ get }: any) => {
      const localAttr = get(xaiResultStore).xai_local
      const filterValuesArray = Object.keys(params).filter((key) => !params[key])
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
  set:
    (params) =>
    ({ set }: any) => {
      //
    },
})
