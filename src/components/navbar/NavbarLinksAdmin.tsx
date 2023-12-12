// Chakra Imports
import {
  Avatar,
  Button,
  Flex,
  Icon,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  useColorMode,
} from '@chakra-ui/react'
// Custom Components
import { ItemContent } from 'components/menu/ItemContent'
import { SearchBar } from 'components/navbar/searchBar/SearchBar'
import { SidebarResponsive } from 'components/sidebar/Sidebar'
import PropTypes from 'prop-types'
import React from 'react'
import styled from '@emotion/styled'
// Assets
import navImage from 'assets/img/layout/Navbar.png'
import { MdLanguage } from 'react-icons/md'
import { IoMdMoon, IoMdSunny } from 'react-icons/io'
import { FaEthereum } from 'react-icons/fa'
import routes from 'routes'

import ico_ko from './img/ico_ko.png'
import ico_jp from './img/ico_jp.png'
import ico_us from './img/ico_us.png'
import BarBg from './img/side_bar_bg.png'

import { useTranslation } from 'react-i18next'

const LangParentBox = styled.div`
  display: flex;
  align-items: center;
`

const LangBox = styled.div`
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-position: center center;
  width: 3vw;
  margin: 0 0.5vw;
  height: 3vw;
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

export default function HeaderLinks(props: { secondary: boolean }) {
  const { secondary } = props
  const { colorMode, toggleColorMode } = useColorMode()
  // Chakra Color Mode
  const navbarIcon = useColorModeValue('gray.400', 'white')
  const menuBg = useColorModeValue('white', 'navy.800')
  const textColor = useColorModeValue('secondaryGray.900', 'white')
  const textColorBrand = useColorModeValue('brand.700', 'brand.400')
  const ethColor = useColorModeValue('gray.700', 'white')
  const borderColor = useColorModeValue('#E6ECFA', 'rgba(135, 140, 189, 0.3)')
  const ethBg = useColorModeValue('secondaryGray.300', 'navy.900')
  const ethBox = useColorModeValue('white', 'navy.800')
  const userBg = useColorModeValue('#4338f7', '#676a68')
  const shadow = useColorModeValue(
    // '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
    '0px 5px 10px #4338F733',
    '14px 17px 40px 4px rgba(112, 144, 176, 0.06)'
  )
  const navbarIconBlue = useColorModeValue('brand.500', 'white')

  const [UserName, setUserName] = React.useState<any>(JSON.parse(window.localStorage.getItem('userData'))[0].user_nm)
  const [UserCompany, setUserCompnay] = React.useState<any>(
    JSON.parse(window.localStorage.getItem('company_info')).com_nm
  )
  const [UserCompanyEmail, setCompanyEmail] = React.useState<any>(
    JSON.parse(window.localStorage.getItem('company_info')).com_email
  )
  const [UserCompanyTel, setCompnayTel] = React.useState<any>(
    JSON.parse(window.localStorage.getItem('company_info')).com_tel
  )

  React.useEffect(() => {
    setUserName(JSON.parse(window.localStorage.getItem('userData'))[0].user_nm)
    setUserCompnay(JSON.parse(window.localStorage.getItem('company_info')).com_nm)
    setCompanyEmail(JSON.parse(window.localStorage.getItem('company_info')).com_email)
    setCompnayTel(JSON.parse(window.localStorage.getItem('company_info')).com_tel)
  }, [window.localStorage])

  const { t, i18n } = useTranslation('main')

  //국가 아이콘 클릭시 default 언어 변경
  const changeLanguage = (e: any) => {
    if (e.target.id !== undefined) {
      i18n.changeLanguage(e.target.id)
      window.localStorage.setItem('Locale', e.target.id)
    }
  }

  const borderButton = useColorModeValue('secondaryGray.500', 'whiteAlpha.200')
  return (
    <Flex
      w={{ sm: '100%', md: 'auto' }}
      alignItems="center"
      flexDirection="row"
      bg={menuBg}
      flexWrap={secondary ? { base: 'wrap', md: 'nowrap' } : 'unset'}
      p="10px"
      borderRadius="30px"
      boxShadow={shadow}
      style={{ backgroundColor: 'rgba(0,0,0,0)', color: '#002D65' }}
    >
      {/* <SearchBar
      
        mb={() => {
          if (secondary) {
            return { base: "10px", md: "unset" };
          }
          return "unset";
        }}
        me="10px"
        borderRadius="30px"
      /> */}
      <Flex
        bg={ethBg}
        display={secondary ? 'flex' : 'none'}
        borderRadius="30px"
        ms="auto"
        p="6px"
        align="center"
        me="6px"
      >
        <Flex align="center" justify="center" bg={ethBox} h="29px" w="29px" borderRadius="30px" me="7px">
          <Icon color={ethColor} w="9px" h="14px" as={FaEthereum} />
        </Flex>
        <Text w="max-content" color={ethColor} fontSize="sm" fontWeight="700" me="6px">
          1,924
          <Text as="span" display={{ base: 'none', md: 'unset' }}>
            {' '}
            ETH
          </Text>
        </Text>
      </Flex>
      <SidebarResponsive routes={routes} />
      {/* <Menu>
        <MenuButton p="0px">
          <Icon
            mt="6px"
            as={MdNotificationsNone}
            color={navbarIcon}
            w="18px"
            h="18px"
            me="10px"
          />
        </MenuButton>
        <MenuList
          boxShadow={shadow}
          p="20px"
          borderRadius="20px"
          bg={menuBg}
          border="none"
          mt="22px"
          me={{ base: "30px", md: "unset" }}
          minW={{ base: "unset", md: "400px", xl: "450px" }}
          maxW={{7 base: "360px", md: "unset" }}
        >
          <Flex w="100%" mb="20px">
            <Text fontSize="md" fontWeight="600" color={textColor}>
              Notifications
            </Text>
            <Text
              fontSize="sm"
              fontWeight="500"
              color={textColorBrand}
              ms="auto"
              cursor="pointer"
            >
              Mark all read
            </Text>
          </Flex>
          <Flex flexDirection="column">
            <MenuItem
              _hover={{ bg: "none" }}
              _focus={{ bg: "none" }}
              px="0"
              borderRadius="8px"
              mb="10px"
            >
              <ItemContent info="Horizon UI Dashboard PRO" />
            </MenuItem>
            <MenuItem
              _hover={{ bg: "none" }}
              _focus={{ bg: "none" }}
              px="0"
              borderRadius="8px"
              mb="10px"
            >
              <ItemContent info="Horizon Design System Free" />
            </MenuItem>
          </Flex>
        </MenuList>
      </Menu> */}

      <Menu>
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

      <Button
        variant="no-hover"
        bg="transparent"
        p="0px"
        minW="unset"
        minH="unset"
        h="18px"
        w="max-content"
        onClick={toggleColorMode}
      >
        <Icon me="10px" h="18px" w="18px" color={navbarIcon} as={colorMode === 'light' ? IoMdMoon : IoMdSunny} />
      </Button>
      <Menu>
        <MenuButton p="0px">
          <Avatar
            _hover={{ cursor: 'pointer' }}
            color="white"
            name={UserName}
            bg={userBg}
            size="sm"
            w="40px"
            h="40px"
          />
        </MenuButton>
        <MenuList boxShadow={shadow} p="0px" mt="10px" borderRadius="20px" bg={menuBg} border="none">
          <Flex w="100%" mb="0px">
            <Text
              ps="20px"
              pt="16px"
              pb="10px"
              w="100%"
              borderBottom="1px solid"
              borderColor={borderColor}
              fontSize="sm"
              fontWeight="700"
              color={textColor}
            >
              👋&nbsp; {'Hey, ' + UserName}
              <Text
                style={{ display: 'block' }}
                as="span"
                ps="3px"
                pt="16px"
                pb="10px"
                w="100%"
                fontSize="sm"
                fontWeight="700"
                color={textColor}
              >
                🏬&nbsp; {UserCompany}
              </Text>
              <Text
                style={{ display: 'block' }}
                as="span"
                ps="3px"
                pt="16px"
                pb="10px"
                w="100%"
                fontSize="sm"
                fontWeight="700"
                color={textColor}
              >
                📧&nbsp; {UserCompanyEmail}
              </Text>
              <Text
                style={{ display: 'block' }}
                as="span"
                ps="3px"
                pt="16px"
                pb="10px"
                w="100%"
                fontSize="sm"
                fontWeight="700"
                color={textColor}
              >
                📞&nbsp; {UserCompanyTel}
              </Text>
            </Text>
          </Flex>
          <Flex flexDirection="column" p="10px">
            {/* <MenuItem
              _hover={{ bg: "none" }}
              _focus={{ bg: "none" }}
              borderRadius="8px"
              px="14px"
            >
              <Text fontSize="sm">Profile Settings</Text>
            </MenuItem>
            <MenuItem
              _hover={{ bg: "none" }}
              _focus={{ bg: "none" }}
              borderRadius="8px"
              px="14px"
            >
              <Text fontSize="sm">Newsletter Settings</Text>
            </MenuItem> */}
            <MenuItem _hover={{ bg: 'none' }} _focus={{ bg: 'none' }} color="red.400" borderRadius="8px" px="14px">
              <Text
                fontSize="sm"
                onClick={() => {
                  window.location.href = '/login'
                }}
              >
                Log out
              </Text>
            </MenuItem>
          </Flex>
        </MenuList>
      </Menu>
    </Flex>
  )
}

HeaderLinks.propTypes = {
  variant: PropTypes.string,
  fixed: PropTypes.bool,
  secondary: PropTypes.bool,
  onOpen: PropTypes.func,
}
