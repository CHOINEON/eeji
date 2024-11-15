import FeaturePanel from '../FeaturePanel/FeaturePanel'
import DataSummary from './DataSummary'
import GlobalFeatureImportance from './GlobalFeatureImportance'

const ExplanationPanel = () => {
  return (
    <div>
      <DataSummary />
      <GlobalFeatureImportance />
      <FeaturePanel />
    </div>
  )
}

export default ExplanationPanel
