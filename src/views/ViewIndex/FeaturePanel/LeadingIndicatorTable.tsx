import { Table } from 'antd'
import IndexApi from 'apis/IndexApi'
import { ILeadingIndicator } from 'apis/type/IndexResponse'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useRecoilValue } from 'recoil'
import { PeriodType, translatePeriodToKorean } from 'utils/TextTranslator'
import { horizonState, selectedFilterState, symbolState } from '../stores/atom'

const LeadingIndicatorTable = () => {
  const symbols = useRecoilValue(symbolState)
  const horizon = useRecoilValue(horizonState)
  const filterCondition = useRecoilValue(selectedFilterState)

  const { data } = useQuery(
    ['leadingIndicator', symbols.selectedSymbolData.symbol_id, horizon.selectedHorizon],
    () => IndexApi.getLeadingIndicator(symbols.selectedSymbolData.symbol_id, horizon.selectedHorizon),
    {
      enabled: !!symbols.selectedSymbolData.symbol_id && !!horizon.selectedHorizon && !!filterCondition.selectedDate,
    }
  )
  const [dataSource, setDataSource] = useState<ILeadingIndicator[]>([])

  useEffect(() => {
    if (data) {
      setDataSource(data.leading_indicator)
    }
  }, [data])

  const columns = [
    {
      title: '지표명',
      dataIndex: 'feature_name',
      align: 'center' as const,
    },
    {
      title: '설명',
      dataIndex: 'description',
      align: 'center' as const,
    },
    {
      title: '상관계수',
      dataIndex: 'correlation',
      align: 'center' as const,
      sorter: (a: ILeadingIndicator, b: ILeadingIndicator) => a.correlation - b.correlation,
    },
    {
      title: '선행기간',
      dataIndex: 'leading_period',
      align: 'center' as const,
      render: (number: number) => (
        <span>
          {number}
          {translatePeriodToKorean(symbols.selectedSymbolData.period as PeriodType)}
        </span>
      ),
    },
    {
      title: '출처',
      dataIndex: 'source',
      align: 'center' as const,
    },
  ]

  return (
    <div className="m-3">
      {/* <h3 className="text-black text-lg">Leading Indicator</h3> */}
      <Table
        className="mt-2"
        columns={columns}
        dataSource={dataSource}
        size="small"
        pagination={{ pageSize: 4, pageSizeOptions: [4], position: ['bottomCenter'], showSizeChanger: false }}
      />
    </div>
  )
}

export default LeadingIndicatorTable
