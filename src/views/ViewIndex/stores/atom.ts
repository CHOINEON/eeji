import {
  IFeatureDescription,
  ILocalAttribution,
  IPrediction,
  IRawDataResponse,
  ISelectedFilter,
  ISymbol,
} from 'apis/type/IndexResponse'
import { atom } from 'recoil'

export const symbolState = atom({
  key: 'symbolState',
  default: {
    symbolList: [], //전체 symbol data(object)를 리스트로 담음
    selectedSymbolData: {} as ISymbol, //선택된 symbol 정보 object로 가짐
  },
})

//선택된 symbol의 Horizon 정보 (리스트, 선택된 horizon)
export const horizonState = atom({
  key: 'horizonState',
  default: {
    horizonList: [],
    selectedHorizon: 0, //number,
  },
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

export const featureDescriptionState = atom({
  key: 'featureDescriptionState',
  default: [] as IFeatureDescription[],
})
