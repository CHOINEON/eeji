import { useEffect } from 'react'
import TagManager, { DataLayerArgs } from 'react-gtm-module'
import Page from './page'

const PriceForecasting = () => {
  useEffect(() => {
    const args: DataLayerArgs = {
      dataLayer: {
        event: 'virtualPageView',
        pageUrl: '/price-forecast',
        pageTitle: 'Commodity Index Forecast',
        user_id: localStorage.getItem('userId'),
      },
    }
    TagManager.dataLayer(args)
  }, [])

  return (
    <div className="container mx-auto">
      <Page />
    </div>
  )
}

export default PriceForecasting
