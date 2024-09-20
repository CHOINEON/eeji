/* eslint-disable @typescript-eslint/no-loss-of-precision */
import { useEffect } from 'react'
import TagManager, { DataLayerArgs } from 'react-gtm-module'
import { useRecoilState, useResetRecoilState } from 'recoil'
import { xaiResultStore } from './store/analyze/atom'
import UploadPage from './UploadPage'
import XaiAnalysisResult from './XaiAnalysisResult'

const XAIsimulator = () => {
  const [analysisResult, setAnalysisResult] = useRecoilState(xaiResultStore)
  const resetAnalysisResult = useResetRecoilState(xaiResultStore)

  useEffect(() => {
    resetAnalysisResult()

    const args: DataLayerArgs = {
      dataLayer: {
        event: 'virtualPageView',
        pageUrl: '/xai-simulator',
        pageTitle: 'XAI',
        user_id: localStorage.getItem('userId'),
      },
    }
    TagManager.dataLayer(args)
  }, [])

  return (
    <>
      {analysisResult?.feature_length > 0 ? (
        <XaiAnalysisResult />
      ) : (
        <div className="relative w-full h-full">
          <UploadPage />
        </div>
      )}
    </>
  )
}

export default XAIsimulator
