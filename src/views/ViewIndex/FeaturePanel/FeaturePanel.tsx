import { useState } from 'react'
import LeadingIndicatorTable from './LeadingIndicatorTable'
import LocalAttrTable from './LocalAttrTable'

const FeaturePanel = () => {
  const [activeTab, setActiveTab] = useState('1')

  return (
    <div className="m-3 mt-5">
      <div>{activeTab === '1' ? <LocalAttrTable /> : <LeadingIndicatorTable />}</div>
    </div>
  )
}

export default FeaturePanel
