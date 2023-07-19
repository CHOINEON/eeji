/**
 * INFINITE OPTIMAL
 * 메뉴 : ModelMaintenance
 * 최종 수정 날짜 : 2023-07-06
 * 개발자 : 박윤희 (BAK YUN HEE)
 */

// Chakra imports
import { useColorModeValue, Box } from '@chakra-ui/react'
import { Button, Checkbox, Form, Input } from 'antd'
import styled from '@emotion/styled'
import React from 'react'
import { useTranslation } from 'react-i18next'

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

  //다국어 처리를 위한 t 선언
  const { t } = useTranslation('main')

  return (
    <Box
      pt={{ base: '130px', md: '80px', xl: '100px' }}
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
              <Checkbox>{t('test')}</Checkbox>
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
