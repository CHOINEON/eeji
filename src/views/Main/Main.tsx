import styled from '@emotion/styled'
import { useMenuList } from './MenuList'

const MainContents = () => {
  const menuList = useMenuList()

  return (
    <>
      <div className="mt-[100px] p-5">
        <MainTitle>Cloud AI EEJI</MainTitle>
        <SubText>
          is a comprehensive AI-driven prediction service tailored for businesses. It features automated AI model
          generation,
        </SubText>
        <SubText>
          provides explanations for results, offers commodity index forecasts to enhance model accuracy, and includes a
          REST API service enabling users to leverage prediction data for insightful decision-making.
        </SubText>

        <div className="flex flex-wrap justify-center gap-8 h-52  my-[50px]">
          {menuList.map((item: any) => {
            return (
              <MenuItem key={item.title}>
                <IconContainer onClick={() => (window.location.href = `/admin${item.path}`)}>
                  <img src={item.icon_src} className="w-full max-w-[150px] h-auto" />
                </IconContainer>
                <TitleContainer>
                  <Title_EN>{item.title}</Title_EN>
                </TitleContainer>
              </MenuItem>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default MainContents

const MainTitle = styled.p`
  font-size: 32px;
  font-family: 'Helvetica Neue';
  text-align: center;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 16px;
  letter-spacing: 1px;
`

const SubText = styled.p`
  font-family: 'Helvetica Neue';
  font-size: 14px;
  text-align: center;
  color: #ffffff;
`

const MenuItem = styled.div`
  width: 210px;
  height: 210px;
  display: flex;
  flex-direction: column;
`

const IconContainer = styled.button`
  display: block;
  margin: auto;
  margin-bottom: 10px;
`
const TitleContainer = styled.div`
  display: block;
  text-align: center;
  margin: 0px 15px;
`

const Title_EN = styled.p`
  font-family: 'ITC Avant Garde Gothic';
  size: 18px;
  color: #ffffff;
  margin: 2px 0;
`

const Title_KR = styled.p`
  font-family: 'Noto Sans';
  size: 12px;
  color: #ffffff;
  margin: 2px 0;
`

// const TextOnCard = styled.div<{ color: string; isSingleLine?: boolean }>`
//   width: 245px;
//   position: absolute;
//   font-family: 'ITC Avant Garde Gothic Pro';
//   top: ${(props) => (props.isSingleLine ? '393px' : '370px')};
//   left: 37.5px;
//   // zindex: 1;
//   font-size: 30px;
//   font-weight: 500;
//   letter-spacing: 2px;
//   // -webkit-text-stroke: 1px ${(props) => props.color};
//   text-shadow: 1px 1px 1px ${(props) => props.color};
//   color: transparent;
//   // color: white;
//   // opacity: 1;
//   text-align: center;
//   @media (max-width: 1400px) {
//     display: none;
//   }
// `

// const SubTextOnCard = styled.div<{ color: string }>`
//   font-family: 'ITC Avant Garde Gothic Pro';
//   position: absolute;
//   width: 100%;
//   bottom: 20px;
//   color: ${(props) => props.color};
//   font-size: 13px;
//   text-align: center;
// `
