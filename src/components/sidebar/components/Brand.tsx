// Chakra imports
import { Flex, useColorModeValue } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { HSeparator } from 'components/separator/Separator'

// Custom components
import ineeji from 'components/sidebar/components/nav_bar_logo.png'
import ineeji_bl from 'components/sidebar/components/nav_bar_logo.png'

const Logo = styled.div<{ colorMode: string }>`
  width: 100%;
  height: 85px;
  background-repeat: no-repeat;
  margin-left: 20%;
  margin-top: 1%;
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
  // border-bottom: 1px solid #efefef;
`

export function SidebarBrand() {
  //   Chakra color mode
  const logoColor = useColorModeValue('navy.700', 'white')
  // console.log(logoColor);

  const ToMain = () => {
    window.location.href = '/home'
  }

  return (
    <Flex alignItems="center" flexDirection="column" justifyContent="center">
      {/* <HorizonLogo h="26px" w="175px" my="32px" color={logoColor} /> */}
      <Logo onClick={ToMain} colorMode={logoColor} />
      <HSeparator mb="10px" />
    </Flex>
  )
}

export default SidebarBrand
