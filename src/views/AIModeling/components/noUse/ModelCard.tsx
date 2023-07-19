import React from 'react'
import styled from '@emotion/styled'
import { Badge, Descriptions, Typography } from 'antd'
import { stepCountStore } from '../../store/atom'
import { useRecoilState, useSetRecoilState } from 'recoil'

const Card = styled.div`
  display: block;
  background-color: white;
  border-radius: 0px;
  box-shadow: 0px 5px 20px #4338f733;
  float: left;
  width: 20vw;
  height: 20vh;
  opacity: 1;
  margin: 10px;
  cursor: pointer;
  &:hover {
    background-color: #91caff69;
  }
`

const ModelCard = (props: any) => {
  const { data, onClicked } = props
  const { Text, Link } = Typography
  const [activeStep, setActiveStep] = useRecoilState(stepCountStore)

  const handleClick = () => {
    alert('clicked:')
    onClicked(data)

    // setActiveStep(activeStep + 1)
  }

  return (
    <Card onClick={handleClick}>
      {/* <Descriptions title={data.model_name}>
        <Descriptions.Item label="Model Name"> {data.model_name}</Descriptions.Item>
        <Descriptions.Item label="Model Type">{data.model_type}</Descriptions.Item>
        <Descriptions.Item label="x value">{data.x_value}</Descriptions.Item>
        <Descriptions.Item label="y value"> {data.y_value}</Descriptions.Item>
        <Descriptions.Item label="Create">{data.create_date}</Descriptions.Item>
      </Descriptions> */}

      <div style={{ margin: '15px' }}>
        <div style={{ marginBottom: '15px' }}>
          <Typography.Title level={3} style={{ margin: 0 }}>
            {data.model_name}
          </Typography.Title>
          <Typography.Title level={4} style={{ margin: 0 }}>
            {/* <Text type="secondary"></Text> */}
            {data.model_type}
          </Typography.Title>
        </div>

        <div>
          <Text type="secondary">X: </Text>
          {data.x_value}
        </div>
        <div>
          <Text type="secondary">Y : </Text>
          {data.y_value}
        </div>
        <div>
          <Text type="secondary">Create : </Text>
          {data.create_date}
        </div>
      </div>
    </Card>
  )
}

export default ModelCard
