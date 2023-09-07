/* eslint-disable prettier/prettier */
import { Icon } from '@chakra-ui/react'
import { MdDashboard, MdSettings, MdOutlineModelTraining, MdDisplaySettings, MdOutlineAnalytics } from 'react-icons/md'
import { BsHammer } from 'react-icons/bs'

// Admin Imports
import MainDashboard from 'views/hmid'
import Configuration from 'views/configuration'
import DashboardConfig from 'views/hmid_config'
import LayoutList from 'views/hmid_list'
import ModelMaintenance from 'views/ModelMaintenance'
import DataAnalysis from 'views/DataAnalysis'
import AIModelManagement from 'views/AIModelManagement'
import HmidInterval from 'views/hmid_interval'
import HmidIntervalD3 from 'views/hmid-interval-d3fc'
// import Anomalyd3chart from 'views/AnomalyDetection/anomaly_d3chart-test'
import Test from 'views/Test/AnomalyTest'
import PriceForecasting from 'views/PriceForecasting'
// Auth Imports

const routes = [
  {
    name: 'Data Analysis',
    layout: '/admin',
    path: '/data-analysis',
    icon: <Icon as={MdOutlineAnalytics} width="20px" height="20px" color="inherit" />,
    component: DataAnalysis,
  },
  {
    name: 'Model Management',
    layout: '/admin',
    path: '/model',
    icon: <Icon as={MdOutlineAnalytics} width="20px" height="20px" color="inherit" />,
    component: AIModelManagement,
  },
  {
    name: 'Price Forecast',
    layout: '/admin',
    path: '/price-forecast',
    icon: <Icon as={MdOutlineAnalytics} width="20px" height="20px" color="inherit" />,
    component: PriceForecasting,
  },
  {
    name: 'MainDashboard-Line',
    layout: '/admin',
    path: '/hmid-interval',
    icon: <Icon as={MdDashboard} width="20px" height="20px" color="inherit" />,
    component: HmidInterval,
  },
  {
    name: 'MainDashboard-D3FC',
    layout: '/admin',
    path: '/hmid-d3fc',
    icon: <Icon as={MdDashboard} width="20px" height="20px" color="inherit" />,
    component: HmidIntervalD3,
  },
  {
    name: 'Anomaly Detection',
    layout: '/admin',
    path: '/anomalyDetection',
    icon: <Icon as={MdDashboard} width="20px" height="20px" color="inherit" />,
    component: Test,
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
