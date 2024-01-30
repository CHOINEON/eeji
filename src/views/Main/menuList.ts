import icon_ModelGenerator from 'assets/img/icons/menu_01_AI_modelGenerator.svg'
import icon_Xai from 'assets/img/icons/menu_02_xai.svg'
import icon_IndexForecast from 'assets/img/icons/menu_03_IndexForecast.svg'
import icon_PredictionApi from 'assets/img/icons/menu_04_PredictionApi.svg'

export const MenuList = [
  {
    id: 1,
    title: 'AI Model Generator',
    title_KR: 'AI 모델 생성',
    icon_src: icon_ModelGenerator,
    path: '/data-analysis',
  },
  {
    id: 2,
    title: 'Explainable AI',
    title_KR: '설명가능 인공지능',
    icon_src: icon_Xai,
    path: '/xai-simulator',
  },
  {
    id: 3,
    title: 'Commodity Price Forecast',
    title_KR: '주요 경제 지표 예측',
    icon_src: icon_IndexForecast,
    path: '/price-forecast',
  },
  {
    id: 4,
    title: 'Prediction API',
    title_KR: 'REST API 서비스',
    icon_src: icon_PredictionApi,
    path: '/api-service',
  },
]
