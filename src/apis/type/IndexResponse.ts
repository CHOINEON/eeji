export interface ISymbol {
  symbol_id: string
  period: string
  horizons: string //서버에서 string으로 받아 Array로 parsing해 사용
}

export interface ISymbolList {
  symbols: Array<ISymbol>
}

export interface ISelectedIndex {
  horizon: number
}

export interface IFeatureImportance {
  feature_name: string
  importance: number
}

export interface IGlobalFeatureImportance {
  dt: string
  feature_importance: Array<IFeatureImportance>
  horizon: number
  name: string
}
