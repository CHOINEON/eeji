import styled from '@emotion/styled'
import { Select } from 'antd'
import React from 'react'
import CustomTable from 'views/AIModelGenerator/components/Table/CustomTable'
import FeatureAnalysis from '../Features/FeatureAnalysis'

const ClassificationResult = () => {
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
        <CustomTable />
      </div>
      <div style={{ width: '450px', marginTop: '-100px', position: 'absolute', right: '30px', top: '115px' }}>
        <FeatureAnalysis textVisible={false} />
      </div>
    </>
  )
}

export default ClassificationResult
