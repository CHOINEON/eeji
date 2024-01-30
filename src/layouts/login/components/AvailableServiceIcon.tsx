import { Wrap } from '@chakra-ui/react'
import styled from '@emotion/styled'
import React from 'react'
import { MenuList } from 'views/Main/menuList'

const AvailableServiceIcon = () => {
  return (
    <div style={{ display: 'block', float: 'left', marginLeft: '20px' }}>
      <Wrap spacing="1px" justify="left">
        {MenuList.map((item: any) => {
          return (
            <MenuItem>
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
      </Wrap>
    </div>
  )
}

export default AvailableServiceIcon

const MenuItem = styled.div`
  width: 110px;
  height: 90px;
  display: flex;
  flex-direction: column;
`

const IconContainer = styled.div`
  display: block;
  width: 75px;
  height: 75px;
  margin: auto;
`
const TitleContainer = styled.div`
  display: block;
  text-align: center;
  margin: 10px 0px;
`

const Title_EN = styled.p`
  font-family: 'ITC Avant Garde Gothic';
  font-size: 9px;
  color: #ffffff;
  margin: 2px 0;
`

const Title_KR = styled.p`
  font-family: 'Noto Sans';
  size: 12px;
  color: #ffffff;
  margin: 2px 0;
`
