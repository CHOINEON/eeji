/* eslint-disable prettier/prettier */

// Admin Imports
import AIModelGenerator from 'views/AIModelGenerator'
import ModelGeneratorResult from 'views/AIModelGenerator/ModelGeneratorResult'
import { default as HRCView } from 'views/HRCView/HRCView'
import MainContents from 'views/Main/Main'
import MyPage from 'views/MyPage'
import PriceForecasting from 'views/PriceForecasting/OilPrice'
import ViewIndex from 'views/ViewIndex/Main'
import XAIsimulator from 'views/XAI-simulator'

const routes: RoutesType[] = [
  {
    name: 'Main',
    layout: '/admin',
    path: '/main',
    icon: '',
    component: MainContents,
    widthScreen: true,
  },
  {
    // name: 'AI Model Generator',
    name: 'Studio',
    layout: '/admin',
    path: '/ai-model-generator',
    icon: '',
    component: AIModelGenerator,
    visible: true,
    widthScreen: false,
  },
  {
    name: 'View Model Results',
    layout: '/admin',
    path: '/view-model-results/:id',
    icon: '',
    component: ModelGeneratorResult,
    visible: false,
    widthScreen: false,
  },
  {
    name: 'Explainable AI',
    layout: '/admin',
    path: '/xai-simulator',
    icon: '',
    component: XAIsimulator,
    visible: false,
    widthScreen: false,
  },
  {
    name: 'View XAI Results',
    layout: '/admin',
    path: '/view-xai-results/:id',
    icon: '',
    component: XAIsimulator,
    visible: false,
    widthScreen: false,
  },
  {
    name: 'Index',
    layout: '/admin',
    path: '/price-forecast',
    icon: '',
    component: PriceForecasting,
    visible: true,
    widthScreen: false,
  },
  {
    name: 'My Profile',
    layout: '/admin',
    path: '/mypage',
    icon: '',
    component: MyPage,
    visible: false,
    widthScreen: true,
  },
  {
    name: 'Index v2(beta)',
    layout: '/admin',
    path: '/view-index',
    icon: '',
    component: ViewIndex,
    visible: localStorage.getItem('companyId') === process.env.REACT_APP_INEEJI_COMPANY_ID ? true : false,
    widthScreen: true,
  },
  {
    name: 'HRC Prediction View',
    layout: '/admin',
    path: '/hrc-view',
    icon: '',
    component: HRCView,
    visible: false,
    widthScreen: true,
  },
  /*
    name: 'Prediction API',
    layout: '/admin',
    path: '/api-service',
     icon: '',
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
