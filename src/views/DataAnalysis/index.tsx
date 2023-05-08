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
import React, { useState, useEffect, useReducer } from 'react'
import { Box } from '@chakra-ui/react'
import FileUploader from './FileUploader'
import PreProcessing from './PreProcessing'
import { ThemeProvider } from '@mui/material/styles'
import VariableSelection from './VariableSelection'
import CircularProgress from '@mui/material/CircularProgress'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepButton from '@mui/material/StepButton'
import Button from '@mui/material/Button'
import { theme } from './theme'
import axios from 'axios'
import TagSelectReducer from './components/TagTree/reducer'
import initialState from './components/TagTree/initialState'

export default function DataAnalysis() {
  const [refresh, setRefresh] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeStep, setActiveStep] = React.useState(0)
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean
  }>({})
  const [state, dispatch] = React.useReducer(TagSelectReducer, initialState)

  useEffect(() => {
    console.log('index.tsx    state:', state)
  }, [state])

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
    // console.log('handleNext')
    // console.log('active step:', activeStep)

    if (activeStep < 2) {
      const newActiveStep =
        isLastStep() && !allStepsCompleted()
          ? // It's the last step, but not all steps have been completed,
            // find the first step that has been completed
            steps.findIndex((step, i) => !(i in completed))
          : activeStep + 1
      setActiveStep(newActiveStep)
    } else if (activeStep === 2) {
      // the last step
    }
  }

  const onPreprocessing = () => {
    setLoading(true)

    // console.log('state:', state)
    // console.log('explainerVariable:', state.explanatoryVariable)

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
          // console.log('preprocessing response:', response)
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

  useEffect(() => {
    //active Step 이 1인 경우, 선택된 태그 데이터 store에서 가져옴
  }, [activeStep])

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
        <Box>{activeStep === 0 && <FileUploader onUploaded={onUploaded} refresh={refresh} />}</Box>
        <Box>{activeStep === 1 && <VariableSelection onClickNext={handleNext} />}</Box>
        <Box>{activeStep === 2 && <PreProcessing onRefresh={onRefresh} />}</Box>

        <div style={{ width: '400px', float: 'right' }}>
          <Box className="upload_wrapper" style={{ float: 'right', maxWidth: '400px', margin: 'auto' }}>
            {loading ? (
              <CircularProgress style={{ position: 'relative', top: '200px' }} />
            ) : (
              activeStep === 0 && uploaded && <Button onClick={handleNext}>Next</Button>
            )}
          </Box>
        </div>
      </Box>
    </ThemeProvider>
  )
}
