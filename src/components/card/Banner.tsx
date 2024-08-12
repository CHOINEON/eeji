import packageImg from 'assets/img/ineeji/package@2x.png'
import { styled } from 'styled-components'

const Banner = () => {
  return (
    <BannerContainer>
      <div style={{ width: '30%', height: '100%', float: 'left' }}>
        <img style={{ width: '100%', margin: 'auto', padding: '10px 15px' }} src={packageImg} />
      </div>
      <div style={{ width: '70%', height: '100%', float: 'left', padding: '2px 8px' }}>
        <BannerTitle>INEEJI’s Cloud AI, EEJI</BannerTitle>
        <BannerContents>
          is a time series-based prediction solution for energy saving, helping companies optimize industrial processes
          to improve productivity, reduce production energy costs, and enhance quality.
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
