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
import { Box, useColorModeValue, Stack, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { MdOutlineGridView, MdOutlineSettingsInputComposite, MdSave, MdOutlineRestartAlt } from 'react-icons/md'
import FileUploader from './components/FileUploader'
import DataInfoGrid from './components/DataSummary'
import DataAnalysis from 'views/DataAnalysis'
import { refreshVirtualLazyLoadCache } from '@syncfusion/ej2-react-grids'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { green, purple } from '@mui/material/colors'
import VariableSelection from './components/VariableSelection'
import CircularProgress from '@mui/material/CircularProgress'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepButton from '@mui/material/StepButton'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { theme } from './theme'
import axios from 'axios'

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
  const [uploaded, setUploaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeStep, setActiveStep] = React.useState(0)
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean
  }>({})

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

  const onClickNext = (step: any) => {
    // console.log('e:', step)
    // console.log('data:', data)
    // setTabIndex(tabNumber)
    // if (tabNumber === 1 && data) {
    //   setDataSummary(data)
    // }
  }

  const onRefresh = () => {
    refreshAll()
  }

  const refreshAll = () => {
    setRefresh(true)
  }

  const onUploaded = (param: boolean) => {
    setUploaded(param)
  }
  const steps = ['Upload Data', 'Select Variables', 'Preprocessing']
  const totalSteps = () => {
    return steps.length
  }

  const completedSteps = () => {
    return Object.keys(completed).length
  }

  const isLastStep = () => {
    return activeStep === totalSteps() - 1
  }

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps()
  }

  const handleNext = () => {
    console.log('active step:', activeStep)

    if (activeStep === 0) {
      const newActiveStep =
        isLastStep() && !allStepsCompleted()
          ? // It's the last step, but not all steps have been completed,
            // find the first step that has been completed
            steps.findIndex((step, i) => !(i in completed))
          : activeStep + 1
      setActiveStep(newActiveStep)
    } else if (activeStep === 1) {
      // onPreprocessing
      const handlePreprocessing = () => {
        setLoading(true)

        const Object: object = {
          com_id: localStorage.getItem('companyId'),
          cause: [
            {
              table_nm: 'tc',
              variable: ['Tag-2'],
            },
          ],
          target: {
            table_nm: 'tc',
            variable: ['Tag-1'],
          },
        }

        axios
          .post(process.env.REACT_APP_API_SERVER_URL + '/api/tag/preprocessing', JSON.stringify(Object), {
            headers: {
              'Content-Type': `application/json`,
            },
          })
          .then(
            (response: any) => {
              console.log('preprocessing response:', response)
              if (response.data.message == 'success') {
                const newActiveStep =
                  isLastStep() && !allStepsCompleted()
                    ? // It's the last step, but not all steps have been completed,
                      // find the first step that has been completed
                      steps.findIndex((step, i) => !(i in completed))
                    : activeStep + 1
                !loading && setActiveStep(newActiveStep)

                setLoading(false)
              }
            },
            (error) => {
              setLoading(false)
              console.log('error:', error)
            }
          )
      }

      handlePreprocessing()
    } else if (activeStep === 2) {
      // the last step
    }
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleStep = (step: number) => () => {
    setActiveStep(step)
  }

  const handleComplete = () => {
    const newCompleted = completed
    newCompleted[activeStep] = true
    setCompleted(newCompleted)
    handleNext()
  }

  const handleReset = () => {
    setActiveStep(0)
    setCompleted({})
  }
  // https://mui.com/material-ui/react-stepper/
  return (
    <ThemeProvider theme={theme}>
      <Box pt={{ base: '130px', md: '80px', xl: '80px' }} style={{ position: 'relative', zIndex: 1000 }}>
        <Box margin={5}>
          <Stepper nonLinear activeStep={activeStep}>
            {steps.map((label, index) => (
              <Step key={label} completed={completed[index]}>
                <StepButton color="inherit" onClick={handleStep(index)}>
                  {label}
                </StepButton>
              </Step>
            ))}
          </Stepper>
        </Box>
        <Box>
          {activeStep === 0 && (
            <>
              <FileUploader onUploaded={onUploaded} refresh={refresh} />
            </>
          )}
        </Box>
        <Box>{activeStep === 1 && <VariableSelection />}</Box>
        <Box>{activeStep === 2 && <DataAnalysis onRefresh={onRefresh} />}</Box>
        <div style={{ width: '400px', float: 'right' }}>
          <Box className="upload_wrapper" style={{ float: 'right', maxWidth: '400px', margin: 'auto' }}>
            {loading ? (
              <CircularProgress style={{ position: 'relative', top: '200px' }} />
            ) : (
              <Button onClick={handleNext}>Next</Button>
            )}
          </Box>
        </div>
      </Box>
    </ThemeProvider>
  )
}
