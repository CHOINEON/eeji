import { ILocalAttribution, IPrediction, IRawDataResponse, ISelectedFilter } from 'apis/type/IndexResponse'
import { atom, selector } from 'recoil'

export const symbolState = atom({
  key: 'symbolState',
  default: {
    symbolList: [],
    selectedSymbol: null, //symbol_id
  },
})

export const selectedSymbolSelector = selector({
  key: 'selectedSymbolSelector',
  get: ({ get }) => get(symbolState).selectedSymbol || '',
  set: ({ set }, newValue) =>
    set(symbolState, (prevState) => ({
      ...prevState,
      selectedSymbol: newValue,
    })),
})

// Horizon 상태
export const horizonState = atom({
  key: 'horizonState',
  default: {
    horizonList: [],
    selectedHorizon: null as number | null,
  },
})

// export const selectedHorizonSelector = selector({
//   key: 'selectedHorizonSelector',
//   get: ({ get }) => get(symbolState).symbolList.find((symbol) => symbol.symbol_id === get(symbolState).selectedSymbol),
//   set: ({ set }, newValue) =>
//     set(horizonState, (prevState) => ({
//       ...prevState,
//       selectedHorizon: newValue,
//     })),
// })

// export const SymbolState = atom({
//   key: 'symbolState',
//   default: {
//     symbol_id: '',
//     period: 'yearly' as PeriodType,
//     horizons: '',
//     unit: '',
//     features: {},
//     selectedHorizon: 0,
//     dates: [], //모든 x축 날짜 (rawData 기준으로 데이터 포맷팅을 위해 저장)
//     category: '',
//   } as ISymbol,
// })

// export const SymbolListState = atom({
//   key: 'symbolListState',
//   default: {
//     categories: [],
//     symbols: [],
//   } as ISymbolList,
// })

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
