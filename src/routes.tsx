/* eslint-disable prettier/prettier */
import { Icon } from '@chakra-ui/react'
import { MdDashboard, MdSettings, MdOutlineModelTraining, MdDisplaySettings, MdOutlineAnalytics } from 'react-icons/md'

// Admin Imports
import Configuration from 'views/configuration'
import DataAnalysis from 'views/DataAnalysis'
import Test from 'views/ImportChart/AnomalyChartImport'
import PriceForecasting from 'views/PriceForecasting/OilPrice'
import AIModelManagement from 'views/AIModelManagement'
import MainDashboard from 'views/hmid'
import DashboardConfig from 'views/hmid_config'
import LayoutList from 'views/hmid_list'
import ModelMaintenance from 'views/ModelMaintenance'
import HmidIntervalD3 from 'views/hmid-interval-d3fc'
// import Anomalyd3chart from 'views/AnomalyDetection/anomaly_d3chart-test'
import HmidInterval from 'views/hmid_interval'
import PriceDetection from 'views/AnomalyDetection/PriceDetection.tsx'
import XAIsimulator from 'views/DataAnalysis/components/Unused/XAIsimulator'
import TempDataAnalysis from 'views/NewDataAnalysis/TempDataAnalysis'
import Main from 'views/Main'

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
    name: 'Main',
    layout: '/admin',
    path: '/main',
    icon: <Icon as={MdOutlineAnalytics} width="20px" height="20px" color="inherit" />,
    component: Main,
  },
  // {
  //   name: 'Anomaly Detection',
  //   layout: '/admin',
  //   path: '/anomalyDetection',
  //   icon: <Icon as={MdOutlineAnalytics} width="20px" height="20px" color="inherit" />,
  //   component: Test,
  // },
  {
    name: 'Price Forecasting',
    layout: '/admin',
    path: '/price-forecast',
    icon: <Icon as={MdOutlineAnalytics} width="20px" height="20px" color="inherit" />,
    component: PriceForecasting,
  },

  // {
  //   name: 'Configuration',
  //   layout: '/admin',
  //   path: '/configuration',
  //   icon: <Icon as={MdSettings} width="20px" height="20px" color="inherit" />,
  //   component: Configuration,
  // },
  // {
  //   name: 'XAI',
  //   layout: '/admin',
  //   path: '/xai-simulator',
  //   icon: <Icon as={MdOutlineModelTraining} width="20px" height="20px" color="inherit" />,
  //   component: XAIsimulator,
  // },
  // {
  //   name: 'New DataAnalysis',
  //   layout: '/admin',
  //   path: '/temp-data-analysis',
  //   icon: <Icon as={MdOutlineModelTraining} width="20px" height="20px" color="inherit" />,
  //   component: TempDataAnalysis,
  // },

  // {
  //   name: 'MainDashboard-Line',
  //   layout: '/admin',
  //   path: '/hmid-interval',
  //   icon: <Icon as={MdDashboard} width="20px" height="20px" color="inherit" />,
  //   component: HmidInterval,
  // },
  // {
  //   name: 'MainDashboard-D3FC',
  //   layout: '/admin',
  //   path: '/hmid-d3fc',
  //   icon: <Icon as={MdDashboard} width="20px" height="20px" color="inherit" />,
  //   component: HmidIntervalD3,
  // },
  // {
  //   name: 'Anomaly Detection_BTC',
  //   layout: '/admin',
  //   path: '/anomalyDetectionBTC',
  //   icon: <Icon as={MdDashboard} width="20px" height="20px" color="inherit" />,
  //   component: PriceDetection,
  // },
  // {
  //   name: 'HMID Configuration',
  //   layout: '/admin',
  //   path: '/layout-list',
  //   icon: <Icon as={MdDisplaySettings} width="20px" height="20px" color="white" />,
  //   component: LayoutList,
  // },
  // {
  //   name: 'HMID Configuration',
  //   layout: '/admin',
  //   path: '/layout-configuration',
  //   icon: <Icon as={MdDisplaySettings} width="20px" height="20px" color="white" />,
  //   component: DashboardConfig,
  // },
  // {
  //   name: 'Model Maintenance',
  //   layout: '/admin',
  //   path: '/model-maintenance',
  //   icon: <Icon as={MdOutlineModelTraining} width="20px" height="20px" color="inherit" />,
  //   component: ModelMaintenance,
  // },
]

export default routes
