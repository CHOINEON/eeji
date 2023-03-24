import { Icon } from '@chakra-ui/react'
import { MdDashboard, MdDatasetLinked, MdSettings } from 'react-icons/md'

// Admin Imports
import MainDashboard from 'views/hmid'
import FoundationStructureAnalysis from 'views/DataAnalysis'

// Auth Imports

const routes = [
  // {
  //   name: "home",
  //   layout: "/admin",
  //   path: "/login",
  //   icon: <Icon as={MdDashboard} width="20px" height="20px" color="inherit" />,
  //   component: Login,
  // },
  {
    name: 'HMID',
    layout: '/admin',
    path: '/hmid',
    icon: <Icon as={MdDashboard} width="20px" height="20px" color="inherit" />,
    component: MainDashboard,
  },
  {
    name: 'Data Analysis',
    layout: '/admin',
    path: '/data-analysis',
    icon: <Icon as={MdDatasetLinked} width="20px" height="20px" color="inherit" />,
    component: FoundationStructureAnalysis,
  },
  {
    name: 'configuration',
    layout: '/admin',
    path: '/configuration',
    icon: <Icon as={MdSettings} width="20px" height="20px" color="inherit" />,
    component: MainDashboard,
  },
]

export default routes
