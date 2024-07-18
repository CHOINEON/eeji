import { Box } from '@chakra-ui/react'
import Step from '@mui/material/Step'
import StepButton from '@mui/material/StepButton'
import Stepper from '@mui/material/Stepper'
import { ThemeProvider } from '@mui/material/styles'
import { notification } from 'antd'
import React, { useEffect, useMemo } from 'react'
import TagManager, { DataLayerArgs } from 'react-gtm-module'
import { useRecoilState } from 'recoil'
import DataSet from './DataSet'
import ModelList from './components/Model/ModelList'
import { stepCountStore } from './store/global/atom'
import './style/styles.css'
import { theme } from './theme/theme'

const Context = React.createContext({ name: 'Default' })

const AIModelGenerator = () => {
  const [api, contextHolder] = notification.useNotification()
  const steps = ['Upload Data', 'Data Analysis']
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

  useEffect(() => {
    //개발중
    setActiveStep(0)

    const args: DataLayerArgs = {
      dataLayer: {
        event: 'virtualPageView',
        pageUrl: '/ai-model-generator',
        pageTitle: 'AI Model Generator',
        user_id: localStorage.getItem('userId'),
      },
    }
    TagManager.dataLayer(args)
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

  // https://mui.com/material-ui/react-stepper/
  return (
    <ThemeProvider theme={theme}>
      <Context.Provider value={contextValue}>
        {contextHolder}
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
          <div className="h-[800px] border">
            <div className="w-3/6 h-full border block float-left">
              <DataSet />
            </div>
            <div className="w-3/6 h-full border block float-left">
              {' '}
              <ModelList />
            </div>
            {/* {activeStep === 1 && <TabContainer />} */}
          </div>
        </Box>
      </Context.Provider>
    </ThemeProvider>
  )
}

export default AIModelGenerator
