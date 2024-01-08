import React from 'react'
import { Box, Text } from '@chakra-ui/react'
import LogoHorizontal from 'assets/img/ineeji/logo_horizontal.svg'
import { useHistory } from 'react-router-dom'

export default function Logo(props: any) {
  const history = useHistory()

  const handleLogoClick = () => {
    history.replace('/admin/main')
  }
  return (
    <Box {...props} as="button">
      <img src={LogoHorizontal} onClick={handleLogoClick} />
    </Box>
  )
}
