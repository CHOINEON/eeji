// import { Spinner } from '@chakra-ui/react'
import { Spin } from 'antd'
import React, { ReactElement } from 'react'
import { useIsFetching } from 'react-query'
//현재 fetching 중인 쿼리의 개수를 return하는 hook

export const Loading = () => {
  const isFetching = useIsFetching()
  console.log('isFetching::', isFetching)
  const display = isFetching ? true : false

  return (
    <>
      <Spin spinning={display} tip="Loading" size="large" />
    </>
  )
}
