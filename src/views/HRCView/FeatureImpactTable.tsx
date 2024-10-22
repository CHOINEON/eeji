import { Radio, Table, TableColumnsType, TableProps } from 'antd'
import { useState } from 'react'

interface DataType {
  key: React.Key
  name: string
  impact: number
}

export interface XAIDataType {
  [key: string]: InnerXAIDataType
}

export interface InnerXAIDataType {
  aggregated_xai: Array<Record<string, number>>
  base_date: string
  base_value: number
  time_delta: number
  value_delta: number
  value: number
  xai_description: string
}

export interface XAITableProps {
  xaiData?: XAIDataType
  dramatic_delta_date_list?: Array<string>
  turning_points_date_list?: Array<string>
  onChangeFeature?: (name: string) => void
  onChangeDate?: (date: string) => void
  onViewClick?: () => void
}

interface FeatureImpactTableProps {
  dataSource: TableProps['dataSource']
  columns: TableColumnsType<DataType>
  onSelectFeature: (name: string) => void
  onSelectPeriod: (periodIndex: number) => void
}

const FeatureImpactTable = ({ dataSource, columns, onSelectFeature, onSelectPeriod }: FeatureImpactTableProps) => {
  const [viewChart, setViewChart] = useState(false)
  const [buttonValue, setButtonValue] = useState(0)

  const handlePeriodClick = (args: any) => {
    console.log(args.target.value)
    setButtonValue(args.target.value)
    onSelectPeriod(args.target.value)
  }

  // rowSelection object indicates the need for row selection
  const rowSelection: TableProps<DataType>['rowSelection'] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      onSelectFeature(selectedRows[0].name)
    },
    getCheckboxProps: (record: DataType) => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  }

  return (
    <>
      <p className="text-lg font-bold text-center m-2">HRC가격 변동 요인</p>
      <div className="text-center">
        <div className="m-auto">
          <Radio.Group defaultValue={0} onChange={handlePeriodClick} value={buttonValue}>
            <Radio.Button value={0}>1일</Radio.Button>
            <Radio.Button value={1}>7일</Radio.Button>
            <Radio.Button value={2}>30일</Radio.Button>
            <Radio.Button value={3}>60일</Radio.Button>
            <Radio.Button value={4}>90일</Radio.Button>
            <Radio.Button value={5}>120일</Radio.Button>
            <Radio.Button value={6}>150일</Radio.Button>
          </Radio.Group>
        </div>
      </div>
      <Table<DataType>
        size="small"
        rowSelection={{ type: 'radio', ...rowSelection }}
        columns={columns}
        dataSource={dataSource as DataType[]}
        pagination={{ pageSize: 5, pageSizeOptions: [10], position: ['bottomCenter'], showSizeChanger: false }}
      />{' '}
    </>
  )
}

export default FeatureImpactTable
