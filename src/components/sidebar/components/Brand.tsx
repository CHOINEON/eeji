// Chakra imports
import { Flex, useColorModeValue } from '@chakra-ui/react'
import styled from '@emotion/styled'

// Custom components
import ineeji from 'components/sidebar/components/nav_bar_logo.png'
import ineeji_bl from 'components/sidebar/components/nav_bar_logo.png'

const Logo = styled.div<{ colorMode: string }>`
  width: 100%;
  height: 4vw;
  background-position: left 3.3vw bottom 1.3vw;
  background-repeat: no-repeat;
  background-size: auto 65%;
  cursor: pointer;
  ${(props: any) => {
    if (props.colorMode === 'white') {
      return `
      background-image : url(${ineeji});
      `
    } else {
      return `
      background-image : url(${ineeji_bl});
      `
    }
  }};
  border-bottom: 1px solid #efefef;
`

export function SidebarBrand() {
  //   Chakra color mode
  const logoColor = useColorModeValue('navy.700', 'white')
  // console.log(logoColor);

  const ToMain = () => {
    window.location.href = '/home'
  }

  return (
    <Flex alignItems="center" flexDirection="column">
      {/* <HorizonLogo h="26px" w="175px" my="32px" color={logoColor} /> */}
      {/* <HSeparator mb="20px" /> */}
      <Logo onClick={ToMain} colorMode={logoColor} />
    </Flex>
  )
}

export default SidebarBrand
