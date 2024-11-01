import { ISelectedIndex, ISymbol } from 'apis/type/IndexResponse'
import { atom } from 'recoil'

export const SymbolState = atom({
  key: 'symbolState',
  default: { symbol_id: '', period: '', horizons: '' } as ISymbol,
})

export const SymbolListState = atom({
  key: 'symbolListState',
  default: [] as ISymbol[],
})

export const selectedIndexState = atom({
  key: 'selectedIndexState',
  default: { horizon: 0 } as ISelectedIndex,
})

export const graphDataState = atom({
  key: 'graphDataState',
  default: [] as any[],
})
