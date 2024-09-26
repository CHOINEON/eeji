import Feedback from 'components/common/Feedback'
import { useTranslation } from 'react-i18next'
import Faq from './Faq'
import LanguageBox from './LanguageBox'
import Logo from './Logo'
import Logout from './Logout'
import UserProfile from './UserProfile'

const MenuLinks = ({ routes }: any) => {
  const { t } = useTranslation()

  //verifies if routeName is the one active(in browser input)
  const activeRoute = (routeName: string) => {
    return location.pathname.includes(routeName)
  }
  const MenuItem = ({ children, isLast, to, ...rest }: any) => {
    return (
      <a
        href={to}
        {...rest}
        className={`block ${
          activeRoute(to.toLowerCase()) ? 'font-bold opacity-100' : 'font-normal opacity-50'
        } text-sm tracking-wide`}
      >
        {children}
      </a>
    )
  }

  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0 md:space-x-8">
      {routes.map((value: any, i: number) => {
        if (value.path !== '/main') {
          return (
            <MenuItem key={i} to={value.layout + value.path}>
              {t(value.name)}
            </MenuItem>
          )
        }
      })}
    </div>
  )
}

const Header = (props: { routes: RoutesType[] }) => {
  const { routes } = props

  return (
    <div className="w-[1280px] m-auto">
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
          <UserProfile />
        </div>
      </nav>
    </div>
  )
}

export default Header
