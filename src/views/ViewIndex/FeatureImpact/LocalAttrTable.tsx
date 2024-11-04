import { Table } from 'antd'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { SymbolState } from '../stores/atom'
// import { indexRawDataState } from '../stores/atom'

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
  const [data, setData] = useState([])

  useEffect(() => {
    console.log('symbol:', symbol)

    if (symbol.features && Object.keys(symbol?.features).length > 0) {
      const keyArr = Object.keys(symbol.features)
      const data = keyArr.map((key) => ({
        key: key,
        name: key,
        importance: 0,
      }))
      setData(data)
    }
  }, [symbol])

  return (
    <div className="m-3">
      <h3 className="text-black text-lg">Local Attribution</h3>
      <Table
        className="mt-2"
        columns={columns}
        dataSource={data}
        rowSelection={{ type: 'radio' }}
        size="small"
        pagination={{ pageSize: 5, pageSizeOptions: [5], position: ['bottomCenter'], showSizeChanger: false }}
      />
    </div>
  )
}

export default LocalAttrTable
