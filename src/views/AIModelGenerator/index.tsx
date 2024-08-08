import { Box } from '@chakra-ui/react'
import { ThemeProvider } from '@mui/material/styles'
import ToastList from 'components/toast/List'
import { useEffect } from 'react'
import TagManager, { DataLayerArgs } from 'react-gtm-module'
import { useRecoilState } from 'recoil'
import DataSet from './DataSet'
import ModelGeneratorResult from './ModelGeneratorResult'
import ModelList from './components/Model/ModelList'
import { stepCountStore } from './store/global/atom'
import './style/styles.css'
import { theme } from './theme/theme'

//TODO: <TabContainer/> 컴포넌트 단순화하기
const AIModelGenerator = () => {
  const [activeStep, setActiveStep] = useRecoilState(stepCountStore) /*activeStep = 실제step - 1 */

  useEffect(() => {
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

  return (
    <ThemeProvider theme={theme}>
      <Box style={{ position: 'relative', zIndex: 1000 }}>
        {activeStep === 0 && (
          <div className="w-100 h-dvh block float-left">
            <div className="w-2/6 float-left">
              <DataSet />
            </div>
            <div className="w-4/6 min-h-fit block float-left">
              <ModelList />
              <ToastList />
            </div>
          </div>
        )}
        {activeStep === 1 && <ModelGeneratorResult />}
      </Box>
    </ThemeProvider>
  )
}

export default AIModelGenerator
