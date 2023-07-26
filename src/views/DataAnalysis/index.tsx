import React, { useState, useEffect, useReducer } from 'react'
import { Box } from '@chakra-ui/react'
import FileUploader from '../../components/uploader/FileUploader'
import PreProcessing from './PreProcessing'
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

const DataAnalysis = () => {
  // const activeStep = useRecoilValue(stepCountStore)
  // const setActiveStep = useSetRecoilState(stepCountStore)

  const [activeStep, setActiveStep] = useRecoilState(stepCountStore) /*activeStep = 실제step - 1 */
  // const [uploaded, setUploaded] = useState(false)
  const [dataSource, setDataSource] = useState([])
  const [loading, setLoading] = useState(false)
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean
  }>({})

  // const onUploaded = (param: boolean) => {
  //   setUploaded(param)
  // }
  const steps = ['Upload Data', 'View Correlation', 'Select Variables', 'Run/Save Model']

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

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
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

  const onPreprocessed = (args: any) => {
    // console.log('onPreprocess:', args)
    setDataSource(args)
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
        {/* <Box>{activeStep === 0 && <FileUploader refresh={refresh} />}</Box> */}
        <Box>{activeStep === 0 && <DataImport />}</Box>
        <Box>{activeStep === 1 && <CorrelationView />}</Box>
        <Box>{activeStep === 2 && <VariableSelection />}</Box>
        {/* <Box>{activeStep === 2 && <PreProcessing onPreprocessed={onPreprocessed} />}</Box> */}
        <Box>{activeStep === 3 && <ModelSetting dataSource={dataSource} />}</Box>
      </Box>
    </ThemeProvider>
  )
}

export default DataAnalysis
