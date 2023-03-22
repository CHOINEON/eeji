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
} from '@chakra-ui/react'
import '../../function/style/style.css'

import LayoutList from '../data/layout_list'

interface LayoutModalProps {
  isOpen: boolean
  setClose: (isClose: boolean) => void
  setGridInfo: (gridInfo: string) => void
}

export const LayoutModal: React.FC<LayoutModalProps> = (props) => {
  const { onClose } = useDisclosure()

  // const SelectLayout = (e: any) => {
  //   props.setClose(true)
  //   props.setGridInfo(e.target.innerText)
  // }

  // const RenderLayoutList = () => {
  //   const Component = []
  //   for (let i = 0, len = LayoutList.length; i < len; i++) {
  //     Component.push(
  //       <Button
  //         key={i}
  //         leftIcon={<MdOutlineGridOn />}
  //         variant="outline"
  //         pt={8}
  //         pb={8}
  //         onClick={(e: any) => SelectLayout(e)}
  //       >
  //         {LayoutList[i]}
  //       </Button>
  //     )
  //   }

  //   return Component
  // }

  // const RenderComplete = () => {
  //   document.getElementById('templateContainer').onclick = (args: any) => {
  //     const target: any = args.target
  //     const selectedElement: any = document.getElementsByClassName('e-selected-style')
  //     if (selectedElement.length) {
  //       selectedElement[0].classList.remove('e-selected-style')
  //     }
  //     // if (target.className === 'image-pattern-style') {
  //     //   dashboardObj.removeAll()
  //     //   initializeTemplate(args.target, dashboardObj)
  //     // }
  //     target.classList.add('e-selected-style')
  //   }
  // }

  const ClickLayoutContainer = (args: any) => {
    const target: any = args.target
    const selectedElement: any = document.getElementsByClassName('e-selected-style')
    if (selectedElement.length) {
      selectedElement[0].classList.remove('e-selected-style')
    }
    target.classList.add('e-selected-style')
    console.log(target)
    props.setGridInfo(target)
    props.setClose(true)
  }

  return (
    <>
      <Modal
        isCentered
        onClose={() => {
          props.setClose(true)
        }}
        isOpen={props.isOpen}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Layout 선택</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div
              id="templateContainer"
              onClick={(e) => {
                ClickLayoutContainer(e)
              }}
            >
              <div className="row" style={{ paddingTop: '3px' }}>
                <div className="image-pattern-style" id="template1" data-id="1" />
                <div className="image-pattern-style" id="template2" data-id="2" />
                <div className="image-pattern-style" id="template3" data-id="3" />
              </div>
              <div className="row" style={{ paddingTop: '3px' }}>
                <div className="image-pattern-style" id="template4" data-id="4" />
                <div className="image-pattern-style" id="template5" data-id="5" />
                <div className="image-pattern-style" id="template6" data-id="6" />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="brand" mr={3} onClick={onClose}>
              닫기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default LayoutModal
