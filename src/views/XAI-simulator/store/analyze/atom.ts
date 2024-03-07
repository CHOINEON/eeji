import { atom } from 'recoil'

export const customModelStore = atom({
  key: 'customModelSaveResult',
  default: { uuid: '', variable_list: [], selected_var: [], data: [] },
})

export const xaiResultStore = atom({
  key: 'xaiResultStore',
  default: {
    sample_size: 0,
    feature_length: 0,
    feature_list: [],
    predict_result: { predict_result: {} },
    input_data: {},
    xai_local: {},
    xai_global: [],
    xai_pdp: {},
  },
})

export const transformedXaiResultStore = atom({
  key: 'transformedXaiResultStore',
  default: {
    xai_local: [],
    local_value: [],
    pred_result: {},
    xai_pdp: {},
  },
})
