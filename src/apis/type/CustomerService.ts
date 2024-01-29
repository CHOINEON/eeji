export interface IFeedbackDataReq {
  user_id: string
  com_id: string
  rate: number
  email: string
  feedback: string
}

export interface IFeedbackRes {
  data: Array<any>
}
