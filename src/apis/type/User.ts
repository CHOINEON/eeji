export type IUserLoginReq = {
  com_id: string
  user_id: string
  user_pass: string
}

export type IUserLogoutReq = {
  com_id: string
  user_id: string
}

export interface ICompanyInfo {
  com_id: string
  com_nm: string
  com_email: string
  com_tel: string
}

export type ICompanyList = Array<ICompanyInfo>

export type IGooglesigninReq = {
  code: string
}
