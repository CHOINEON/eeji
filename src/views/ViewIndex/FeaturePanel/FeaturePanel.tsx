import { Button } from 'antd'
import { useState } from 'react'
import LeadingIndicatorTable from './LeadingIndicatorTable'
import LocalAttrTable from './LocalAttrTable'

const FeaturePanel = () => {
  const [activeTab, setActiveTab] = useState('1')

  return (
    <div>
      <Button type="text" className={`mx-1`} onClick={() => setActiveTab('1')}>
        <h3 className={`text-lg ${activeTab === '1' && 'underline'}`}>Local Attribution</h3>
      </Button>
      |
      <Button type="text" className={`mx-1`} onClick={() => setActiveTab('2')}>
        <h3 className={`text-lg ${activeTab === '2' && 'underline'}`}>Leading Indicator</h3>
      </Button>
      <div>{activeTab === '1' ? <LocalAttrTable /> : <LeadingIndicatorTable />}</div>
    </div>
  )
}

export default FeaturePanel
