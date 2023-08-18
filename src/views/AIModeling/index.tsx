import React, { useState, useEffect } from 'react'
import ModelList from './ModelList'
import { Box } from '@chakra-ui/react'
import { useRecoilState } from 'recoil'
// import Stepper from '@mui/material/Stepper'
// import Step from '@mui/material/Step'
// import StepButton from '@mui/material/StepButton'
// import { ThemeProvider } from '@mui/material/styles'
// import { theme } from './theme'

const AIModelManagement = () => {
  const steps = ['Select Model', 'Upload Data', 'Test Model']
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean
  }>({})

  return (
    <>
      <Box pt={{ base: '130px', md: '80px', xl: '80px' }} style={{ position: 'relative', zIndex: 1000 }}>
        {' '}
        <ModelList />
      </Box>

      {/* <ThemeProvider theme={theme}>
        <Box pt={{ base: '130px', md: '80px', xl: '80px' }} style={{ position: 'relative', zIndex: 1000 }}>
          <Box margin={5}>
            <Stepper nonLinear activeStep={activeStep}>
              {steps.map((label, index) => (
                <Step key={label} completed={completed[index]}>
                  <StepButton color="inherit" onClick={() => handleStep(index)}>
                    {label}
                  </StepButton>
                </Step>
              ))}
            </Stepper>
          </Box>
          <Box>{activeStep === 0 && <ModelList />}</Box>
          <Box>{activeStep === 1 && <FileUploader />}</Box>
        </Box>
      </ThemeProvider> */}
    </>
  )
}

export default AIModelManagement
