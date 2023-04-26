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
import { Box, useColorModeValue, Stack, Button } from '@chakra-ui/react'
import { Input, Select, Radio, InputNumber } from 'antd'
import React from 'react'
import styled from '@emotion/styled'

const BoxParent = styled.div`
  display: flex;
  margin: 1vw 0;
  width: 100%;
  align-items: center;
`

const BoxParent2 = styled(BoxParent)`
  align-items: start;
`

const BoxParentMR = styled(BoxParent)`
  margin-right: 2vw;
  width: auto;
`

const BoxChild2 = styled.div`
  width: calc(50% - 1vw);
  margin-right: 0.5vw;
  background-color: #f4f7fe;
  border-radius: 10px;
  height: 31vw;
  padding: 2vw;
  border: 1px solid grey;
  position: relative;
`

const BoxChild2MR = styled(BoxChild2)`
  margin-right: 2vw;
`

const BoxTitle = styled.div`
  font-weight: bold;
  font-size: 1.3vw;
  position: absolute;
  width: 10vw;
  height: 3vw;
  line-height: 3vw;
  text-align: center;
  left: 2%;
  top: -5%;
  background-color: #f4f7fe;
`

const TitleLabel = styled.div`
  margin-right: 1vw;
  font-size: 1vw;
  width: 17vw;
`

const ButtonParentBox = styled(BoxParent)`
  justify-content: space-between;
  width: auto;
`

export default function Configuration() {
  //권한
  const [AdminInfo, setAdminInfo] = React.useState('block')

  const theme = useColorModeValue('navy.700', 'white')

  return (
    <>
      <Box
        pt={{ base: '130px', md: '80px', xl: '72px' }}
        pl={'50px'}
        pr={'50px'}
        style={{ position: 'relative', zIndex: 1000 }}
      >
        <BoxParent>
          <BoxParentMR>
            <TitleLabel style={{ width: '8vw' }}>HMI Mode</TitleLabel>
            <Select
              size={'large'}
              defaultValue={'Https'}
              options={[{ value: 'Https', label: 'Https' }]}
              style={{ margin: '0', width: '10vw !important' }}
            />
          </BoxParentMR>
          <BoxParent>
            <TitleLabel>Maximum view Connections</TitleLabel>
            <InputNumber value={2} size={'large'} />
          </BoxParent>
        </BoxParent>
        <BoxParent2>
          <BoxChild2MR>
            <BoxTitle>HMI Settings</BoxTitle>
            <div>
              <BoxParent>
                <TitleLabel>HTTP Port</TitleLabel>
                <InputNumber value={2} size={'large'} />
              </BoxParent>
              <BoxParent>
                <TitleLabel>Inactivity Timeout</TitleLabel>
                <InputNumber value={2} size={'large'} />
              </BoxParent>
              <BoxParent>
                <TitleLabel>Image Resolution</TitleLabel>
                <InputNumber value={2} size={'large'} />
              </BoxParent>
              <BoxParent>
                <TitleLabel style={{ width: '18.7vw' }}>Allow Local Storage</TitleLabel>
                <Radio value={1} defaultChecked />
              </BoxParent>
              <BoxParent>
                <TitleLabel style={{ width: '18.7vw' }}>Allow View Selection</TitleLabel>
                <Radio value={1} defaultChecked />
              </BoxParent>
              <BoxParent>
                <TitleLabel style={{ width: '18.7vw' }}>Allow Online/Offline</TitleLabel>
                <Radio value={1} defaultChecked />
              </BoxParent>
              <BoxParent>
                <TitleLabel style={{ width: '18.7vw' }}>Allow Live Video</TitleLabel>
                <Radio value={1} defaultChecked />
              </BoxParent>
              <BoxParent>
                <TitleLabel style={{ width: '18.7vw' }}>Allow Trigger</TitleLabel>
                <Radio value={1} defaultChecked />
              </BoxParent>
              <BoxParent>
                <TitleLabel style={{ width: '18.7vw' }}>Allow Adjust Image</TitleLabel>
                <Radio value={1} defaultChecked />
              </BoxParent>
            </div>
          </BoxChild2MR>
          <BoxChild2>
            <BoxTitle>HTTPS</BoxTitle>
            <div>
              <BoxParent>
                <TitleLabel style={{ width: '10.5vw' }}>HTTP Port</TitleLabel>
                <InputNumber value={8443} size={'large'} />
              </BoxParent>
              <BoxParent>
                <TitleLabel>Cognex Network Sever</TitleLabel>
                <Input size={'large'} />
              </BoxParent>
              <BoxParent>
                <TitleLabel>Password</TitleLabel>
                <Input size={'large'} />
              </BoxParent>
              <BoxParent>
                <TitleLabel>Allow Local Storage</TitleLabel>
                <Radio value={0} />
              </BoxParent>
              <BoxParent>
                <TitleLabel>Allow View Selection</TitleLabel>
                <Radio value={0} />
              </BoxParent>
            </div>
          </BoxChild2>
        </BoxParent2>
        <ButtonParentBox>
          <div>
            <Button style={{ padding: '1vw 2.3vw', backgroundColor: '#00a0e9', color: '#fff', fontSize: '1vw' }}>
              Help
            </Button>
          </div>
          <ButtonParentBox>
            <Button
              style={{
                padding: '1vw 2.3vw',
                backgroundColor: '#00a0e9',
                color: '#fff',
                fontSize: '1vw',
                marginRight: '1vw',
              }}
            >
              Ok
            </Button>
            <Button style={{ padding: '1vw 2.3vw', backgroundColor: '#00a0e9', color: '#fff', fontSize: '1vw' }}>
              Cancel
            </Button>
          </ButtonParentBox>
        </ButtonParentBox>
      </Box>
    </>
  )
}
