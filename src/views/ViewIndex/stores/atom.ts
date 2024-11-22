import { ILocalAttribution, IPrediction, IRawDataResponse, ISelectedFilter, ISymbol } from 'apis/type/IndexResponse'
import { atom } from 'recoil'
import { PeriodType } from 'utils/TextTranslator'

export const SymbolState = atom({
  key: 'symbolState',
  default: {
    symbol_id: '',
    period: 'yearly' as PeriodType,
    horizons: '',
    unit: '',
    features: {},
    selectedHorizon: 0,
    dates: [], //모든 x축 날짜 (rawData 기준으로 데이터 포맷팅을 위해 저장)
  } as ISymbol,
})

export const SymbolListState = atom({
  key: 'symbolListState',
  default: [] as ISymbol[],
})

//현재 시각화에 사용되는 데이터(selectedDate, selectedFeature)
export const selectedFilterState = atom({
  key: 'selectedFilterState',
  default: { selectedDate: '', selectedFeatures: [], has_ci: true } as ISelectedFilter,
})

export const graphDataState = atom({
  key: 'graphDataState',
  default: [] as IPrediction[],
})

export const FeatureImpactDataState = atom({
  key: 'featureImpactDataState',
  default: {} as ILocalAttribution,
})

export const RawDataState = atom({
  key: 'rawDataState',
  default: {} as IRawDataResponse,
})
