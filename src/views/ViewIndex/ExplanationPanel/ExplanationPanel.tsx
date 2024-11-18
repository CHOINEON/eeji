import FeaturePanel from '../FeaturePanel/FeaturePanel'
import MetricsTable from '../PerformancePanel/MetricsTable'
import DataSummary from './DataSummary'
import GlobalFeatureImportance from './GlobalFeatureImportance'

const ExplanationPanel = () => {
  return (
    <div>
      <DataSummary />
      <GlobalFeatureImportance />
      <FeaturePanel />
      <MetricsTable />
    </div>
  )
}

export default ExplanationPanel
