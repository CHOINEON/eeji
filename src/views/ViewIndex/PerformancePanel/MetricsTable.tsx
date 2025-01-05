import { Table } from 'antd'
import IndexApi from 'apis/IndexApi'
import { IMetricInformation } from 'apis/type/IndexResponse'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useRecoilValue } from 'recoil'
import { ComponentTitle } from '../ExplanationPanel/CommonComponents'
import { horizonState, symbolState } from '../stores/atom'

const columns = [
  {
    title: 'MAE',
    dataIndex: 'MAE',
    align: 'center' as const,
  },
  {
    title: 'MAPE',
    dataIndex: 'MAPE',
    align: 'center' as const,
  },
  {
    title: 'PCD',
    dataIndex: 'PCD',
    align: 'center' as const,
  },
  {
    title: 'R2',
    dataIndex: 'R2',
    align: 'center' as const,
  },
]

type MetricsDataType = {
  MAE?: number
  MAPE?: number
  PCD?: number
  R2?: number
}

const MetricsTable = () => {
  const symbols = useRecoilValue(symbolState)
  const horizon = useRecoilValue(horizonState)
  const [metricsData, setMetricsData] = useState([])

  const { data } = useQuery(
    ['metrics', symbols.selectedSymbolData?.symbol_id, horizon.selectedHorizon],
    () => IndexApi.getMetrics(symbols.selectedSymbolData?.symbol_id, horizon.selectedHorizon),
    {
      enabled: !!symbols.selectedSymbolData?.symbol_id && !!horizon.selectedHorizon,
      refetchOnWindowFocus: false,
    }
  )

  useEffect(() => {
    const metricsData = data?.metric_information.reduce((acc: MetricsDataType, item: IMetricInformation) => {
      acc[item.metric_name as keyof MetricsDataType] = item.score
      return acc
    }, {})
    setMetricsData([{ key: 1, ...metricsData }])
  }, [data])

  return (
    <div className="m-2">
      <ComponentTitle title="Metrics" />
      <Table className="mt-2" columns={columns} dataSource={metricsData} size="small" pagination={false} rowKey="key" />
    </div>
  )
}

export default MetricsTable
