import { Table } from 'antd'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { selectedIndexState } from '../stores/atom'
// import { indexRawDataState } from '../stores/atom'

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Importance',
    dataIndex: 'importance',
  },
]

const LocalAttrTable = () => {
  const [selectedIndex, setSelectedIndex] = useRecoilState(selectedIndexState)
  const [data, setData] = useState([])

  useEffect(() => {
    console.log(selectedIndex.features)
    if (selectedIndex.features && Object.keys(selectedIndex?.features).length > 0) {
      const keyArr = Object.keys(selectedIndex.features)
      const data = keyArr.map((key) => ({
        key: key,
        name: key,
        importance: 0,
      }))
      setData(data)
    }
  }, [selectedIndex])

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        rowSelection={{ type: 'radio' }}
        size="small"
        pagination={{ pageSize: 5, pageSizeOptions: [5], position: ['bottomCenter'], showSizeChanger: false }}
      />
    </>
  )
}

export default LocalAttrTable
