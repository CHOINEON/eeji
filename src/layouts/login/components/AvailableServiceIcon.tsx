import styled from '@emotion/styled'
import { useMenuList } from 'views/Main/MenuList'

const AvailableServiceIcon = () => {
  const MenuList = useMenuList()

  return (
    <div style={{ display: 'block', float: 'left', marginLeft: '20px' }}>
      <div className="flex flex-wrap justify-start gap-1">
        {MenuList.map((item: any, idx: number) => {
          return (
            <MenuItem key={idx}>
              <IconContainer>
                <img src={item.icon_src} />
              </IconContainer>
              <TitleContainer>
                <Title_EN>{item.title}</Title_EN>
                {/* <Title_KR>{item.title_KR}</Title_KR> */}
              </TitleContainer>
            </MenuItem>
          )
        })}
      </div>
    </div>
  )
}

export default AvailableServiceIcon

const MenuItem = styled.div`
  width: 120px;
  display: flex;
  flex-direction: column;
`

const IconContainer = styled.div`
  display: block;
  width: 75px;
  margin: 5px auto;
`
const TitleContainer = styled.div`
  display: block;
  text-align: center;
`

const Title_EN = styled.p`
  font-family: 'ITC Avant Garde Gothic Light';
  font-size: 9px;
  letter-spacing: 0.02vw;
  color: #ffffff;
  margin: 1px 0;
`
