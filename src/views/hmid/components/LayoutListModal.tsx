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
  Grid,
} from '@chakra-ui/react'
import { MdOutlineGridOn } from 'react-icons/md'

import LayoutList from '../data/layout_list'

interface LayoutModalProps {
  isOpen: boolean
  setClose: (isClose: boolean) => void
  setGridInfo: (gridInfo: string) => void
}

export const LayoutModal: React.FC<LayoutModalProps> = (props) => {
  const { onClose } = useDisclosure()

  const SelectLayout = (e: any) => {
    props.setClose(true)
    props.setGridInfo(e.target.innerText)
  }

  const RenderLayoutList = () => {
    const Component = []
    for (let i = 0, len = LayoutList.length; i < len; i++) {
      Component.push(
        <Button
          key={i}
          leftIcon={<MdOutlineGridOn />}
          variant="outline"
          pt={8}
          pb={8}
          onClick={(e: any) => SelectLayout(e)}
        >
          {LayoutList[i]}
        </Button>
      )
    }

    return Component
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
            <Grid templateColumns="repeat(3, 1fr)" gap={3}>
              {RenderLayoutList()}
            </Grid>
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
