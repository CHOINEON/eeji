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
      <div className="relative z-[1000]">
        <Spin tip={t('loading')} size="small" spinning={loading} style={{ top: 300 }}>
          {activeStep === 0 && (
            <div className="h-[500px] flex">
              <div className="w-[500px]">
                <DataSet />
              </div>
              <div className="w-[780px]">
                <ModelList />
              </div>
            </div>
          )}
        </Spin>
        {activeStep === 1 && <ModelGeneratorResult />}
      </div>
    </ThemeProvider>
  )
}

export default AIModelGenerator
