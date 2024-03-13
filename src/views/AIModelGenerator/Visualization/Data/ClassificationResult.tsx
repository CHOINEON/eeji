import React from 'react'
import FeatureAnalysis from '../Features/FeatureAnalysis'

const ClassificationResult = () => {
  return (
    <>
      <div
        style={{
          // border: '1px solid red',
          width: '68%',
          padding: '5px 30px',
          display: 'block',
          float: 'left',
        }}
      >
        {'여기 내가 작업할 곳 '}
      </div>
      <div style={{ width: '30%', marginTop: '-50px', display: 'inline-block', float: 'left' }}>
        <FeatureAnalysis />
      </div>
    </>
  )
}

export default ClassificationResult
