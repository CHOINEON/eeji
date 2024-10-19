import { Table, TableColumnsType } from 'antd'

import { TableProps } from 'antd'

import { Divider } from 'antd'

interface DataType {
  key: React.Key
  name: string
  impact: number
}

const columns: TableColumnsType<DataType> = [
  {
    title: '변수 이름',
    dataIndex: 'name',
    render: (text: string) => <a>{text}</a>,
  },
  {
    title: '영향도',
    dataIndex: 'impact',
  },
]

const data: DataType[] = [
  {
    key: '1',
    name: 'Feature1',
    impact: 32,
  },
  {
    key: '2',
    name: 'Feature2',
    impact: 42,
  },
  {
    key: '3',
    name: 'Feature3',
    impact: 32,
  },
  {
    key: '4',
    name: 'Feature4',
    impact: 99,
  },
]

const XAITable = (props: any) => {
  // rowSelection object indicates the need for row selection
  const rowSelection: TableProps<DataType>['rowSelection'] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
    },
    getCheckboxProps: (record: DataType) => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  }

  return (
    <>
      <div>
        <h2 className="text-center">{props.period}일 뒤 HRC가격 변동 상승 요인</h2>
        <div>
          <Divider />
          <Table<DataType>
            rowSelection={{ type: 'radio', ...rowSelection }}
            columns={columns}
            dataSource={data}
            pagination={false}
          />
        </div>
      </div>
    </>
  )
}

export default XAITable
