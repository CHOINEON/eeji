import { useState } from 'react'
import CustomTable from 'views/AIModelGenerator/components/Table/CustomTable'

import view_scatter_off from 'assets/img/dataAnalysis/view_scatter_off.svg'
import view_scatter_on from 'assets/img/dataAnalysis/view_scatter_on.svg'

import view_list_off from 'assets/img/dataAnalysis/view_list_off.svg'
import view_list_on from 'assets/img/dataAnalysis/view_list_on.svg'
import ClassificationChart from '../Chart/ClassificationChart'
import FeatureAnalysis from '../Features/FeatureAnalysis'

const ClassificationResult = () => {
  const [viewType, setViewType] = useState('list') //table or chart

  const handleClick = (param: any) => {
    setViewType(param)
  }

  return (
    <>
      <div
        style={{
          width: '100%',
          padding: '5px 30px',
          display: 'block',
          float: 'left',
        }}
      >
        <div className={`block float-right w-[42%] ${viewType === 'list' ? 'mt-[70px]' : ''}`}>
          <button className="mr-1" onClick={() => handleClick('list')}>
            <img src={viewType === 'list' ? view_list_on : view_list_off} />
          </button>
          <button className="mr-1">
            <img src={viewType === 'chart' ? view_scatter_on : view_scatter_off} onClick={() => handleClick('chart')} />
          </button>
        </div>
        {viewType === 'list' ? <CustomTable /> : <ClassificationChart />}
      </div>
      <div style={{ width: '450px', marginTop: '-100px', position: 'absolute', right: '30px', top: '115px' }}>
        <FeatureAnalysis textVisible={false} />
      </div>
    </>
  )
}

export default ClassificationResult
