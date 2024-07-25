export interface IModelInfo {
  id?: string
  name?: string
  target?: string
  state?: string
  created_at?: string
  is_classification?: boolean
}

export type IModelList = Array<IModelInfo>
