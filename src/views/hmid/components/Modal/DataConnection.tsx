import React from 'react'
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Select,
} from '@chakra-ui/react'
import styled from '@emotion/styled'

import DataConnection from '../data/data_connection_list'

const DataListWrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
`

interface DataConnectionModalProps {
  DataConnectionModalisOpen: boolean
  setCloseDataConnectionModal: (isClose: boolean) => void
  setDataConnectionInfo: (DataType: string) => void
}

export const WidgetModal: React.FC<DataConnectionModalProps> = (props) => {
  const { onClose } = useDisclosure()
  const [SelectDataType, setSelectDataType] = React.useState<string>()

  const CreateDtataListItems = () => {
    const dataList: any = []

    for (let i = 0, len = DataConnection.length; i < len; i++) {
      dataList.push(
        <option key={DataConnection[i].id} value={DataConnection[i].id}>
          {DataConnection[i].name}
        </option>
      )
    }

    return dataList
  }

  const ChangeDataType = (DataType: any) => {
    if (DataType.target.value !== undefined) {
      setSelectDataType(DataType.target.value)
    }
  }

  const SelectedDataType = () => {
    if (SelectDataType !== undefined) {
      props.setDataConnectionInfo(SelectDataType)
    }
  }

  return (
    <>
      <Modal
        isCentered
        onClose={() => {
          props.setCloseDataConnectionModal(true)
        }}
        isOpen={props.DataConnectionModalisOpen}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Data Connection</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <DataListWrap>
              <Select
                size="md"
                onChange={(e: any) => {
                  ChangeDataType(e)
                }}
              >
                {CreateDtataListItems()}
              </Select>
            </DataListWrap>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="brand" mr={3} onClick={SelectedDataType}>
              선택
            </Button>
            <Button colorScheme="brand" mr={3} onClick={onClose}>
              닫기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default WidgetModal
