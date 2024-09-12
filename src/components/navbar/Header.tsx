import { Link, Stack, Text } from '@chakra-ui/react'
import Feedback from 'components/common/Feedback'
import { useTranslation } from 'react-i18next'
import Faq from './Faq'
import LanguageBox from './LanguageBox'
import Logo from './Logo'
import Logout from './Logout'

const MenuLinks = ({ routes }: any) => {
  const { t } = useTranslation()

  //verifies if routeName is the one active(in browser input)
  const activeRoute = (routeName: string) => {
    return location.pathname.includes(routeName)
  }

  const MenuItem = ({ children, isLast, to, ...rest }: any) => {
    return (
      <Link href={to}>
        <Text
          // className="text-menu"
          display="block"
          {...rest}
          opacity={activeRoute(to.toLowerCase()) ? 1 : 0.5}
          fontWeight={activeRoute(to.toLowerCase()) ? 'bold' : 'normal'}
          letterSpacing="0.5px"
          fontSize={13}
          fontFamily="Helvetica Neue"
          // color={activeRoute(to.toLowerCase()) ? activeColor : inactiveColor}
        >
          {children}
        </Text>
      </Link>
    )
  }

  return (
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
  )
}

const Header = (props: { routes: RoutesType[] }) => {
  const { routes } = props

  return (
    <div className="w-[1280px] mx-[30px]">
      <nav className="h-16 text-white flex justify-between items-center px-8">
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <Logo w="100px" color={['primary.500', 'primary.500']} style={{ flexShrink: 0, width: 252 }} />
        </div>

        {/* Center: Menu */}
        <div className="flex space-x-8">
          <MenuLinks routes={routes} />
        </div>

        {/* Right: Buttons */}
        <div className="flex space-x-4">
          <Faq />
          <LanguageBox />
          <Logout />
          <Feedback />
        </div>
      </nav>
    </div>
  )
}

export default Header
