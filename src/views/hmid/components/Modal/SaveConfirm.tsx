import React from 'react'
import * as Chakra from '@chakra-ui/react'

import { useRecoilState, useSetRecoilState } from 'recoil'
import { OpenSaveLayoutModalState, SaveLayoutInformationState } from '../../../hmid_config/recoil/config/atoms'
import { LayoutTitle } from '../../../hmid_config/recoil/base/atoms'

export const SaveConfirmModal: React.FC = () => {
  const [saveLayoutModal, setSaveLayoutModal] = useRecoilState(OpenSaveLayoutModalState)
  const setSaveLayoutInformation = useSetRecoilState(SaveLayoutInformationState)
  const setLayoutTitle = useSetRecoilState(LayoutTitle)

  const { onClose } = Chakra.useDisclosure()

  const SaveLayout = () => {
    setSaveLayoutInformation('save')
    onClose()
  }

  const unSaveLayout = () => {
    setSaveLayoutInformation('unSave')
    onClose()
  }

  const ChangeLayoutName = (LayoutName: any) => {
    setLayoutTitle(LayoutName.target.value)
  }

  return (
    <>
      <Chakra.Modal
        blockScrollOnMount={false}
        isOpen={saveLayoutModal}
        onClose={() => {
          setSaveLayoutModal(false)
        }}
      >
        <Chakra.ModalOverlay />
        <Chakra.ModalContent>
          <Chakra.ModalHeader>Save your Layout</Chakra.ModalHeader>
          <Chakra.ModalCloseButton />
          <Chakra.ModalBody>
            <Chakra.Input
              placeholder="Layout Name"
              onChange={(e: any) => {
                ChangeLayoutName(e)
              }}
              style={{ backgroundColor: '#F4F7FE' }}
            />
          </Chakra.ModalBody>
          <Chakra.ModalFooter>
            <Chakra.Button
              id="design_button"
              colorScheme="brand"
              mr={3}
              onClick={SaveLayout}
              style={{ backgroundColor: '#4338F7', color: '#fff' }}
            >
              저장
            </Chakra.Button>
            <Chakra.Button
              id="design_button"
              variant="ghost"
              onClick={unSaveLayout}
              style={{ backgroundColor: '#4338F7', color: '#fff' }}
            >
              취소
            </Chakra.Button>
          </Chakra.ModalFooter>
        </Chakra.ModalContent>
      </Chakra.Modal>
    </>
  )
}

export default SaveConfirmModal
