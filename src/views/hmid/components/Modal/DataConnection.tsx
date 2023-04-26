import React from 'react'
import {
  Button,
  // Modal,
  // ModalOverlay,
  // ModalContent,
  // ModalHeader,
  // ModalFooter,
  // ModalBody,
  // ModalCloseButton,
  // useDisclosure,
  // Select,
} from '@chakra-ui/react'
import styled from '@emotion/styled'
import type { SelectProps } from 'antd'
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

  React.useEffect(() => {
    CreateDtataListItems()
  }, [])

  React.useEffect(() => {
    console.log(DataNodeData)
  }, [DataNodeData])

  React.useEffect(() => {
    console.log('[ 상위로 보낼 SelectDataType ] : ' + SelectDataType)
    props.setDataConnectionInfo(SelectDataType)
  }, [SelectDataType])

  React.useEffect(() => {
    console.log('[ 상위에서 받은 TagList ] : ')
    console.log(props.DataTagList)
    if (props.DataTagList.length !== 0) {
      CreateTagListItems(props.DataTagList)
    }
    // else {
    //   CreateTagListItems('태그를 선택하여 주세요.')
    // }
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

    // if (typeof TagData === 'string') {
    //   Obj.value = 'default'
    //   Obj.label = '태그를 선택 해주세요.'
    //   Arr.push(Obj)
    //   Obj = new Object()
    // } else {
    for (let i = 0, len = TagData.length; i < len; i++) {
      Obj.value = TagData[i].name
      Obj.label = TagData[i].name
      Arr.push(Obj)
      Obj = new Object()
    }
    //}

    console.log(Arr)

    setTagNodeData(Arr)
    // return TagList
  }

  const handleDataChange = (value: string | string[]) => {
    if (value !== undefined) {
      setSelectDataType(value)
    }
  }

  const handleTagChange = (value: string | string[]) => {
    console.log(value)
    setTagInfo(value)
  }

  // const SelectedDataType = () => {
  //   if (SelectDataType !== undefined) {
  //     props.setDataConnectionInfo(SelectDataType)
  //   }
  // }

  return (
    <>
      <Modal
        title="Modal"
        open={props.DataConnectionModalisOpen}
        onOk={() => {
          props.setTagInfo(TagInfo)
          props.setCloseDataConnectionModal(true)
          //value 초기화
          setTagInfo([])
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
        </DataListWrap>
      </Modal>
    </>
  )
}

export default WidgetModal
