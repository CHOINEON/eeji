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
          <ModalHeader>Save your Layout</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Layout Name"
              onChange={(e: any) => {
                ChangeLayoutName(e)
              }}
              style={{ backgroundColor: '#F4F7FE' }}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              id="design_button"
              colorScheme="brand"
              mr={3}
              onClick={SaveLayout}
              style={{ backgroundColor: '#4338F7', color: '#fff' }}
            >
              저장
            </Button>
            <Button
              id="design_button"
              variant="ghost"
              onClick={unSaveLayout}
              style={{ backgroundColor: '#4338F7', color: '#fff' }}
            >
              취소
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default SaveConfirmModal
