import { TResponseType } from 'apis/type/commonResponse'
import { ICompanyList } from 'apis/type/User'
import UserApi from 'apis/UserApi'
import React from 'react'
import { useQuery } from 'react-query'

const useGetCompanies = () => {
  const { status, data } = useQuery<TResponseType<ICompanyList>, unknown>(['companyList'], () =>
    UserApi.getCompanyList()
  )

  return { status, data }
}

export default useGetCompanies
