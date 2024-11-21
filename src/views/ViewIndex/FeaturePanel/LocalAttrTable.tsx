import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'
import { Statistic, Table, TableProps } from 'antd'
import IndexApi from 'apis/IndexApi'
import { IFeatureImpact } from 'apis/type/IndexResponse'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { FeatureImpactDataState, selectedFilterState, SymbolState } from '../stores/atom'

interface DataType {
  key: React.Key
  feature_name: string
  impact: number
  input_value_delta: number
  input_value_delta_percentage: number
  date_input: string
}

const columns = [
  {
    title: 'Feature Name',
    dataIndex: 'feature_name',
    align: 'center' as const,
    sorter: (a: IFeatureImpact, b: IFeatureImpact) => a.feature_name.localeCompare(b.feature_name),
  },
  {
    title: 'Impact',
    dataIndex: 'impact',
    align: 'center' as const,
    sorter: (a: IFeatureImpact, b: IFeatureImpact) => a.impact - b.impact,
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
  const setFeatureImpactData = useSetRecoilState(FeatureImpactDataState)
  const [summary, setSummary] = useState(0)

  const { data: featureData } = useQuery(
    ['localAttribution', symbol.symbol_id, filterCondition.selectedDate],
    () =>
      IndexApi.getLocalAttributionByDate(
        symbol.symbol_id,
        symbol.selectedHorizon.toString(),
        filterCondition.selectedDate,
        1, // 예측날짜 기준 조회
        1 // is_sorted 1인경우 positive, negative 별도로 넘어옴
      ),
    {
      enabled: !!symbol.symbol_id && !!symbol.selectedHorizon && !!filterCondition.selectedDate,
      onSuccess: (data) => {
        const positive = data.feature_impact.positive.map((item: IFeatureImpact) => ({
          ...item,
          key: item.feature_name,
          type: 'positive',
        }))

        const negative = data.feature_impact.negative.map((item: IFeatureImpact) => ({
          ...item,
          key: item.feature_name,
          type: 'negative',
        }))

        const mergedResult = [...positive, ...negative]
        setData(mergedResult)

        setFeatureImpactData({
          name: data.name,
          feature_impact: mergedResult,
          horizon: data.horizon,
          is_pred_date: data.is_pred_date,
          date_pred: data.date_pred,
          dt: data.dt,
          date: data.date,
          date_input: data.date_input,
        })

        setSummary(
          Number(
            mergedResult
              .map((item) => item.impact)
              .reduce((a, b) => a + b, 0)
              .toFixed(4)
          )
        )
      },
    }
  )

  // rowSelection object indicates the need for row selection
  const rowSelection: TableProps<DataType>['rowSelection'] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setSelectedFilter({ ...selectedFilter, selectedFeatures: selectedRows?.map((row) => row.feature_name) })
    },

    getCheckboxProps: (record: DataType) => ({
      name: record.feature_name,
    }),
  }

  return (
    <div className="mb-8">
      <span className="text-lg mr-2 font-bold">Local Attribution</span>
      <span className={`${featureData?.date_input ? 'text-[12px] text-gray-500' : 'hidden'}`}>
        (입력 구간 : {featureData?.date_input} - {featureData?.date})
      </span>
      <Table
        className="mt-2"
        columns={columns}
        dataSource={data}
        rowSelection={{ type: 'checkbox', selectedRowKeys: selectedFilter.selectedFeatures, ...rowSelection }}
        size="small"
        pagination={{ pageSize: 4, pageSizeOptions: [4], position: ['bottomCenter'], showSizeChanger: false }}
        summary={(pageData) => {
          let positiveVal = 0
          let negativeVal = 0
          let summaryVal = 0
          pageData.forEach(({ impact }) => {
            positiveVal += impact > 0 ? impact : 0
            negativeVal += impact < 0 ? impact : 0
            summaryVal += impact
          })

          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>Positive</Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <p className="text-[#43880E]">{Number(positiveVal).toFixed(4)}</p>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={0}>Negative</Table.Summary.Cell>
                <Table.Summary.Cell index={2}>
                  <p className="text-[#D84247]">{Number(negativeVal).toFixed(4)}</p>
                </Table.Summary.Cell>
              </Table.Summary.Row>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>Summary</Table.Summary.Cell>
                <Table.Summary.Cell index={1} rowSpan={2}>
                  {summaryVal !== 0 && (
                    <p className={`${summaryVal > 0 ? 'text-[#43880E]' : 'text-[#D84247]'}`}>
                      {Number(summaryVal).toFixed(4)}
                    </p>
                  )}
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          )
        }}
      />
    </div>
  )
}

export default LocalAttrTable
