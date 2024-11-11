import DataSummary from './DataSummary'
import GlobalFeatureImportance from './GlobalFeatureImportance'

const ExplanationPanel = () => {
  return (
    <div>
      <DataSummary />
      <GlobalFeatureImportance />
    </div>
  )
}

export default ExplanationPanel
