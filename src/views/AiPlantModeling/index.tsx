/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2022 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// Chakra imports
import { Box, useColorModeValue, Stack, Button } from '@chakra-ui/react'

import React from 'react'
import ReactLoading from 'react-loading'
import styled from '@emotion/styled'
import thumb from '/img/thumbnail_01.png'
import LineChart from 'views/DataAnalysis/components/Chart/LineChart'
import D3Chart from 'views/DataAnalysis/components/Chart/D3Chart'
import D3ChartTest from 'views/DataAnalysis/components/Chart/D3Chart copy'

const LoadingBox = styled.div<{ toggle: any }>`
  width: 10vw;
  height: 10vw;
  position: absolute;
  left: 55%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: ${(props: any) => (props.toggle ? 'block' : 'none')};
`

const ModelingParentBox = styled.div`
  width: 100%;
  background-color: #fff;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justifycontent: space-between;
  padding: 1vw;
`

const ModelingTitle = styled.div`
  font-size: 2vw;
  font-weight: bold;
  color: #fff;
  margin-bottom: 1vw;
`

export default function AIModeling() {
  //권한
  const [AdminInfo, setAdminInfo] = React.useState('block')

  const theme = useColorModeValue('navy.700', 'white')

  const [per, setPercent] = React.useState(0)
  const [DisplayLoading, setDisplayLoading] = React.useState<any>(false)

  const [timerId, setTimerId] = React.useState<any>(null)

  let tId = null
  // console.log(theme)

  //새로고침 막기
  // const preventClose = (e: BeforeUnloadEvent) => {
  //   e.preventDefault()
  //   e.returnValue = '' //Chrome에서 동작하도록; deprecated
  // }

  // React.useEffect(() => {
  //   ;(() => {
  //     window.addEventListener('beforeunload', preventClose)
  //   })()

  //   return () => {
  //     window.removeEventListener('beforeunload', preventClose)
  //   }
  // }, [])
  //end 새로고침 막기

  React.useEffect(() => {
    if (timerId) {
      tId = setInterval(timer, 10)
      setTimerId(tId)
    } else {
      setTimerId(null)
      // clearInterval(tId)
    }
  }, [timerId])

  const timer = () => {
    if (per < 98) {
      const diff = 100 - per
      const inc = diff / (10 + per * (1 + per / 100)) // 증가값
      const percent = per + inc

      // console.log(percent.toFixed(2))
      // console.log(inc)
      setPercent(percent)
    }
    setTimerId(setTimeout(timer, 20)) // 50 ms 단위로 timer 재귀호출
    // if (per >= 100) {
    //   clearInterval(id)
    //   setTimerId(0)
    // } else {
    //   let a = per
    //   a = a++
    //   console.log(a)
    //   setPercent(a)
    // }
  }

  return (
    <>
      <Box
        pt={{ base: '130px', md: '80px', xl: '80px' }}
        style={{ position: 'relative', zIndex: 1000, width: '82vw', height: '93vh' }}
      >
        <div>
          <div>
            <div>Scatter plot rendering test _ D3</div>
            {/* <LineChart /> */}
            <D3ChartTest />
          </div>
        </div>
        {/* <Button
          style={{
            position: 'absolute',
            left: '0%',
            top: '10%',
            padding: '1vw',
            backgroundColor: '#4338f7',
            color: '#fff',
            fontSize: '1vw',
          }}
          onClick={() => {
            setDisplayLoading(!DisplayLoading)
            timer()
          }}
        >
          DB Data 불러오기
        </Button> */}
        <LoadingBox toggle={DisplayLoading}>
          <ReactLoading type={'bars'} color="#00a0e9" width={'10vw'} />
          <div>{per}</div>
        </LoadingBox>
      </Box>
    </>
  )
}
