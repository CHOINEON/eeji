import React from 'react'
import styled from '@emotion/styled'
import { Select, Modal } from 'antd'
import './style/style.css'

import DataConnection from '../data/data_connection_list'

const DataListWrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
`

interface DataConnectionModalProps {
  DataTagList: any
  DataConnectionModalisOpen: boolean
  setCloseDataConnectionModal: (isClose: boolean) => void
  setDataConnectionInfo: (DataType: string) => void
  setTagInfo: (TagInfo: any) => void
}

export const WidgetModal: React.FC<DataConnectionModalProps> = (props) => {
  // const { onClose } = useDisclosure()
  const [SelectDataType, setSelectDataType] = React.useState<any>()
  const [TagNodeData, setTagNodeData] = React.useState<any>()
  const [DataNodeData, setDataNodeData] = React.useState<any>()
  const [TagInfo, setTagInfo] = React.useState<any>([])
  const [ModeInfo, setModeInfo] = React.useState<any>([])

  const DataType: any = [
    {
      value: 'min',
      label: 'Min',
    },
    {
      value: 'max',
      label: 'Max',
    },
    {
      value: 'avg',
      label: 'Average',
    },
  ]

  React.useEffect(() => {
    CreateDtataListItems()
  }, [])

  React.useEffect(() => {
    props.setDataConnectionInfo(SelectDataType)
  }, [SelectDataType])

  React.useEffect(() => {
    if (props.DataTagList.length !== 0) {
      CreateTagListItems(props.DataTagList)
    }
  }, [props.DataTagList])

  const CreateDtataListItems = () => {
    const Arr: any = []
    let Obj: any = new Object()

    for (let i = 0, len = DataConnection.length; i < len; i++) {
      Obj.value = DataConnection[i].value
      Obj.label = DataConnection[i].label
      Arr.push(Obj)
      Obj = new Object()
    }

    setDataNodeData(Arr)
  }

  const CreateTagListItems = (TagData: any) => {
    const Arr: any = []
    let Obj: any = new Object()

    for (let i = 0, len = TagData.length; i < len; i++) {
      Obj.value = TagData[i].name
      Obj.label = TagData[i].name
      Arr.push(Obj)
      Obj = new Object()
    }

    setTagNodeData(Arr)
  }

  const handleDataChange = (value: string | string[]) => {
    if (value !== undefined) {
      setSelectDataType(value)
    }
  }

  const handleTagChange = (value: string | string[]) => {
    setTagInfo(value)
  }

  return (
    <>
      <Modal
        title="Modal"
        open={props.DataConnectionModalisOpen}
        onOk={() => {
          props.setTagInfo(TagInfo)
          // props.setModeInfo(ModeInfo)
          props.setCloseDataConnectionModal(true)
          //value 초기화
          setTagInfo([])
          setModeInfo([])
          setSelectDataType([])
        }}
        onCancel={() => {
          props.setCloseDataConnectionModal(true)
        }}
        okText="Connect"
        cancelText="Cancel"
      >
        <DataListWrap>
          <div>Data .</div>
          <Select style={{ width: 120 }} onChange={handleDataChange} options={DataNodeData} value={SelectDataType} />
          <div>Tag .</div>
          <Select
            mode="tags"
            size={'large'}
            placeholder={'Tag Select'}
            onChange={handleTagChange}
            style={{ width: '100%' }}
            options={TagNodeData}
            value={TagInfo}
          />
          {/* <div>
            <Select
              size={'large'}
              placeholder={'Select Data Type'}
              onChange={handleModeChange}
              style={{ width: '100%' }}
              options={DataType}
              value={'min'}
            />
          </div> */}
        </DataListWrap>
      </Modal>
    </>
  )
}

export default WidgetModal
