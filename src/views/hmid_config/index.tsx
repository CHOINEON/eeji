import React from 'react'
import { Box, useColorModeValue } from '@chakra-ui/react'
import PredefinedLayouts from './grid/GridLayoutTest'
import { RecoilRoot } from 'recoil'

export default function LayoutConfig() {
  const theme = useColorModeValue('navy.700', 'white')

  const [Company_id, setCompanyId] = React.useState<any>()

  //실시간 데이터
  const [realTimeBtnColor, setRealTimeBtnColor] = React.useState('#8F9BBA')
  const [realTimeBtnFont, setRealTimeBtnFont] = React.useState('#fff')

  //레이아웃 저장 confirm 창 & info
  const [OpenSaveLayout, setOpenSaveLayout] = React.useState<boolean>(false)

  const getSaveInfoConformOpen = (e: any) => {
    console.log(e)
  }

  return (
    <>
      <RecoilRoot>
        <Box pt={{ base: '130px', md: '80px', xl: '80px' }} style={{ position: 'relative', zIndex: 1000 }}>
          <PredefinedLayouts
            CompanyId={Company_id}
            SaveConfirmIsOpen={OpenSaveLayout}
            SaveInfo={''}
            setSaveConfirmIsOpen={getSaveInfoConformOpen}
          />
        </Box>
      </RecoilRoot>
    </>
  )
}
