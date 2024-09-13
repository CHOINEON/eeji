/* eslint-disable prettier/prettier */
import { Icon } from '@chakra-ui/react'
import { MdOutlineAnalytics, MdOutlineModelTraining } from 'react-icons/md'

// Admin Imports
import AIModelGenerator from 'views/AIModelGenerator'
import MainContents from 'views/Main/Main'
import PriceForecasting from 'views/PriceForecasting/OilPrice'
import XAIsimulator from 'views/XAI-simulator'

// Auth Imports

const routes = [
  {
    name: 'Main',
    layout: '/admin',
    path: '/main',
    icon: <Icon as={MdOutlineAnalytics} width="20px" height="20px" color="inherit" />,
    component: MainContents,
  },
  {
    name: 'AI Model Generator',
    layout: '/admin',
    path: '/ai-model-generator',
    icon: <Icon as={MdOutlineAnalytics} width="20px" height="20px" color="inherit" />,
    component: AIModelGenerator,
  },
  {
    name: 'Explainable AI',
    layout: '/admin',
    path: '/xai-simulator',
    icon: <Icon as={MdOutlineModelTraining} width="20px" height="20px" color="inherit" />,
    component: XAIsimulator,
  },
  {
    name: 'Commodity Index Forecast',
    layout: '/admin',
    path: '/price-forecast',
    icon: <Icon as={MdOutlineAnalytics} width="20px" height="20px" color="inherit" />,
    component: PriceForecasting,
  },
  /*
  {
    name: 'Prediction API',
    layout: '/admin',
    path: '/api-service',
    icon: <Icon as={MdOutlineAnalytics} width="20px" height="20px" color="inherit" />,
    component: ApiService,
  },
  */

  // {
  //   name: 'Configuration',
  //   layout: '/admin',
  //   path: '/configuration',
  //   icon: <Icon as={MdSettings} width="20px" height="20px" color="inherit" />,
  //   component: Configuration,
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
