import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Link,
  Menu,
  MenuButton,
  MenuList,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import styled from '@emotion/styled'
import { message } from 'antd'
import UserApi from 'apis/UserApi'
import logoutBtnImage from 'assets/img/icons/logout_off.svg'
import settingOffImage from 'assets/img/icons/setting_off.svg'
import Feedback from 'components/common/Feedback'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { MdLanguage } from 'react-icons/md'
import { useMutation } from 'react-query'
import { useHistory } from 'react-router-dom'
import ico_jp from './img/ico_jp.png'
import ico_ko from './img/ico_ko.png'
import ico_us from './img/ico_us.png'
import Logo from './Logo'
import './style/style.css'

const NavBar = (props: { routes: RoutesType[] }) => {
  const shadow = useColorModeValue(
    // '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
    '0px 5px 10px #4338F733',
    '14px 17px 40px 4px rgba(112, 144, 176, 0.06)'
  )

  const navbarIconBlue = useColorModeValue('brand.500', 'white')
  const menuBg = useColorModeValue('white', 'navy.800')
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

  const { t, i18n } = useTranslation('main')

  //국가 아이콘 클릭시 default 언어 변경
  const changeLanguage = (e: any) => {
    if (e.target.id !== undefined) {
      i18n.changeLanguage(e.target.id)
      window.localStorage.setItem('Locale', e.target.id)
    }
  }

  return (
    <NavBarContainer {...props}>
      <Logo w="100px" color={['primary.500', 'primary.500']} style={{ flexShrink: 0, width: '15%', minWidth: 252 }} />

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
          <Menu z-index="9999">
            <MenuButton p="0px">
              <Icon mt="0px" as={MdLanguage} color={navbarIconBlue} w="20px" h="18px" me="10px" />
            </MenuButton>
            <MenuList
              boxShadow={shadow}
              p="1 vw"
              me={{ base: '30px', md: 'unset' }}
              borderRadius="20px"
              bg={menuBg}
              border="none"
              mt="22px"
              minW={{ base: 'unset' }}
              maxW={{ base: '360px', md: 'unset' }}
            >
              <LangParentBox
                onClick={(e: any) => {
                  changeLanguage(e)
                }}
              >
                <LangKO id="ko-KR" />
                <LangJP id="jp-JP" />
                <LangUS id="us-US" />
              </LangParentBox>
              <Flex flexDirection="column"></Flex>
            </MenuList>
          </Menu>
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
  const { t } = useTranslation()
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
                {t(value.name)}
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

const LangParentBox = styled.div`
  display: flex;
  align-items: center;
`

const LangBox = styled.div`
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-position: center center;
  width: 2vw;
  margin: 0 0.5vw;
  height: 2vw;
  border-radius: 100px;
  cursor: pointer;
  &:hover {
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
  }
`

const LangKO = styled(LangBox)`
  background-image: url(${ico_ko});
`
const LangJP = styled(LangBox)`
  background-image: url(${ico_jp});
`
const LangUS = styled(LangBox)`
  background-image: url(${ico_us});
`
