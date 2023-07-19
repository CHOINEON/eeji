/**
 * INFINITE OPTIMAL
 * 메뉴 : HMI Designer - LayoutList
 * 최종 수정 날짜 : 2023-07-06
 * 개발자 : 박윤희 (BAK YUN HEE)
 */
import { Box } from '@chakra-ui/react'

import React from 'react'

import LayoutList from './LayoutList'

export default function LayoutConfig() {
  return (
    <>
      <Box pt={{ base: '130px', md: '80px', xl: '80px' }} style={{ position: 'relative', zIndex: 1000 }}>
        <LayoutList company_id={window.localStorage.getItem('companyId')} />
      </Box>
    </>
  )
}
