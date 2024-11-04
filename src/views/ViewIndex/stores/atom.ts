import { ISelectedFilter, ISymbol, Prediction } from 'apis/type/IndexResponse'
import { atom } from 'recoil'

export const SymbolState = atom({
  key: 'symbolState',
  default: { symbol_id: '', period: '', horizons: '', unit: '', features: {}, selectedHorizon: 0 } as ISymbol,
})

export const SymbolListState = atom({
  key: 'symbolListState',
  default: [] as ISymbol[],
})

//현재 차트에서 선택된 Index 정보(selectedDate, features...)
export const selectedFilterState = atom({
  key: 'selectedFilterState',
  default: { selectedDate: '' } as ISelectedFilter,
})

export const graphDataState = atom({
  key: 'graphDataState',
  default: [] as Prediction[],
})
