import { App, Spin } from 'antd'
import IndexApi from 'apis/IndexApi'
import { IPrediction, IPredictionDataResponse, IRawDataResponse } from 'apis/type/IndexResponse'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueries } from 'react-query'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import ChartComponent from '../ChartComponent'
import { graphDataState, horizonState, RawDataState, selectedFilterState, symbolState } from '../stores/atom'
import HorizonButtonGroup from './HorizonButtonGroup'
import SymbolDropdown from './SymbolDropdown'

const VisualPanel = () => {
  const { t } = useTranslation()
  const { message } = App.useApp()

  const symbols = useRecoilValue(symbolState)
  const horizon = useRecoilValue(horizonState)

  const setGraphData = useSetRecoilState(graphDataState)
  const setRawData = useSetRecoilState(RawDataState)
  const setSelectedFilter = useSetRecoilState(selectedFilterState)
  const [loading, setLoading] = useState(true)

  const fetchPredictionData = () => {
    return IndexApi.getPredictionData(symbols.selectedSymbolData?.symbol_id, horizon.selectedHorizon)
  }
  const fetchRawData = () => {
    return IndexApi.getRawData(symbols.selectedSymbolData.symbol_id)
  }

  const results = useQueries([
    {
      queryKey: ['predictionData', symbols.selectedSymbolData?.symbol_id, horizon.selectedHorizon],
      enabled: !!symbols.selectedSymbolData?.symbol_id && !!horizon.selectedHorizon,
      queryFn: fetchPredictionData,
      onSuccess: (data: IPredictionDataResponse) => {
        if (data) {
          setGraphData(data?.prediction as IPrediction[])
          setSelectedFilter((prev) => ({ ...prev, has_ci: data?.is_ci }))
        }
      },
    },
    {
      queryKey: ['rawData', symbols.selectedSymbolData?.symbol_id],
      queryFn: fetchRawData,
      enabled: !!symbols.selectedSymbolData?.symbol_id,
      onSuccess: (data: IRawDataResponse) => {
        if (data) {
          setRawData(data)
        }
      },
    },
  ])

  const allFetched = results.every((result) => result.isFetched)
  const allSuccess = results.every((result) => result.isSuccess)
  const allData = results.every((result) => result.data)

  useEffect(() => {
    setLoading(true)

    if (allFetched && allSuccess) {
      setLoading(false)

      if (!allData) {
        message.info(t('No data'))
      }
    } else if (allFetched && !allSuccess) {
      message.info(t('Failed to load data.'))
    }
  }, [allFetched, allSuccess, allData])

  return (
    <div className="m-3">
      <SymbolDropdown />
      <div>
        <span className="text-black text-xl mr-5">{symbols.selectedSymbolData?.symbol_id}</span>
        <span>{symbols.selectedSymbolData?.unit}</span>
        <span className="mx-2"> | </span>
        <span>{symbols.selectedSymbolData?.period}</span>
      </div>
      <Spin tip="Loading" size="large" spinning={loading}>
        <div className="m-5">
          <ChartComponent />
          <div className="mt-3">
            <HorizonButtonGroup />
          </div>
        </div>
      </Spin>
    </div>
  )
}

export default VisualPanel
