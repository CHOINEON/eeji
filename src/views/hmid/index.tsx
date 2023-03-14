/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2022 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// Chakra imports
import { Box, useColorModeValue, Stack, Button } from "@chakra-ui/react";

import React from "react";
import {
  MdOutlineGridView,
  MdOutlineSettingsInputComposite,
  MdSave,
  MdOutlineRestartAlt,
} from "react-icons/md";
import LayoutModal from "./components/LayoutListModal";

//function
import GridLayoutBox from "./function/GridLayout";

export default function HMID() {
  const [ButtonDisabled, setButtonDisabled] = React.useState<boolean>(true);
  const [OpenLayoutModal, setOpenLayoutModal] = React.useState<boolean>(false);
  const [GridInfo, setGridInfo] = React.useState<string>();
  const [ItemColor, setItemColor] = React.useState("#0044620f");

  //권한
  const [AdminInfo, setAdminInfo] = React.useState("block");

  let theme = useColorModeValue("navy.700", "white");
  console.log(theme);
  // #ffffff0f

  return (
    <>
      <LayoutModal
        isOpen={OpenLayoutModal}
        setClose={(isClose: boolean) => {
          if (isClose) {
            setOpenLayoutModal(false);
          }
        }}
        setGridInfo={(gridInfo: string) => {
          if (gridInfo !== undefined) {
            setGridInfo(gridInfo);
            setButtonDisabled(false);
          }
        }}
      />
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <Stack direction="row" spacing={4} pl={3} display={AdminInfo}>
          <Button
            leftIcon={<MdOutlineGridView />}
            variant="brand"
            onClick={() => {
              setOpenLayoutModal(true);
            }}
          >
            Grid
          </Button>
          <Button
            leftIcon={<MdOutlineSettingsInputComposite />}
            variant="brand"
            disabled={ButtonDisabled}
          >
            Option
          </Button>
          <Button
            leftIcon={<MdOutlineRestartAlt />}
            variant="brand"
            onClick={() => {
              setGridInfo("reset");
            }}
          >
            Reset
          </Button>
          <Button leftIcon={<MdSave />} variant="brand">
            Save
          </Button>
        </Stack>
        {/* <Box>{renderGrid(GridInfo)}</Box> */}
        <Box>
          <GridLayoutBox gridInfo={GridInfo} />
        </Box>
      </Box>
    </>
  );
}
