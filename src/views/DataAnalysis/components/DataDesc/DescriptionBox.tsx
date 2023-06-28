import React, { useEffect } from 'react'
import styled from '@emotion/styled'
import '../../style/uploader.css'
import { Button, Typography } from 'antd'
import { useSetRecoilState } from 'recoil'
import { stepCountStore } from 'views/DataAnalysis/atom'

const ContentContainer = styled.div`
  display: block;
  float: left;
  background-color: #fff;
  width: 100%;
  height: 150px;
  border: 1px solid lightgray;
  &:hover {
    color: #0d99ff;
    background-color: #91caff69;
  }
`
const Content = styled.div`
  display: block;
  color: gray;
  font-size: 15px;
`
const TitleWrapper = styled.div`
  display: block;
  margin: 20px;
`

export interface DescriptionBoxProps {
  name: string
  totalSize: string
  create: string
  update: string
}

export interface IDescriptionBox {
  data: DescriptionBoxProps
}

const DescriptionBox: React.FC<IDescriptionBox> = (props: any) => {
  const setActiveStep = useSetRecoilState(stepCountStore)
  const { name, totalSize, create, update } = props.data

  const handleClick = () => {
    setActiveStep(1)
  }

  return (
    <>
      <ContentContainer onClick={handleClick}>
        <TitleWrapper>
          <Typography.Title level={3}>{name}</Typography.Title>
        </TitleWrapper>
        <div
          className="container"
          style={{
            display: 'flex',

            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-evenly',
          }}
        >
          <Content>
            <div>Total Size</div>
            <div>{totalSize}</div>
          </Content>
          <Content>
            {' '}
            <div>Create</div>
            <div>{create}</div>
          </Content>
          <Content>
            {' '}
            <div>Update</div>
            <div>{update}</div>
          </Content>
          {/* <Content>
            {' '}
            <div>Column</div>
            <div>344</div>
          </Content>
          <Content>
            <div>Row</div>
            <div>23523</div>
          </Content> */}
        </div>
      </ContentContainer>
    </>
  )
}

export default DescriptionBox
