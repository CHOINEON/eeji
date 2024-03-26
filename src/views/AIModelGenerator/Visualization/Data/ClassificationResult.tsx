import React, { useEffect, useState } from 'react'
import CustomTable from 'views/AIModelGenerator/components/Table/CustomTable'
import FeatureAnalysis from '../Features/FeatureAnalysis'

import view_scatter_off from 'assets/img/dataAnalysis/view_scatter_off.svg'
import view_scatter_on from 'assets/img/dataAnalysis/view_scatter_on.svg'

import view_list_off from 'assets/img/dataAnalysis/view_list_off.svg'
import view_list_on from 'assets/img/dataAnalysis/view_list_on.svg'
import ClassificationChart from '../Chart/ClassificationChart'

const ClassificationResult = () => {
  const [viewType, setViewType] = useState('list') //table or chart

  const handleClick = (param: any) => {
    setViewType(param)
  }

  return (
    <>
      <div
        style={{
          // border: '1px solid red',
          width: '100%',
          padding: '5px 30px',
          display: 'block',
          float: 'left',
        }}
      >
        {/* <div
          className="mr-1.5 group"
          onClick={() => {
            handleLayout(7)
          }}
        >
          <img src={`/img/layout/layout_03_04${layoutType === 7 ? '_on' : ''}.svg`} alt="" className="icon-off" />
          <img src="/img/layout/layout_03_04_on.svg" alt="" className="icon-on" />
        </div> */}
        <div className={`block float-right w-[38%] ${viewType === 'list' ? 'mt-[70px]' : ''}`}>
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
