import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { TableRowSelection } from 'antd/es/table/interface'
import { IDataset, IDatasetList } from 'apis/type/Dataset'
import { t } from 'i18next'
import { useState } from 'react'
import { useSetRecoilState } from 'recoil'
import Actions from './components/Button/DatasetActions'
import { selectedDataState } from './store/dataset/atom'

const formatSize = (size: number) => {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`
  if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`
  return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

const renderDetails = (record: IDataset) => (
  <div>
    <p>
      <strong>{t('Created')} :</strong> {record.create_date}
    </p>
    <p>
      <strong>{t('Type')} :</strong> {record.is_classification ? t('Classification') : t('Regression')}
    </p>
    <p>
      <strong>{t('Target')} :</strong> {record.target_y}
    </p>
    <p>
      <strong>{t('Description')} :</strong> {record.descr}
    </p>
  </div>
)

const DatasetListTable = ({ data }: { data: IDatasetList }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const setSelectedData = useSetRecoilState(selectedDataState)

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)

    const filteredData: IDataset = data.filter((x: IDataset) => x.ds_id === newSelectedRowKeys[0])[0]
    setSelectedData({
      ds_id: filteredData.ds_id,
      name: filteredData.name,
      size: filteredData.size,
      descr: filteredData.descr,
      rowCount: 0,
      colCount: 0,
      startDate: filteredData.start_date,
      endDate: filteredData.end_date,
      dateCol: filteredData.date_col,
      targetY: filteredData.target_y,
      numeric_cols: filteredData.numeric_cols,
      non_numeric_cols: filteredData.non_numeric_cols,
      isClassification: filteredData.is_classification,
      createDate: filteredData.create_date,
    })
  }

  const rowSelection: TableRowSelection<IDataset> = {
    type: 'radio',
    selectedRowKeys,
    onChange: onSelectChange,
  }

  const columns: ColumnsType<IDataset> = [
    {
      title: t('Dataset Name'),
      dataIndex: 'name',
      key: 'name',
      width: 250,
      ellipsis: true,
      align: 'left',
      sorter: (a, b) => a.name.localeCompare(b.name),
      // filters: data?.map((item) => ({
      //   text: item.name,
      //   value: item.name,
      // })),
      // onFilter: (value, record) => record.name.includes(value as string),
    },
    {
      title: t('Size'),
      dataIndex: 'size',
      key: 'size',
      align: 'center',
      render: (size: number) => formatSize(size),
      sorter: (a, b) => a.size - b.size,
    },
    {
      title: '',
      key: 'ds_id',
      width: 40,
      render: () => <Actions />,
    },
  ]

  return (
    <Table
      rowSelection={rowSelection}
      size="small"
      columns={columns}
      dataSource={data}
      rowKey="ds_id"
      scroll={{ y: 490 }}
      pagination={{ pageSize: 10, pageSizeOptions: [10], position: ['bottomCenter'], showSizeChanger: false }}
      expandable={{
        expandedRowRender: renderDetails,
      }}
      onRow={(record: IDataset) => {
        return {
          onClick: () => onSelectChange([record.ds_id]), // Row 클릭 시 호출되는 함수
        }
      }}
    />
  )
}

export default DatasetListTable
