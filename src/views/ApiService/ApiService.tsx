import React from 'react'
import { Button, Input, Radio, Space, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'

interface DataType {
  key: React.Key
  name: string
  created: string
  target: string
  description: string
}

const columns: ColumnsType<DataType> = [
  { title: '모델 생성일', dataIndex: 'created', key: 'created' },
  Table.EXPAND_COLUMN,
  { title: '모델명', dataIndex: 'name', key: 'name' },
  Table.SELECTION_COLUMN,
  { title: '타겟변수명', dataIndex: 'target', key: 'target' },
  { title: '비고', dataIndex: 'description', key: 'description' },
  { title: 'API 생성 버튼', dataIndex: 'address', key: 'address' },
]

const data: DataType[] = [
  {
    key: 1,
    name: 'Model_1',
    created: '2023-12-31',
    target: 'retention1',
    description: 'test model 1',
  },
  {
    key: 2,
    name: 'Model_2',
    created: '2024-01-01',
    target: 'retention7',
    description: 'test model 2',
  },
]

//TODO : 사용자가 생성하고 저장했거나, 직접 업로드한 모델 목록을 표출
//구현할 기능 : 요청 및 응답 명세
//Query string
const ApiService = () => {
  return (
    <>
      <div style={{ textAlign: 'right', margin: '30px 0px' }}>
        <Button type="primary">Model Upload</Button>
      </div>
      <Table
        columns={columns}
        rowSelection={{}}
        expandable={{
          expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.description}</p>,
        }}
        dataSource={data}
      />
    </>
  )
}

export default ApiService
