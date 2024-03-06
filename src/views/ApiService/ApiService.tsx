import React from 'react'
import { Badge, Button, Input, message, Radio, Space, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { CustomButton } from 'views/AIModelGenerator/components/DataInfo/DataImportModal'

interface DataType {
  key: React.Key
  name: string
  created: string
  target: string
  description: string
  tags: string[]
}

const columns: ColumnsType<DataType> = [
  { title: '모델 생성일', dataIndex: 'created', key: 'created' },
  // Table.EXPAND_COLUMN,
  { title: '모델명', dataIndex: 'name', key: 'name' },
  // Table.SELECTION_COLUMN,
  { title: '타겟변수명', dataIndex: 'target', key: 'target' },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? 'geekblue' : 'green'
          if (tag === 'loser') {
            color = 'volcano'
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          )
        })}
      </>
    ),
  },
  { title: '비고', dataIndex: 'description', key: 'description' },
  {
    title: 'Status',
    key: 'state',
    render: () => <Badge status="success" text="available" />,
  },
  { title: 'API 생성', dataIndex: 'address', key: 'address', render: () => <Button>Publish</Button> },
]

const data: DataType[] = [
  {
    key: 1,
    name: 'Model_1',
    created: '2023-12-31',
    target: 'retention1',
    description: 'test model 1',
    tags: ['nice', 'developer'],
  },
  {
    key: 2,
    name: 'Model_2',
    created: '2024-01-01',
    target: 'retention7',
    description: 'test model 2',
    tags: ['loser'],
  },
]

//TODO : 사용자가 생성하고 저장했거나, 직접 업로드한 모델 목록을 표출
//구현할 기능 : 요청 및 응답 명세
//Query string
const ApiService = () => {
  return (
    <>
      {/* <p style={{ textAlign: 'center' }}>서비스 준비중입니다</p> */}
      <div style={{ textAlign: 'right', margin: '30px 0px', width: 200, display: 'block', float: 'right' }}>
        <CustomButton visible={true} onClick={() => message.info('서비스 준비중입니다')}>
          Model Upload
        </CustomButton>
      </div>
      <Table
        columns={columns}
        rowSelection={{}}
        // expandable={{
        //   expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.description}</p>,
        // }}
        dataSource={data}
      />
    </>
  )
}

export default ApiService
