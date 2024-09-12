import { Box } from '@chakra-ui/react'
import { ThemeProvider } from '@mui/material/styles'
import { Spin } from 'antd'
import { useEffect } from 'react'
import TagManager, { DataLayerArgs } from 'react-gtm-module'
import { useTranslation } from 'react-i18next'
import { useRecoilState, useRecoilValue } from 'recoil'
import ModelList from './components/Model/ModelList'
import DataSet from './DataSet'
import ModelGeneratorResult from './ModelGeneratorResult'
import { loadingAtom, stepCountStore } from './store/global/atom'
import './style/styles.css'
import { theme } from './theme/theme'

//TODO: <TabContainer/> 컴포넌트 단순화하기
const AIModelGenerator = () => {
  const { t } = useTranslation()
  const loading = useRecoilValue(loadingAtom)
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
        <Spin tip={t('loading')} size="small" spinning={loading} style={{ top: 300 }}>
          {activeStep === 0 && (
            <div className="h-[500px] block float-left m-auto">
              <div className="w-[500px] float-left">
                <DataSet />
              </div>
              <div className="w-[800px] float-left">
                <ModelList />
              </div>
            </div>
          )}
        </Spin>
        {activeStep === 1 && <ModelGeneratorResult />}
      </Box>
    </ThemeProvider>
  )
}

export default AIModelGenerator
