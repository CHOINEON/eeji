import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import Title from 'antd/es/typography/Title'
import InfoCircle from 'views/DataAnalysis/components/Icon/InfoCircle'
import { Col, Image, Row, Skeleton, Tag } from 'antd'

const { CheckableTag } = Tag

const PdpResult = ({ data }: any) => {
  const [formattedData, setFormattedData] = useState([])
  const [checkedTag, setCheckedTag] = useState({ name: '', img: '' })

  useEffect(() => {
    if (Object.keys(data).length > 0) {
      // console.log('pdp data:', data)
      setCheckedTag({ name: data.name[0], img: data.img[0] })
      renderFeatureTags(data)
    }
  }, [data])

  const renderFeatureTags = (obj: any) => {
    const result = []
    for (let i = 0; i < obj['img'].length; i++) {
      result.push({ name: obj['name'][i], img: obj['img'][i] })
    }

    setFormattedData(result)
  }

  const handleChange = (tag: any, checked: boolean) => {
    // console.log('tag:', tag)
    setCheckedTag({ name: tag.name, img: tag.img })
  }

  return (
    <>
      <RoundedBox height={'370px'}>
        <Title level={4} style={{ color: '#002D65', display: 'inline-block', width: '80%' }}>
          PDP
          <InfoCircle content="하나의 변수가 예측 결과에 미치는 주변 효과" />
        </Title>
        <Row>
          <Col span={4}>
            {formattedData.map((tag, i) => {
              return (
                <CheckableTag
                  key={i}
                  checked={checkedTag?.name === tag.name}
                  onChange={(checked) => handleChange(tag, checked)}
                >
                  {tag.name}
                </CheckableTag>
              )
            })}
          </Col>
          <Col span={20}>
            <Image src={'http://222.121.66.49:8000/' + checkedTag.img} style={{ marginTop: '30px' }} />
          </Col>
        </Row>
        <div></div>
        <div>{/* <Skeleton.Image active={true} /> */}</div>
      </RoundedBox>
    </>
  )
}

export default PdpResult

interface Container {
  width?: any
  height?: any
  minHeight?: any
  position?: string
}

const Container = styled.div`
  width: 100%;
  height: 35vw;
  margin-top: 2vw;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
`

const RoundedBox = styled.div<Container>`
  margin-right: 0.5vw;
  background-color: #fff;
  box-shadow: 0px 5px 10px #4338f733;
  border-radius: 20px;
  padding: 2vw;
  width: ${(props) => (props.width ? props.width : 'auto')};
  height: ${(props) => (props.height ? props.height : 'auto')};
  min-height: ${(props) => (props.minHeight ? props.minHeight : 'auto')};
  position: ${(props) => (props.position ? props.position : 'relative')};
`
