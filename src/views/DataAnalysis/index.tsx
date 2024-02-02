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
import './style/styles.css'
import { notification } from 'antd'
import TempDataAnalysis from 'views/NewDataAnalysis/TempDataAnalysis'
import { importModalAtom } from './store/modal/atom'
import UploadIcon from 'assets/img/ineeji/ico_upload_mini.svg'
import styled from '@emotion/styled'

const Context = React.createContext({ name: 'Default' })

const DataAnalysis = () => {
  const [api, contextHolder] = notification.useNotification()
  const steps = ['Upload Data', 'Data Analysis']
  const [activeStep, setActiveStep] = useRecoilState(stepCountStore) /*activeStep = 실제step - 1 */
  const [importOpen, setImportOpen] = useRecoilState(importModalAtom)
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

  useEffect(() => {
    setActiveStep(0)
  }, [])

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

  //버튼 컴포넌트

  const handleClick = () => {
    setImportOpen(true)
  }

  // https://mui.com/material-ui/react-stepper/
  return (
    <ThemeProvider theme={theme}>
      <Context.Provider value={contextValue}>
        {contextHolder}
        <Box style={{ height: '20px', float: 'right' }}>
          {/* <DatasetAddButton
            className="ant-btn ant-btn-primary"
            style={{ display: activeStep === 0 && location.pathname == '/admin/data-analysis' ? 'block' : 'none' }}
            onClick={handleClick}
          >
            <span
              style={{
                marginLeft: '30px',
                letterSpacing: '0.5px',
                fontSize: '14px',
                fontWeight: 500,
                color: 'white',
              }}
            >
              Upload
            </span>
            <img style={{ top: '-22px', left: '14px', position: 'relative' }} src={UploadIcon} />
          </DatasetAddButton> */}
        </Box>
        <Box style={{ position: 'relative', zIndex: 1000 /**pt={{ base: '130px', md: '80px', xl: '80px' }} */ }}>
          <Box>
            <Stepper nonLinear activeStep={activeStep} style={{ display: 'none' }}>
              {steps.map((label, index) => (
                <Step key={label} completed={completed[index]}>
                  <StepButton color="inherit" onClick={handleStep(index)}>
                    {label}
                  </StepButton>
                </Step>
              ))}
            </Stepper>
          </Box>
          <Box style={{ margin: '10px 8px' }}>
            {activeStep === 0 && <DataSet />}
            {/* {activeStep === 1 && <CorrelationView />} */}
            {activeStep === 1 && <TempDataAnalysis />}

            {/* <Box> {activeStep === 3 && <ModelSetting />}</Box>  */}
          </Box>
        </Box>
      </Context.Provider>
    </ThemeProvider>
  )
}

export default DataAnalysis

const DatasetAddButton = styled.button`
  width: 140px;
  height: 35px;
  padding: 5px 3px 5px 0;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  color: #fff !important;
  background-color: #4338f7;
  box-shadow: 0 2px 0 rgba(55, 5, 255, 0.06);
`
