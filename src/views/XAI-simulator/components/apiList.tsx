/* eslint-disable @typescript-eslint/no-loss-of-precision */
import styled from '@emotion/styled'
import { Tag, Checkbox, Button, Badge } from 'antd'
import Item from 'antd/es/list/Item'
import React, { useState } from 'react'
import './antdCustom.css'

const PredictionRow = ({ item, active, onClick }: any) => {
  const PredictionType = ({ isClassification }: any) => {
    const category = [
      { type: 'tag01', isClassification: 0, color: '#000000' },
      { type: 'tag02', isClassification: 1, color: '#000000' },
      { type: 'tag03', isClassification: 1, color: '#000000' },
    ]
    // console.log('category:', category[0].color)
    const typeObj = category.filter((item) => item.isClassification === isClassification)[0]

    return (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <TagWrapper>
          <Tag
            // color={category[0].color}
            style={{
              width: '100%',
              fontSize: 10,
              lineHeight: '15px',
              margin: 'auto !important',
              display: 'block',
              textAlign: 'center',
              paddingTop: '3px',
              letterSpacing: 0.1,
            }}
          >
            {category[0].type}
          </Tag>
          <Tag
            // color={category[1].color}
            style={{
              width: '100%',
              fontSize: 10,
              lineHeight: '15px',
              margin: 'auto !important',
              display: 'block',
              textAlign: 'center',
              letterSpacing: 0.1,
              paddingTop: '3px',
            }}
          >
            {category[1].type}
          </Tag>
          <Tag
            // color={category[1].color}
            style={{
              width: '100%',
              fontSize: 10,
              lineHeight: '15px',
              margin: 'auto !important',
              display: 'block',
              textAlign: 'center',
              letterSpacing: 0.1,
              paddingTop: '3px',
            }}
          >
            {category[1].type}
          </Tag>
          <Tag
            style={{
              width: '100%',
              fontSize: 10,
              lineHeight: '15px',
              margin: 'auto !important',
              display: 'block',
              textAlign: 'center',
              letterSpacing: 0.1,
              paddingTop: '3px',
            }}
          >
            {category[2].type}
          </Tag>
        </TagWrapper>
        <div style={{ flex: 1, textAlign: 'center', marginTop: '7px' }}>
          <Badge status="success"></Badge>
          {item.user_id}
        </div>{' '}
        <div style={{ flex: 1, textAlign: 'center', marginTop: '7px' }}>
          <Badge status="success"></Badge>
          {item.user_id}
        </div>
        <div style={{ flex: 1, textAlign: 'center', marginTop: '5px' }}>
          <Button
            style={{
              height: '28px',
              width: '75px',
              background: '#4338F7',
              padding: '0px 10px',
              color: '#fff',
            }}
          >
            Publish
          </Button>
        </div>
      </div>
    )
  }
  return (
    <>
      <Row
        role="button"
        onClick={onClick}
        className={`hover:bg-[#D5DCEF] ${active === true ? 'bg-[#D5DCEF]' : 'bg-[#F6F8FF] '}`}
      >
        <TargetText>
          {' '}
          <Checkbox></Checkbox>
          {item.create_date}
        </TargetText>
        <ModelTitle>{item.model_name}</ModelTitle>
        <TargetText>{item.target_y}</TargetText>

        <PredictionType isClassification={item.is_classification}></PredictionType>
      </Row>
    </>
  )
}

const PredictionList = ({ data, onSelect }: any) => {
  const [btnActive, setBtnActive] = useState(0)

  const toggleActive = (idx: number) => {
    setBtnActive(idx)
    onSelect(data[idx].model_id)
  }

  return (
    <>
      {data?.map((item: any, idx: number) => (
        <PredictionListWrapper>
          <PredictionRow key={idx} item={item} active={idx === btnActive} onClick={() => toggleActive(idx)} />
        </PredictionListWrapper>
      ))}
    </>
  )
}
export default PredictionList

const Row = styled.div`
  display: block;
  width: 100%;
  height: 38px;

  border-radius: 10px;
`

const PredictionListWrapper = styled.div`
  height: 40px;
  align-item: 'center';
  border-radius: 10px;
  border: 1px solid #d5dcef;
  margin-bottom: 5px;
  // overflow-y: scroll;
  // overflow: -moz-scrollbars-vertical;
  &::-webkit-scrollbar {
    display: flex;
    border-radius: 30%;
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #332bbf;
    border-radius: 10%;
    // overflow: auto;
  }
  &::-webkit-scrollbar-track {
    background: #d5dcef;
    border-radius: 10%;
  }
`
const ModelTitle = styled.div`
  width: 20%;
  height: 100%;
  display: inline-block;
  float: left;
  font-family: 'Helvetica Neue ';
  font-size: 17px;
  line-height: 38px;
  color: #002d65;
  align-item: 'center';
`
const TargetText = styled.div`
  width: 13%;
  line-height: 35px;
  display: inline-block;
  float: left;
  font-family: 'Helvetica Neue';
  font-size: '17px';
  color: #002d65;
  text-align: 'center';
`

const TagWrapper = styled.div`
  flex: 1;
  display: flex;
  margin-top: 7px;
  text-align: center;
  overflow: hidden  
  width: 200;
  // background: red;
  text-overflow: eclipsis;
`
const ButtonWrapper = styled.div`
  width: 10%;
  float: 'right';
  margin-top: 5px;
`
const PublishButton = styled.button`
  width: 100%;
  height: 36px;
  background-color: #043DFF' ;
  display: 'block'
  border-radius: 10px;
  font-face: 'Helvetica Neue';`
