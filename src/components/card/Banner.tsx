import React from 'react'
import { styled } from 'styled-components'
import packageImg from 'assets/img/ineeji/package@2x.png'

const Banner = () => {
  return (
    <BannerContainer>
      <div style={{ width: '30%', height: '100%', float: 'left' }}>
        <img style={{ width: '100%', margin: 'auto', padding: '10px 15px' }} src={packageImg} />
      </div>
      <div style={{ width: '70%', height: '100%', float: 'left', padding: '2px 8px' }}>
        <BannerTitle>INEEJI’s INFINITE OPTIMAL SERIES™</BannerTitle>
        <BannerContents>
          is Prediction solution for ENERGY SAVING based on time series data that enables companies to realize
          productivity improvement, production energy cost reduction, and quality improvement through process
          optimization of industrial processes.
        </BannerContents>
      </div>
    </BannerContainer>
  )
}

export default Banner

const BannerContainer = styled.div`
  display: inline-block;
  width: 100%;
  height: 100px;
  border: 1px solid #d7dae0;
  border-radius: 10px;
`

const BannerTitle = styled.p`
  color: #002d65;
  font-weight: bold;
  margin-top: 5px;
  margin-bottom: 3px;
`

const BannerContents = styled.p`
  color: #002d65;
  font-size: 9px;
  line-height: 11px;
`
