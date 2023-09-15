import React, { useState, useEffect, useReducer } from 'react'
import { Box } from '@chakra-ui/react'
import ModelSetting from './ModelSetting'
import { ThemeProvider } from '@mui/material/styles'
import VariableSelection from './VariableSelection'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepButton from '@mui/material/StepButton'
import { theme } from './theme/theme'
import { useRecoilState } from 'recoil'
import { stepCountStore } from './store/atom'
import DataImport from './DataSet'
import CorrelationView from './CorrelationView'
import './style/styles.css'
import OptionSetting from './OptionSetting'

const DataAnalysis = () => {
  const steps = ['Upload Data', 'View Correlation', 'Select Variables', 'Run/Save Model']
  const [activeStep, setActiveStep] = useRecoilState(stepCountStore) /*activeStep = 실제step - 1 */
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean
  }>({})

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
        <Box padding={5}>
          {activeStep === 0 && <DataImport />}
          {activeStep === 1 && <CorrelationView />}
          <Box>{activeStep === 2 && <VariableSelection />}</Box>
          {/* {activeStep === 2 && <OptionSetting />} */}
          {activeStep === 3 && <ModelSetting />}
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default DataAnalysis
