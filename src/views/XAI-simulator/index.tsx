import { Box } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { Button, Col, Row, Tag } from 'antd'
import Title from 'antd/es/typography/Title'
import axios from 'axios'

import React, { MouseEventHandler, useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import AnalysisResult from './AnalysisResult'
import { customModelStore } from './store/analyze/atom'
import UploadPage from './UploadPage'
import HistorySidebar from 'components/sidebar/HistorySidebar'

const XAIsimulator = () => {
  const analysisResult = useRecoilValue(customModelStore)

  // useEffect(() => {
  //   console.log('result:', analysisResult.data)
  // }, [analysisResult])

  return (
    <>
      <Box style={{ position: 'relative', zIndex: 1000, width: '100%', height: '100%' }}>
        <AnalysisResult />
        {/* {analysisResult.data.length > 0 ? <AnalysisResult /> : <UploadPage />} */}
      </Box>
    </>
  )
}

export default XAIsimulator
