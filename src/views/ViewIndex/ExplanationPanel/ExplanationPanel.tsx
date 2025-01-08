import DataSummary from './DataSummary'
import GlobalFeatureImportance from './GlobalFeatureImportance'

//TODO : tab으로 처리 예정으로 임시 주석 처리
const ExplanationPanel = () => {
  return (
    <div>
      <DataSummary />
      <GlobalFeatureImportance />
      {/* <FeaturePanel />
      <MetricsTable /> */}
    </div>
  )
}

export default ExplanationPanel
