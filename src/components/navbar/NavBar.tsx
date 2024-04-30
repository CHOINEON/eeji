import { Avatar, Box, Button, Flex, HStack, Link, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { message } from 'antd'
import UserApi from 'apis/UserApi'
import logoutBtnImage from 'assets/img/icons/logout_off.svg'
import settingOffImage from 'assets/img/icons/setting_off.svg'
import Feedback from 'components/common/Feedback'
import React from 'react'
import { useMutation } from 'react-query'
import { useHistory } from 'react-router-dom'
import Logo from './Logo'
import './style/style.css'

const NavBar = (props: { routes: RoutesType[] }) => {
  const history = useHistory()
  const { routes } = props

  const userBg = useColorModeValue('#676a68', '#676a68')
  const [UserName, setUserName] = React.useState<any>(
    JSON.parse(window.localStorage.getItem('userData'))[0]?.user_nm || 'TEST'
  )

  const [isOpen, setIsOpen] = React.useState(false)
  const { mutate: mutateLogout } = useMutation(UserApi.logout, {
    onSuccess: (response: any) => {
      message.open({
        type: 'success',
        content: response?.message,
      })
      history.replace('/login')
    },
    onError: (error: any) => {},
  })

  const handleLogout = () => {
    const payload = {
      com_id: localStorage.getItem('companyId'),
      user_id: localStorage.getItem('userId'),
    }
    mutateLogout(payload)
  }

  return (
    <NavBarContainer {...props}>
      <Logo w="100px" color={['primary.500', 'primary.500']} style={{ flexShrink: 0, width: '15%', minWidth: 252 }} />
      {/* <DatasetAddButton
        className="ant-btn ant-btn-primary"
        style={{ display: activeStep === 0 && location.pathname == '/admin/data-analysis' ? 'block' : 'none' }}
        onClick={handleClick}
      >
        <span style={{ marginLeft: '30px', letterSpacing: '0.5px', fontSize: '14px', fontWeight: 500 }}>Upload</span>
        <img style={{ top: '-22px', left: '14px', position: 'relative' }} src={UploadIcon} />
      </DatasetAddButton> */}
      <MenuLinks isOpen={isOpen} routes={routes} style={{ flexGrow: 1 }} />
      <div>
        <HStack spacing="13">
          <Feedback />
          <Button
            backgroundImage={logoutBtnImage}
            backgroundSize="contain"
            size="sm"
            rounded="md"
            bg={'rgba(92, 87, 177, 0.6)'}
            _hover={{
              bg: ['primary.100', 'primary.100', 'primary.600', 'primary.600'],
            }}
            width="82px"
            height="31px"
            onClick={handleLogout}
          ></Button>
          <Button
            backgroundImage={settingOffImage}
            backgroundSize="contain"
            size="sm"
            rounded="md"
            bg={'rgba(92, 87, 177, 0.6)'}
            _hover={{
              bg: ['primary.100', 'primary.100', 'primary.600', 'primary.600'],
            }}
            width="32px"
            height="32px"
          ></Button>
          <Avatar
            _hover={{ cursor: 'pointer' }}
            color="white"
            name={UserName}
            bg={userBg}
            size="sm"
            w="40px"
            h="40px"
          />
        </HStack>
      </div>
    </NavBarContainer>
  )
}

//verifies if routeName is the one active(in browser input)
const activeRoute = (routeName: string) => {
  return location.pathname.includes(routeName)
}

const MenuItem = ({ children, isLast, to, ...rest }: any) => {
  return (
    <Link href={to}>
      <Text
        className="text-menu"
        display="block"
        {...rest}
        opacity={activeRoute(to.toLowerCase()) ? 1 : 0.5}
        fontWeight={activeRoute(to.toLowerCase()) ? 'bold' : 'normal'}
        letterSpacing="0.5px"
        fontSize={15}
        fontFamily="Helvetica Neue"
        // color={activeRoute(to.toLowerCase()) ? activeColor : inactiveColor}
      >
        {children}
      </Text>
    </Link>
  )
}

const MenuLinks = ({ isOpen, routes }: any) => {
  return (
    <Box display={{ base: isOpen ? 'block' : 'none', md: 'block' }} flexBasis={{ base: '100%', md: 'auto' }}>
      <Stack
        spacing={8}
        align="center"
        justify={['center', 'space-between', 'flex-end', 'flex-end']}
        direction={['column', 'row', 'row', 'row']}
        pt={[4, 4, 0, 0]}
      >
        {routes.map((value: any, i: number) => {
          if (value.path !== '/main')
            return (
              <MenuItem key={i} to={value.layout + value.path}>
                {value.name}
              </MenuItem>
            )
        })}
      </Stack>
    </Box>
  )
}

const NavBarContainer = ({ children, ...props }: any) => {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="nowrap"
      w="100%"
      h="5vh"
      p={8}
      bg={'#242185'}
      color={['white', 'white', 'primary.700', 'primary.700']}
      background={'linear-gradient( to left, #332bbf, #000000 )'}
      {...props}
    >
      {children}
    </Flex>
  )
}
export default NavBar

const DatasetAddButton = styled.button`
  width: 140px;
  height: 35px;
  padding: 5px 3px 5px 0;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  color: #fff !important;
  background-color: #4338f7;
  box-shadow: 0 2px 0 rgba(55, 5, 255, 0.06);
  margin-bottom: 20px;
`
