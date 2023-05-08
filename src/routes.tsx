import { Icon } from '@chakra-ui/react'
import { MdDashboard, MdDatasetLinked, MdSettings, MdOutlineModelTraining } from 'react-icons/md'
import { ImDatabase } from 'react-icons/im'
import { BsHammer } from 'react-icons/bs'
import { FaHourglassHalf } from 'react-icons/fa'

// Admin Imports
import MainDashboard from 'views/hmid'
import FoundationStructureAnalysis from 'views/DataAnalysis/PreProcessing'
import DataConnection from 'views/dataConnection'
// import DataPlantModeling from 'views/dataPlantModeling'
import AIPlantModeling from 'views/AiPlantModeling'
import Configuration from 'views/configuration'
import DashboardConfig from 'views/hmid_config'
import LayoutList from 'views/hmid_list'
import ModelMaintenance from 'views/ModelMaintenance'
import DataAnalysis from 'views/DataAnalysis'
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
  // {
  //   name: 'Data Connection',
  //   layout: '/admin',
  //   path: '/data-connection',
  //   icon: <Icon as={ImDatabase} width="20px" height="20px" color="inherit" />,
  //   component: DataConnection,
  // },
  {
    name: 'Data Analysis',
    layout: '/admin',
    path: '/data-analysis',
    icon: <Icon as={BsHammer} width="20px" height="20px" color="inherit" />,
    component: DataAnalysis,
  },
  // {
  //   name: 'AI Plant Modeling',
  //   layout: '/admin',
  //   path: '/ai-plant-modeling',
  //   icon: <Icon as={FaHourglassHalf} width="20px" height="20px" color="inherit" />,
  //   component: AIPlantModeling,
  // },
  // {
  //   name: 'Data Analysis',
  //   layout: '/admin',
  //   path: '/data-analysis',
  //   icon: <Icon as={MdDatasetLinked} width="20px" height="20px" color="inherit" />,
  //   component: FoundationStructureAnalysis,
  // },
  {
    name: 'HMID',
    layout: '/admin',
    path: '/maindashboard',
    icon: <Icon as={MdDashboard} width="20px" height="20px" color="inherit" />,
    component: MainDashboard,
  },
  {
    name: 'HMID Configuration',
    layout: '/admin',
    path: '/layout-list',
    icon: <Icon as={MdDashboard} width="20px" height="20px" color="inherit" />,
    component: LayoutList,
  },
  {
    name: 'HMID Configuration',
    layout: '/admin',
    path: '/layout-configuration',
    icon: <Icon as={MdDashboard} width="20px" height="20px" color="inherit" />,
    component: DashboardConfig,
  },
  {
    name: 'Model Maintenance',
    layout: '/admin',
    path: '/model-maintenance',
    icon: <Icon as={MdOutlineModelTraining} width="20px" height="20px" color="inherit" />,
    component: ModelMaintenance,
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
