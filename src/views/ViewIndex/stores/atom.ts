import { ISelectedFilter, ISymbol, Prediction } from 'apis/type/IndexResponse'
import { atom } from 'recoil'

export const SymbolState = atom({
  key: 'symbolState',
  default: {
    symbol_id: '',
    period: '',
    horizons: '',
    unit: '',
    features: {},
    selectedHorizon: 0,
  } as ISymbol,
})

export const SymbolListState = atom({
  key: 'symbolListState',
  default: [] as ISymbol[],
})

//현재 시각화에 사용되는 데이터(selectedDate, selectedFeature)
export const selectedFilterState = atom({
  key: 'selectedFilterState',
  default: { selectedDate: '', selectedFeature: '' } as ISelectedFilter,
})

export const graphDataState = atom({
  key: 'graphDataState',
  default: [] as Prediction[],
})
