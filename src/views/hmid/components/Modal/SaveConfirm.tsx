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
  Input,
} from '@chakra-ui/react'

interface SaveConfirmModalProps {
  SaveGridisOpen: boolean
  setSaveLayoutTitle: (Title: string) => void
  setSaveLayoutInfo: (isSave: string) => void
  setCloseSaveLayoutModal: (isClose: boolean) => void
}

export const SaveConfirmModal: React.FC<SaveConfirmModalProps> = (props) => {
  const [SaveModalIsOpen, setSaveModalIsOpen] = React.useState(false)

  const { isOpen, onOpen, onClose } = useDisclosure()

  React.useEffect(() => {
    console.log('################################')
    console.log(props.SaveGridisOpen)
    console.log('################################')
    setSaveModalIsOpen(props.SaveGridisOpen)
    console.log(SaveModalIsOpen)
  }, [props.SaveGridisOpen])

  const SaveLayout = () => {
    props.setSaveLayoutInfo('save')
    onClose()
  }

  const unSaveLayout = () => {
    props.setSaveLayoutInfo('unSave')
    onClose()
  }

  return (
    <>
      <Modal
        blockScrollOnMount={false}
        isOpen={SaveModalIsOpen}
        onClose={() => {
          props.setCloseSaveLayoutModal(true)
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>레이아웃 저장</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontWeight="bold" mb="1rem">
              레이아웃 이름
            </Text>
            <Input />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="brand" mr={3} onClick={SaveLayout}>
              저장
            </Button>
            <Button variant="ghost" onClick={unSaveLayout}>
              취소
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default SaveConfirmModal
