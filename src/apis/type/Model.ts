export interface IModelStatus {
  id: string
  name: string
  target: string
  state: number
  created_at: string
}

export type IModelList = Array<IModelStatus>
