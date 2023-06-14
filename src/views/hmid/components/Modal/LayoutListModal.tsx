import React from 'react'
import * as Chakra from '@chakra-ui/react'
import '../../../hmid_config/style/style.css'

import { useRecoilState, useSetRecoilState } from 'recoil'
import { ShowGridModalState, GridInformationState } from '../../../hmid_config/recoil/config/atoms'

export const LayoutModal: React.FC = () => {
  const [showGridModal, setShowGridModal] = useRecoilState(ShowGridModalState)
  const setDashboardArgs = useSetRecoilState(GridInformationState)

  const ClickLayoutContainer = (args: any) => {
    const target: any = args.target
    const selectedElement: any = document.getElementsByClassName('e-selected-style')
    if (selectedElement.length) {
      selectedElement[0].classList.remove('e-selected-style')
    }
    target.classList.add('e-selected-style')
    setDashboardArgs(target)
  }

  return (
    <>
      <Chakra.Modal
        isCentered
        onClose={() => {
          setShowGridModal(false)
        }}
        isOpen={showGridModal}
        motionPreset="slideInBottom"
      >
        <Chakra.ModalOverlay />
        <Chakra.ModalContent>
          <Chakra.ModalHeader>Layout 선택</Chakra.ModalHeader>
          <Chakra.ModalCloseButton />
          <Chakra.ModalBody>
            <div
              id="templateContainer"
              onClick={(e) => {
                ClickLayoutContainer(e)
              }}
            >
              <div className="row" style={{ paddingTop: '3px' }}>
                <div className="image-pattern-style" id="template1" data-id="1" />
                <div className="image-pattern-style" id="template2" data-id="2" />
                {/* <div className="image-pattern-style" id="template3" data-id="3" /> */}
              </div>
              {/* <div className="row" style={{ paddingTop: '3px' }}>
                <div className="image-pattern-style" id="template4" data-id="4" />
                <div className="image-pattern-style" id="template5" data-id="5" />
                <div className="image-pattern-style" id="template6" data-id="6" />
              </div> */}
            </div>
          </Chakra.ModalBody>
          <Chakra.ModalFooter>
            <Chakra.Button
              id="design_button"
              colorScheme="brand"
              mr={3}
              onClick={() => {
                setShowGridModal(false)
              }}
              style={{ backgroundColor: '#4338F7' }}
            >
              닫기
            </Chakra.Button>
          </Chakra.ModalFooter>
        </Chakra.ModalContent>
      </Chakra.Modal>
    </>
  )
}

export default LayoutModal
