// import { Spinner } from '@chakra-ui/react'
import { Spin } from 'antd'
import React, { ReactElement } from 'react'
import { useIsFetching, useIsMutating } from 'react-query'
import { Spinner, Text } from '@chakra-ui/react'
//현재 fetching 중인 쿼리의 개수를 return하는 hook

export const Loading = () => {
  const isFetching = useIsFetching()
  const isMutating = useIsMutating()
  // console.log('isFetching::', isFetching)
  const display = isFetching || isMutating ? 'inherit' : 'none'

  return (
    <Spinner
      thickness="4px"
      speed="0.75s"
      emptyColor="gray.200"
      color="blue.500"
      size="xl"
      role="status"
      position="fixed"
      zIndex="9999"
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
      display={display}
    >
      <Text>Loading...</Text>
    </Spinner>

    // <Spin tip="Loading..." spinning={true} size="large" />
  )
}
