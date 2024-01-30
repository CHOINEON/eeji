import styled from '@emotion/styled'
import React from 'react'
import CollapseItem from './CollapseItem'
import { DownOutlined } from '@ant-design/icons'

const CustomCollapse = () => {
  return (
    <>
      <Title>
        <div style={{ width: '90%', display: 'inline-block' }}>Now Processing</div>
        <DownOutlined role="button" style={{ color: 'white', fontWeight: 'bold' }} />
      </Title>

      <SingleLine />
      <CollapseItem />
    </>
  )
}

export default CustomCollapse

const Title = styled.p`
  font-family: 'Helvetica Neue';
  font-weight: bold;
  color: white;
  font-size: 14px;
  margin: 10px 30px;
`
const SingleLine = styled.hr`
  color: #ffffff;
  width: 80%;
  margin: 0 25px;
  opacity: 0.25;
`
