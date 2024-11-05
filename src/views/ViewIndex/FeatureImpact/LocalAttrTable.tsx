import { Table, TableProps } from 'antd'
import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { selectedFilterState, SymbolState } from '../stores/atom'

interface DataType {
  key: React.Key
  name: string
  importance: number
}

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    align: 'center' as const,
  },
  {
    title: 'Importance',
    dataIndex: 'importance',
    align: 'center' as const,
  },
]

const LocalAttrTable = () => {
  const [symbol, setSymbol] = useRecoilState(SymbolState)
  const filterCondition = useRecoilValue(selectedFilterState)
  const [selectedFilter, setSelectedFilter] = useRecoilState(selectedFilterState)
  const [data, setData] = useState([])

  useEffect(() => {
    if (symbol.features && Object.keys(symbol?.features).length > 0) {
      if (filterCondition.selectedDate === '') {
        const keyArr = Object.keys(symbol.features)
        const data = keyArr.map((key) => ({
          key: key,
          name: key,
          importance: undefined,
        }))
        setData(data)
      }
    }
  }, [symbol, filterCondition])

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
      <h3 className="text-black text-lg">Local Attribution</h3>
      <Table
        className="mt-2"
        columns={columns}
        dataSource={data}
        rowSelection={{ type: 'checkbox', ...rowSelection }}
        size="small"
        pagination={{ pageSize: 5, pageSizeOptions: [5], position: ['bottomCenter'], showSizeChanger: false }}
      />
    </div>
  )
}

export default LocalAttrTable
