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

import reducer from '../../../hmid_config/reducer/reducer'
import initialState from '../../../hmid_config/reducer/initialState'

export const SaveConfirmModal: React.FC<SaveConfirmModalProps> = (props) => {
  //state...
  const [state, dispatch] = React.useReducer(reducer, initialState)

  const [SaveModalIsOpen, setSaveModalIsOpen] = React.useState(false)

  const { isOpen, onOpen, onClose } = useDisclosure()

  React.useEffect(() => {
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

  //reducer dispatch
  const ChangeLayoutName = (LayoutName: any) => {
    props.setSaveLayoutTitle(LayoutName.target.value)
    // dispatch({ type: 'LAYOUT_NAME', data: LayoutName.target.value })
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
            <Input
              onChange={(e: any) => {
                ChangeLayoutName(e)
              }}
            />
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
