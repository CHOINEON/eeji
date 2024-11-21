import icon_01_inbox from 'assets/img/icons/main/service_01.png'
import icon_03_inbox from 'assets/img/icons/main/service_03.png'

import icon_01_b from 'assets/img/icons/main/icon_01_b.png'
import icon_03_b from 'assets/img/icons/main/icon_03_b.png'
import { useTranslation } from 'react-i18next'

export const useMenuList = () => {
  const { t } = useTranslation()

  const Menu: Array<any> = [
    {
      id: 1,
      title: t('Studio'),
      // title_KR: 'AI 모델 생성',
      icon_src: icon_01_b,
      icon_inbox: icon_01_inbox,
      img_url: 'assets/img/icons/main/service_01.png',
      img_hover_url: 'assets/img/icons/main/icon_01_b.png',
      path: '/ai-model-generator',
    },
    /*
    {
      id: 2,
      title: t('Explainable AI'),
      // title_KR: '설명가능 인공지능',
      icon_src: icon_02_b,
      icon_inbox: icon_02_inbox,
      img_url: 'assets/img/icons/main/service_02.png',
      img_hover_url: 'assets/img/icons/main/icon_02_b.png',
      path: '/xai-simulator',
    },
    */
    {
      id: 2,
      title: t('Index'),
      // title_KR: '주요 경제 지표 예측',
      icon_src: icon_03_b,
      icon_inbox: icon_03_inbox,
      img_url: 'assets/img/icons/main/service_03.png',
      img_hover_url: 'assets/img/icons/main/icon_03_b.png',
      path: '/price-forecast',
    },
    /*
    {
      id: 4,
      title: t('Prediction API'),
      // title_KR: 'REST API 서비스',
      icon_src: icon_04_b,
      icon_inbox: icon_04_inbox,
      img_url: 'assets/img/icons/main/service_04.png',
      img_hover_url: 'assets/img/icons/main/icon_04_b.png',
      path: '/api-service',
    },
    */
  ]
  return Menu
}

export default useMenuList
