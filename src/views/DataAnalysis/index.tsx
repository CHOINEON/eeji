import React, { useState, useEffect, useReducer, useMemo } from 'react'
import { Box } from '@chakra-ui/react'
import { ThemeProvider } from '@mui/material/styles'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepButton from '@mui/material/StepButton'
import { theme } from './theme/theme'
import { useRecoilState } from 'recoil'
import { stepCountStore } from './store/global/atom'
import DataSet from './DataSet'
import CorrelationView from './CorrelationView'
import './style/styles.css'
import CustomTools from './CustomTools'
import { notification } from 'antd'
// import ModelSetting from './ModelSetting_삭제예정'

const Context = React.createContext({ name: 'Default' })

const DataAnalysis = () => {
  const [api, contextHolder] = notification.useNotification()
  const steps = ['Upload Data', 'Generate model(작업중)']
  const [activeStep, setActiveStep] = useRecoilState(stepCountStore) /*activeStep = 실제step - 1 */
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean
  }>({})

  const openNotification = () => {
    api.info({
      message: `Notification`,
      description: (
        <Context.Consumer>
          {({ name }) => '현재 서버 이전 중으로 일부 기능의 동작이 원활하지 않습니다.'}
        </Context.Consumer>
      ),
    })
  }
  const contextValue = useMemo(() => ({ name: 'Ant Design' }), [])

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

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1

    setActiveStep(newActiveStep)
  }

  const handleStep = (step: number) => () => {
    setActiveStep(step)
    if (step === 1) openNotification()
  }

  // https://mui.com/material-ui/react-stepper/
  return (
    <ThemeProvider theme={theme}>
      <Context.Provider value={contextValue}>
        {contextHolder}
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
          <Box padding={5}>
            {activeStep === 0 && <DataSet />}
            {/* {activeStep === 1 && <CorrelationView />} */}
            {activeStep === 1 && <CustomTools />}

            {/* <Box> {activeStep === 3 && <ModelSetting />}</Box>  */}
          </Box>
        </Box>
      </Context.Provider>
    </ThemeProvider>
  )
}

export default DataAnalysis
