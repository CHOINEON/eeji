import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'
import { Statistic, Table, TableProps } from 'antd'
import IndexApi from 'apis/IndexApi'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useRecoilState, useRecoilValue } from 'recoil'
import { selectedFilterState, SymbolState } from '../stores/atom'

interface DataType {
  key: React.Key
  name: string
  impact: number
}

const columns = [
  {
    title: 'Feature Name',
    dataIndex: 'name',
    align: 'center' as const,
  },
  {
    title: 'Impact',
    dataIndex: 'impact',
    align: 'center' as const,
    render: (number: number) => (
      <Statistic
        value={number}
        valueStyle={{ color: number > 0 ? '#3f8600' : '#cf1322', fontSize: '12px' }}
        prefix={number > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
      />
    ),
  },
]

const LocalAttrTable = () => {
  const symbol = useRecoilValue(SymbolState)
  const filterCondition = useRecoilValue(selectedFilterState)
  const [selectedFilter, setSelectedFilter] = useRecoilState(selectedFilterState)
  const [data, setData] = useState([])

  const { data: featureImpactData } = useQuery(
    ['localAttribution', symbol.symbol_id, filterCondition.selectedDate],
    () =>
      IndexApi.getLocalAttributionByDate(
        symbol.symbol_id,
        symbol.selectedHorizon.toString(),
        filterCondition.selectedDate,
        1 // 예측날짜 기준 조회
      ),
    {
      enabled: !!symbol.symbol_id && !!symbol.selectedHorizon && filterCondition.selectedDate !== '',
    }
  )

  useEffect(() => {
    if (filterCondition.selectedDate !== '') {
      const data = featureImpactData?.feature_impact.map((item) => ({
        key: item.feature_name,
        name: item.feature_name,
        impact: item.impact,
      }))
      setData(data)
    }
  }, [symbol, filterCondition, featureImpactData])

  // rowSelection object indicates the need for row selection
  const rowSelection: TableProps<DataType>['rowSelection'] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setSelectedFilter({ ...selectedFilter, selectedFeatures: selectedRows.map((row) => row.name) })
    },

    getCheckboxProps: (record: DataType) => ({
      name: record.name,
    }),
  }

  return (
    <div className="m-3">
      {/* <h3 className="text-black text-lg">Local Attribution</h3> */}
      <Table
        className="mt-2"
        columns={columns}
        dataSource={data}
        rowSelection={{ type: 'checkbox', selectedRowKeys: selectedFilter.selectedFeatures, ...rowSelection }}
        size="small"
        pagination={{ pageSize: 4, pageSizeOptions: [4], position: ['bottomCenter'], showSizeChanger: false }}
      />
    </div>
  )
}

export default LocalAttrTable
