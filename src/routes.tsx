import { Icon } from '@chakra-ui/react'
import { MdDashboard, MdDatasetLinked, MdSettings, MdOutlineModelTraining, MdDisplaySettings } from 'react-icons/md'
import { ImDatabase } from 'react-icons/im'
import { BsHammer } from 'react-icons/bs'
import { FaHourglassHalf } from 'react-icons/fa'

// Admin Imports
import MainDashboard from 'views/hmid'
import Configuration from 'views/configuration'
import DashboardConfig from 'views/hmid_config'
import LayoutList from 'views/hmid_list'
import ModelMaintenance from 'views/ModelMaintenance'
import DataAnalysis from 'views/DataAnalysis'

import HmidInterval from 'views/hmid_interval'
import HmidIntervalD3 from 'views/hmid-interval-d3fc'
import AIModeling from 'views/AIModeling'

// Auth Imports

const routes = [
  {
    name: 'Data Analysis',
    layout: '/admin',
    path: '/data-analysis',
    icon: <Icon as={BsHammer} width="20px" height="20px" color="inherit" />,
    component: DataAnalysis,
  },
  //잠시 주석
  // {
  //   name: 'HMID',
  //   layout: '/admin',
  //   path: '/maindashboard',
  //   icon: <Icon as={MdDashboard} width="20px" height="20px" color="inherit" />,
  //   component: MainDashboard,
  // },
  // {
  //   name: 'ChartTest',
  //   layout: '/admin',
  //   path: '/chartTest',
  //   icon: <Icon as={MdDashboard} width="20px" height="20px" color="inherit" />,
  //   component: ChartTest,
  // },
  // 잠시 주석
  // {
  //   name: 'MainDashboard-WS',
  //   layout: '/admin',
  //   path: '/hmid-ws',
  //   icon: <Icon as={MdDashboard} width="20px" height="20px" color="inherit" />,
  //   component: MainDashboard,
  // },
  {
    name: 'MainDashboard',
    layout: '/admin',
    path: '/hmid-interval',
    icon: <Icon as={MdDashboard} width="20px" height="20px" color="inherit" />,
    component: HmidInterval,
  },
  {
    name: 'MainDashboard - d3fc',
    layout: '/admin',
    path: '/hmid-d3fc',
    icon: <Icon as={MdDashboard} width="20px" height="20px" color="inherit" />,
    component: HmidIntervalD3,
  },
  {
    name: 'HMID Configuration',
    layout: '/admin',
    path: '/layout-list',
    icon: <Icon as={MdDisplaySettings} width="20px" height="20px" color="white" />,
    component: LayoutList,
  },
  {
    name: 'HMID Configuration',
    layout: '/admin',
    path: '/layout-configuration',
    icon: <Icon as={MdDisplaySettings} width="20px" height="20px" color="white" />,
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
