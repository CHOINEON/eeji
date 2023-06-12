import React from 'react'
import * as Chakra from '@chakra-ui/react'
import styled from '@emotion/styled'

import ico_line from '../../../../assets/img/ineeji/ico_line.png'
import ico_bar from '../../../../assets/img/ineeji/ico_bar.png'
import ico_pie from '../../../../assets/img/ineeji/ico_pie.png'
import ico_heatmap from '../../../../assets/img/ineeji/ico_heatmap.png'
import ico_waterfall from '../../../../assets/img/ineeji/ico_waterfall.png'
import ico_box_plot from '../../../../assets/img/ineeji/ico_box_plot.png'
import ico_table from '../../../../assets/img/ineeji/ico_table.png'
import ico_time_series_chart from '../../../../assets/img/ineeji/ico_time_series_chart.png'

import WidgetData from '../data/widget_list'

import { useRecoilState, useSetRecoilState } from 'recoil'
import { ShowWidgetModalState, WidgetInfoState } from '../../../hmid_config/recoil/config/atoms'

const WidgetListWrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
`

const WidgetIcon = styled.li<{ Type: string }>`
  list-style: none;
  width: calc(33.3% - 2vw);
  margin: 1vw !important;
  background-position: center top 0.6vw;
  background-repeat: no-repeat;
  background-size: auto 60%;
  padding-top: 20%;
  cursor: pointer;
  border-radius: 15px;
  &:hover {
    color: #0d99ff;
    font-weight: bold;
    background-color: #91caff69;
  }
  ${(props: any) => {
    if (props.Type === 'Line') {
      return `
      background-image: url(${ico_line});
      `
    } else if (props.Type === 'Bar') {
      return `
      background-image: url(${ico_bar});
      `
    } else if (props.Type === 'Time Series') {
      return `
      background-image: url(${ico_time_series_chart});
      `
    } else if (props.Type === 'Pie') {
      return `
      background-image: url(${ico_pie});
      `
    } else if (props.Type === 'Waterfall') {
      return `
      background-image: url(${ico_waterfall});
      `
    } else if (props.Type === 'Box Plot') {
      return `
      background-image: url(${ico_box_plot});
      `
    } else if (props.Type === 'Heatmap') {
      return `
      background-image: url(${ico_heatmap});
      `
    } else if (props.Type === 'Table') {
      return `
      background-image: url(${ico_table});
      `
    }
  }}
`

const WidgetText = styled.div`
  text-align: center;
  margin-top: 0.5vw;
`

export const WidgetModal: React.FC = () => {
  const { onClose } = Chakra.useDisclosure()
  const [WidgetType, setWidgetType] = React.useState<string>('chart')

  const [showWidgetModal, setShowWidgetModal] = useRecoilState(ShowWidgetModalState)
  const setWidgetInfo = useSetRecoilState(WidgetInfoState)

  const CreateTabItems = (type: string) => {
    const chart: any = []
    const component: any = []

    for (let i = 0, len = WidgetData.length; i < len; i++) {
      if (WidgetData[i].type === 'chart') {
        for (let j = 0, len = WidgetData[i].data.length; j < len; j++) {
          chart.push(
            <WidgetIcon
              id={WidgetData[i].data[j].name}
              key={WidgetData[i].data[j].name}
              Type={WidgetData[i].data[j].name}
              onClick={(e: any) => {
                WidgetClick(e.target.id)
              }}
            >
              <WidgetText>{WidgetData[i].data[j].name}</WidgetText>
            </WidgetIcon>
          )
        }
      } else if (WidgetData[i].type === 'component') {
        for (let j = 0, len = WidgetData[i].data.length; j < len; j++) {
          component.push(
            <WidgetIcon
              id={WidgetData[i].data[j].name}
              key={WidgetData[i].data[j].name}
              Type={WidgetData[i].data[j].name}
              onClick={(e: any) => {
                WidgetClick(e.target.id)
              }}
            >
              <WidgetText>{WidgetData[i].data[j].name}</WidgetText>
            </WidgetIcon>
          )
        }
      }
    }

    if (type === 'chart') {
      return chart
    } else {
      return component
    }
  }

  const WidgetClick = (widgetType: any) => {
    console.log(widgetType)

    // setWidgetInfo(widgetType)
    setShowWidgetModal(false)
  }

  return (
    <>
      <Chakra.Modal
        isCentered
        onClose={() => {
          setShowWidgetModal(false)
        }}
        isOpen={showWidgetModal}
        motionPreset="slideInBottom"
      >
        <Chakra.ModalOverlay />
        <Chakra.ModalContent>
          <Chakra.ModalHeader>Widget 선택</Chakra.ModalHeader>
          <Chakra.ModalCloseButton />
          <Chakra.ModalBody>
            <Chakra.Grid templateColumns="repeat(2, 1fr)" gap={3}>
              <Chakra.Button colorScheme="brand" mr={3} onClick={() => setWidgetType('chart')}>
                Chart
              </Chakra.Button>
              <Chakra.Button colorScheme="brand" mr={3} onClick={() => setWidgetType('component')}>
                Component
              </Chakra.Button>
            </Chakra.Grid>
            <WidgetListWrap>{CreateTabItems(WidgetType)}</WidgetListWrap>
          </Chakra.ModalBody>
          <Chakra.ModalFooter>
            <Chakra.Button id="design_button" colorScheme="brand" mr={3} onClick={onClose}>
              닫기
            </Chakra.Button>
          </Chakra.ModalFooter>
        </Chakra.ModalContent>
      </Chakra.Modal>
    </>
  )
}

export default WidgetModal
