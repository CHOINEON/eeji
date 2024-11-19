import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'
import { Statistic, Table, TableProps } from 'antd'
import IndexApi from 'apis/IndexApi'
import { IFeatureImpact } from 'apis/type/IndexResponse'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { chartOptionDataState, selectedFilterState, SymbolState } from '../stores/atom'

interface DataType {
  key: React.Key
  name: string
  impact: number
  input_value_delta: number
  input_value_delta_percentage: number
  date_input: string
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
  {
    title: 'Input Value Delta',
    dataIndex: 'input_value_delta',
    align: 'center' as const,
    sorter: (a: IFeatureImpact, b: IFeatureImpact) => a.input_value_delta - b.input_value_delta,
    render: (number: number, record: DataType) =>
      `${number} (${(record.input_value_delta_percentage * 100).toFixed(2)}%)`,
  },
]

const LocalAttrTable = () => {
  const symbol = useRecoilValue(SymbolState)
  const filterCondition = useRecoilValue(selectedFilterState)
  const [selectedFilter, setSelectedFilter] = useRecoilState(selectedFilterState)
  const [data, setData] = useState([])
  const setChartOptionData = useSetRecoilState(chartOptionDataState)
  const chartOptionData = useRecoilValue(chartOptionDataState)

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
      enabled: !!symbol.symbol_id && !!symbol.selectedHorizon && !!filterCondition.selectedDate,
    }
  )

  useEffect(() => {
    if (featureImpactData) {
      setChartOptionData({ xAxisRange: { x1: featureImpactData.date_input, x2: featureImpactData.date } })
    }
  }, [featureImpactData])

  useEffect(() => {
    if (featureImpactData?.feature_impact) {
      const data = featureImpactData.feature_impact.map((item: IFeatureImpact) => ({
        key: item.feature_name,
        name: item.feature_name,
        impact: item.impact,
        input_value_delta: item.input_value_delta,
        input_value_delta_percentage: item.input_value_delta_percentage,
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
    <div className="mb-8">
      <span className="text-lg mr-2 font-bold">Local Attribution</span>
      <span className={`${chartOptionData?.xAxisRange ? 'text-[12px] text-gray-500' : 'hidden'}`}>
        (입력 구간 : {chartOptionData.xAxisRange?.x1} - {chartOptionData.xAxisRange?.x2})
      </span>
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
