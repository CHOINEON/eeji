import { Icon } from '@chakra-ui/react'
import { MdDashboard, MdDatasetLinked, MdSettings } from 'react-icons/md'
import { VscSettings } from 'react-icons/vsc'
import { ImDatabase } from 'react-icons/im'
import { BsHammer } from 'react-icons/bs'
import { FaHourglassHalf } from 'react-icons/fa'

// Admin Imports
import MainDashboard from 'views/hmid'
import FoundationStructureAnalysis from 'views/DataAnalysis'
import DataConnection from 'views/dataConnection'
import DataPlantModeling from 'views/dataPlantModeling'
import AIPlantModeling from 'views/AiPlantModeling'
import Configuration from 'views/configuration'
// import LayoutList from 'views/hmid/list/LayoutList'

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
    name: 'Data Connection',
    layout: '/admin',
    path: '/data-connection',
    icon: <Icon as={ImDatabase} width="20px" height="20px" color="inherit" />,
    component: DataConnection,
  },
  {
    name: 'Data Plant Modeling',
    layout: '/admin',
    path: '/data-plant-modeling',
    icon: <Icon as={BsHammer} width="20px" height="20px" color="inherit" />,
    component: DataPlantModeling,
  },
  {
    name: 'AI Plant Modeling',
    layout: '/admin',
    path: '/ai-plant-modeling',
    icon: <Icon as={FaHourglassHalf} width="20px" height="20px" color="inherit" />,
    component: AIPlantModeling,
  },
  {
    name: 'Data Analysis',
    layout: '/admin',
    path: '/data-analysis',
    icon: <Icon as={MdDatasetLinked} width="20px" height="20px" color="inherit" />,
    component: FoundationStructureAnalysis,
  },
  {
    name: 'HMID',
    layout: '/admin',
    path: '/layoutsetting',
    icon: <Icon as={MdDashboard} width="20px" height="20px" color="inherit" />,
    component: MainDashboard,
    sub: [
      {
        name: 'HMID - LayoutSetting',
        layout: '/admin',
        path: '/layoutsetting',
        icon: <Icon as={VscSettings} width="20px" height="20px" color="inherit" />,
        component: MainDashboard,
      },
    ],
  },
  {
    name: 'Configuration',
    layout: '/admin',
    path: '/configuration',
    icon: <Icon as={MdSettings} width="20px" height="20px" color="inherit" />,
    component: Configuration,
  },
]

export default routes
