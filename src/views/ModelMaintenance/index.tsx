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
import { useColorModeValue, Box } from '@chakra-ui/react'
import { Button, Checkbox, Form, Input } from 'antd'
import styled from '@emotion/styled'
import React from 'react'

const FormBox = styled.div`
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0px 5px 10px #4338f733;
  padding: 1.3vw;
`

const SboxParent = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`

const SBox = styled(FormBox)`
  width: calc(50% - 0.5vw);
  height: 100%;
  margin-right: 1vw;
`

const BBox = styled(FormBox)`
  width: 100%;
  margin-top: 1vw;
`

const FormTitle = styled.div`
  font-weight: bold;
  color: #000;
  margin-bottom: 1vw;
`

export default function LayoutConfig() {
  const theme = useColorModeValue('navy.700', 'white')

  return (
    <Box
      pt={{ base: '130px', md: '80px', xl: '150px' }}
      style={{ position: 'relative', zIndex: 1000 }}
      pl={'50px'}
      pr={'50px'}
    >
      <SboxParent>
        <SBox>
          <FormTitle>Stacked Form</FormTitle>
          <Form labelCol={{ span: 4 }} wrapperCol={{ span: 14 }} layout="horizontal" style={{ maxWidth: 600 }}>
            <Form.Item label="Email Address">
              <Input value="" style={{ backgroundColor: '#F4F7FE', border: '1px solid #A3AFCF', width: '27vw' }} />
            </Form.Item>
            <Form.Item label="Password">
              <Input
                type="password"
                value=""
                style={{ backgroundColor: '#F4F7FE', border: '1px solid #A3AFCF', width: '27vw' }}
              />
            </Form.Item>
            <Form.Item valuePropName="Password">
              <Checkbox>Password</Checkbox>
            </Form.Item>
            <Form.Item>
              <Button
                id="design_button"
                style={{
                  backgroundColor: '#4338F7',
                  color: '#fff',
                  border: '0',
                  borderRadius: '100px',
                  width: '10vw',
                }}
              >
                SUBMIT
              </Button>
            </Form.Item>
          </Form>
        </SBox>
        <SBox style={{ marginRight: 0 }}>
          <FormTitle>Horizontal Form</FormTitle>
          <Form labelCol={{ span: 4 }} wrapperCol={{ span: 14 }} layout="horizontal" style={{ maxWidth: 600 }}>
            <Form.Item label="UserName">
              <Input value="" style={{ backgroundColor: '#F4F7FE', border: '1px solid #A3AFCF', width: '27vw' }} />
            </Form.Item>
            <Form.Item label="Email">
              <Input value="" style={{ backgroundColor: '#F4F7FE', border: '1px solid #A3AFCF', width: '27vw' }} />
            </Form.Item>
            <Form.Item valuePropName="RememberMe">
              <Checkbox>RememberMe</Checkbox>
            </Form.Item>
            <Form.Item>
              <Button
                id="design_button"
                style={{
                  backgroundColor: '#4338F7',
                  color: '#fff',
                  border: '0',
                  borderRadius: '100px',
                  width: '10vw',
                }}
              >
                SUGN IN
              </Button>
            </Form.Item>
          </Form>
        </SBox>
      </SboxParent>
      <BBox>
        <FormTitle>Form Elements</FormTitle>
        <Form labelCol={{ span: 4 }} wrapperCol={{ span: 14 }} layout="horizontal" style={{ maxWidth: 600 }}>
          <Form.Item label="Email Address">
            <Input value="" style={{ backgroundColor: '#f4f7fe', border: '1px solid #a3afcf', width: '64vw' }} />
          </Form.Item>
          <Form.Item label="Password">
            <Input
              type="password"
              value=""
              style={{ backgroundColor: '#F4F7FE', border: '1px solid #A3AFCF', width: '64vw' }}
            />
          </Form.Item>
          <Form.Item label="Placeholder">
            <Input style={{ backgroundColor: '#F4F7FE', border: '1px solid #A3AFCF', width: '64vw' }} />
          </Form.Item>
          <Form.Item label="Disabled">
            <Input
              placeholder="Disabled input here"
              style={{ backgroundColor: '#F4F7FE', border: '1px solid #A3AFCF', width: '64vw' }}
            />
          </Form.Item>
          <Form.Item>
            <div>Static control hello@smartlements.com</div>
          </Form.Item>
        </Form>
      </BBox>
    </Box>
  )
}
