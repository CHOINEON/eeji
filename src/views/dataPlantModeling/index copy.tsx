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
import React, { useState, useEffect } from 'react'
import { Box, useColorModeValue, Stack, Button, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { MdOutlineGridView, MdOutlineSettingsInputComposite, MdSave, MdOutlineRestartAlt } from 'react-icons/md'
import FileUploader from './FileUploader'
import DataInfoGrid from './DataSummary'
import DataAnalysis from 'views/DataAnalysis'
import { refreshVirtualLazyLoadCache } from '@syncfusion/ej2-react-grids'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { green, purple } from '@mui/material/colors'
import VariableSelection from './VariableSelection'

const theme = createTheme({
  palette: {
    primary: {
      main: purple[500],
    },
    secondary: {
      main: green[500],
    },
  },
})

export default function DataPlantModeling() {
  // const [ButtonDisabled, setButtonDisabled] = React.useState<boolean>(true)
  // const [OpenLayoutModal, setOpenLayoutModal] = React.useState<boolean>(false)
  // const [GridInfo, setGridInfo] = React.useState<string>()
  // const [ItemColor, setItemColor] = React.useState('#0044620f')

  // //권한
  // const [AdminInfo, setAdminInfo] = React.useState('block')

  // const theme = useColorModeValue('navy.700', 'white')
  // console.log(theme)

  const [refresh, setRefresh] = useState(false)

  const [tabIndex, setTabIndex] = useState(0)
  const [isDisabled, setIsDisabled] = useState([false, false, false])
  const [dataSummary, setDataSummary] = useState()
  const [tagList, setTagList] = useState(false)

  // useEffect(() => {
  //   const tempArray: Array<boolean> = new Array<boolean>()

  //   for (let i = 0; i < 3; i++) {
  //     if (tabIndex === i) tempArray.push(false)
  //     else tempArray.push(true)
  //   }

  //   setIsDisabled(tempArray)
  // }, [tabIndex])

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

  const handleTabsChange = (index: number) => {
    setTabIndex(index)
  }

  const onClickNext = (tabNumber: any) => {
    // console.log('e:', tabNumber)
    // console.log('data:', data)

    setTabIndex(tabNumber)
    // if (tabNumber === 1 && data) {
    //   setDataSummary(data)
    // }
  }

  const onRefresh = () => {
    setTabIndex(0)
    refreshAll()
  }

  const refreshAll = () => {
    setRefresh(true)
  }
  const handleSliderChange = (event: any) => {
    setTabIndex(parseInt(event.target.value, 10))
  }

  return (
    <>
      <Box pt={{ base: '130px', md: '80px', xl: '80px' }} style={{ position: 'relative', zIndex: 1000 }}>
        {/* <Box>{renderGrid(GridInfo)}</Box> */}
        {/* <Box>
          <GridLayoutBox gridInfo={GridInfo} />
        </Box> */}
        <input type="range" min="0" max="2" value={tabIndex} onChange={handleSliderChange} />

        <Tabs index={tabIndex} onChange={handleTabsChange}>
          <TabList>
            <Tab isDisabled={isDisabled[0]}>Data Upload</Tab>
            <Tab isDisabled={isDisabled[1]}>Select Variables</Tab>
            <Tab isDisabled={isDisabled[2]}>Preprocessing</Tab>
          </TabList>
          <ThemeProvider theme={theme}>
            <TabPanels>
              <TabPanel>
                <FileUploader onClickNext={onClickNext} refresh={refresh} />
              </TabPanel>
              <TabPanel>
                <VariableSelection onClickNext={onClickNext} />
              </TabPanel>
              <TabPanel>
                <DataAnalysis onRefresh={onRefresh} />
              </TabPanel>
            </TabPanels>
          </ThemeProvider>
        </Tabs>
      </Box>
      {/* {tabIndex === 2 && (
        <div style={{ textAlign: 'right' }}>
          <Button colorScheme="teal" variant="ghost" onClick={handleNewStart}>
            NEW START
          </Button>
        </div>
      )} */}
    </>
  )
}
