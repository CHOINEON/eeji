import React from "react";
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
  Stack,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { MdOutlineGridOn } from "react-icons/md";
import styled from "@emotion/styled";

import ico_line from "../../../assets/img/ineeji/ico_line.png";
import ico_bar from "../../../assets/img/ineeji/ico_bar.png";
import ico_pie from "../../../assets/img/ineeji/ico_pie.png";
import ico_heatmap from "../../../assets/img/ineeji/ico_heatmap.png";
import ico_scatter_plot from "../../../assets/img/ineeji/ico_scatter_plot.png";
import ico_waterfall from "../../../assets/img/ineeji/ico_waterfall.png";
import ico_box_plot from "../../../assets/img/ineeji/ico_box_plot.png";
import ico_table from "../../../assets/img/ineeji/ico_table.png";

import WidgetData from "../data/widget_list";

const WidgetIcon = styled.li<{ Type: string }>`
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
    if (props.Type === "Line") {
      return `
      background-image: url(${ico_line});
      `;
    } else if (props.Type === "Bar") {
      return `
      background-image: url(${ico_bar});
      `;
    } else if (props.Type === "Pie") {
      return `
      background-image: url(${ico_pie});
      `;
    } else if (props.Type === "Waterfall") {
      return `
      background-image: url(${ico_waterfall});
      `;
    } else if (props.Type === "Scatter Plot") {
      return `
      background-image: url(${ico_scatter_plot});
      `;
    } else if (props.Type === "Box Plot") {
      return `
      background-image: url(${ico_box_plot});
      `;
    } else if (props.Type === "Heatmap") {
      return `
      background-image: url(${ico_heatmap});
      `;
    } else if (props.Type === "Table") {
      return `
      background-image: url(${ico_table});
      `;
    }
  }}
`;

const WidgetText = styled.div`
  text-align: center;
  margin-top: 0.5vw;
`;

interface WidgetModalProps {
  WidgetModalisOpen: boolean;
  setCloseWidgetModal: (isClose: boolean) => void;
  setWidgetInfo: (gridInfo: string) => void;
}

export const WidgetModal: React.FC<WidgetModalProps> = (props) => {
  const { onClose } = useDisclosure();

  const CreateTabItems = (type: string) => {
    let chart: any = [];
    let component: any = [];

    for (let i = 0, len = WidgetData.length; i < len; i++) {
      if (WidgetData[i].type === "chart") {
        for (let j = 0, len = WidgetData[i].data.length; j < len; j++) {
          chart.push(
            <WidgetIcon
              key={WidgetData[i].data[j].name}
              Type={WidgetData[i].data[j].name}
              onClick={(e: any) => {
                WidgetClick(e);
              }}
            >
              <WidgetText>{WidgetData[i].data[j].name}</WidgetText>
            </WidgetIcon>
          );
        }
      } else if (WidgetData[i].type === "component") {
        for (let j = 0, len = WidgetData[i].data.length; j < len; j++) {
          component.push(
            <WidgetIcon
              key={WidgetData[i].data[j].name}
              Type={WidgetData[i].data[j].name}
              onClick={(e: any) => {
                WidgetClick(e);
              }}
            >
              <WidgetText>{WidgetData[i].data[j].name}</WidgetText>
            </WidgetIcon>
          );
        }
      }
    }

    if (type === "chart") {
      return chart;
    } else {
      return component;
    }
  };

  const WidgetClick = (widgetType: any) => {
    console.log(widgetType);
    console.log("test");
  };

  return (
    <>
      <Modal
        isCentered
        onClose={() => {
          props.setCloseWidgetModal(true);
        }}
        isOpen={props.WidgetModalisOpen}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Layout 선택</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns="repeat(2, 1fr)" gap={3}>
              <Button
                colorScheme="brand"
                mr={3}
                onClick={() => CreateTabItems("chart")}
              >
                Chart
              </Button>
              <Button
                colorScheme="brand"
                mr={3}
                onClick={() => CreateTabItems("component")}
              >
                Component
              </Button>
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
  );
};

export default WidgetModal;
