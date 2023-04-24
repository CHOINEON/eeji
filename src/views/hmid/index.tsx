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
import { Box, useColorModeValue } from '@chakra-ui/react'

import React from 'react'

//function
// import GridLayoutBox from './function/GridLayout'
// import PredefinedLayouts from './function/GridLayoutTest'

export default function HMID() {
  const theme = useColorModeValue('navy.700', 'white')

  const [Company_id, setCompanyId] = React.useState<any>()

  //상단바 -- admin index에서 가져옴
  const [ButtonDisabled, setButtonDisabled] = React.useState<boolean>(true)
  const [OpenLayoutModal, setOpenLayoutModal] = React.useState<boolean>(false)
  const [GridInfo, setGridInfo] = React.useState<string>()
  const [ItemColor, setItemColor] = React.useState('#0044620f')

  //권한
  const [AdminInfo, setAdminInfo] = React.useState('block')

  //실시간 데이터
  const [realTimeBtnColor, setRealTimeBtnColor] = React.useState('#8F9BBA')
  const [realTimeBtnFont, setRealTimeBtnFont] = React.useState('#fff')

  //레이아웃 저장 confirm 창 & info
  const [OpenSaveLayout, setOpenSaveLayout] = React.useState<boolean>(false)

  // React.useEffect(() => {
  //   // if (window.localStorage.getItem('companyId') !== null) {
  //   setCompanyId(window.localStorage.getItem('companyId'))
  //   console.log(window.localStorage.getItem('companyId'))
  //   //}
  // }, [])

  // React.useState(() => {
  //   console.log('[ 하위에서 받은 props ] : ')
  //   console.log(OpenSaveLayout)
  // }, [OpenSaveLayout])

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

  // #ffffff0f

  // const NotReload = () => {
  //   if( (event.ctrlKey == true && (event.keyCode == 78 || event.keyCode == 82)) || (event.keyCode == 116) ) {
  //     event.keyCode = 0;
  //     event.cancelBubble = true;
  //     event.returnValue = false;
  // }
  // }

  // document.onkeydown = NotReload()

  const getSaveInfoConformOpen = (e: any) => {
    console.log(e)
  }

  return (
    <>
      {/* <Box>{renderGrid(GridInfo)}</Box> */}
      {/* <Box>
          <GridLayoutBox gridInfo={GridInfo} />
        </Box> */}
      {/* <Box pt={{ base: '130px', md: '80px', xl: '80px' }} style={{ position: 'relative', zIndex: 1000 }}>
        <LayoutList company_id={window.localStorage.getItem('companyId')} />
      </Box> */}
    </>
  )
}
