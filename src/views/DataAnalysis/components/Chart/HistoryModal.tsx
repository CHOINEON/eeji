import React, { useEffect, useState } from 'react'
import { Button, Modal, Input, Select, Space } from 'antd'
import { useRecoilValue } from 'recoil'
import { excludeHistoryStore } from 'views/DataAnalysis/store/atom'
import { AgGridReact } from 'ag-grid-react'

const HistoryModal = (props: any) => {
  const { visible, onClose, onGetValue } = props
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const excludedData = useRecoilValue(excludeHistoryStore)
  const [rowData, setRowData] = useState([])
  const [columnDefs] = useState([
    { field: 'start', width: 160 },
    { field: 'end', width: 160 },
    { field: 'datetime', width: 160, headerName: '작업일시' },
  ])

  useEffect(() => {
    setIsModalOpen(visible)
  }, [visible])

  //   const showModal = () => {
  //     setIsModalOpen(true)
  //   }

  const handleOk = () => {
    onGetValue(inputValue)
    setIsModalOpen(false)
    setInputValue('')
    onClose(false)
  }

  const handleCancel = () => {
    // console.log('close')
    onClose(false)
    setIsModalOpen(false)
    setInputValue('')
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // console.log('Change:', e.target.value)
    setInputValue(e.target.value)
  }

  return (
    <>
      {/* <Button type="primary" onClick={showModal}>
        Open Modal
      </Button> */}
      <Modal
        title="View History"
        open={isModalOpen}
        // onOk={handleOk}
        onCancel={handleCancel}
        width={550}
        footer={
          [
            // <Button key="Save" onClick={handleOk}>
            //   Ok
            // </Button>,
          ]
        }
      >
        <Space direction="vertical" size="middle">
          {/* <Space.Compact style={{ width: '100%' }}>HISTORY</Space.Compact> */}
          <div className="ag-theme-alpine" style={{ height: 250, width: 500, margin: '10px' }}>
            <AgGridReact rowData={excludedData} columnDefs={columnDefs}></AgGridReact>
          </div>
        </Space>
      </Modal>
    </>
  )
}

export default HistoryModal
