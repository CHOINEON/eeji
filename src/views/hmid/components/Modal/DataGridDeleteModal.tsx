import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Button,
  useDisclosure,
} from '@chakra-ui/react'

interface DataGridDeleteModalProps {
  DataGridDeleteModalisOpen: boolean
  setCloseDataGridDeleteModal: (isClose: boolean) => void
  setDataGridDeleteInfo: (dataGridDeleteInfo: string) => void
}

export const DataGridDeleteModal: React.FC<DataGridDeleteModalProps> = (props) => {
  const [DeleteModalIsOpen, setDeleteModalIsOpen] = React.useState(false)

  const { isOpen, onOpen, onClose } = useDisclosure()

  React.useEffect(() => {
    setDeleteModalIsOpen(props.DataGridDeleteModalisOpen)
  }, [props.DataGridDeleteModalisOpen])

  const DeleteDataGridRow = () => {
    props.setDataGridDeleteInfo('delete')
    onClose()
  }

  const unDeleteDataGridRow = () => {
    props.setDataGridDeleteInfo('unDelete')
    onClose()
  }

  return (
    <>
      <Modal
        blockScrollOnMount={false}
        isOpen={DeleteModalIsOpen}
        onClose={() => {
          props.setCloseDataGridDeleteModal(true)
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>DataGrid 선택한 행 삭제</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontWeight="bold" mb="1rem">
              선택한 행을 삭제 하시겠습니까?
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button id="design_button" colorScheme="brand" mr={3} onClick={DeleteDataGridRow}>
              네
            </Button>
            <Button id="design_button" variant="ghost" onClick={unDeleteDataGridRow}>
              아니오
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default DataGridDeleteModal
