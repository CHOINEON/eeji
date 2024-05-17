import styled from '@emotion/styled'
import { Tag } from 'antd'
import { useState } from 'react'

//모델명/타겟변수/모델유형
const ModelRow = ({ item, active, onClick }: any) => {
  const ModelType = ({ isClassification }: any) => {
    const category = [
      { type: 'regression', isClassification: 0, color: '#2db7f5' },
      { type: 'classification', isClassification: 1, color: '#FF973D' },
    ]
    const typeObj = category.filter((item) => item.isClassification === isClassification)[0]

    return (
      <TagWrapper>
        <Tag
          color={typeObj.color}
          style={{
            width: '100%',
            fontSize: 10,
            lineHeight: '15px',
            margin: 'auto !important',
            display: 'block',
            textAlign: 'center',
            letterSpacing: 0.1,
          }}
        >
          {typeObj.type}
        </Tag>
      </TagWrapper>
    )
  }

  return (
    <>
      <Row
        role="button"
        onClick={onClick}
        className={`hover:bg-[#D5DCEF] ${active === true ? 'bg-[#D5DCEF]' : 'bg-[#F6F8FF] '}`}
      >
        <ModelTitle>{item.model_name}</ModelTitle>
        <TargetText>{item.target_y}</TargetText>
        <ModelType isClassification={item.is_classification}></ModelType>
      </Row>
    </>
  )
}

const ModelList = ({ data, onSelect }: any) => {
  console.log('data::', data)
  const [btnActive, setBtnActive] = useState(0)

  const toggleActive = (idx: number) => {
    setBtnActive(idx)
    onSelect(data[idx].model_id)
  }

  return (
    <ModelListWrapper>
      {data?.map((item: any, idx: number) => (
        <ModelRow key={idx} item={item} active={idx === btnActive} onClick={() => toggleActive(idx)} />
      ))}
    </ModelListWrapper>
  )
}

export default ModelList

const ModelListWrapper = styled.div`
  height: 400px;
  overflow-y: scroll;
  overflow: -moz-scrollbars-vertical;

  &::-webkit-scrollbar {
    background: #332bbf;
    border-radius: 30%; //width가 너무 작아서 안보임..
    width: 4px;
    display: flex;
    overflow: auto;
  }
  &::-webkit-scrollbar-thumb {
    background: #332bbf;
    border-radius: 10%;
  }

  &::-webkit-scrollbar-track {
    background: #d5dcef;
    border-radius: 10%;
  }
`

const Row = styled.div`
  display: block;
  width: 100%;
  height: 40px;
  margin-bottom: 5px;
  border: 1px solid #d5dcef;
  border-radius: 10px;
  padding: 5px 15px;
`
const ModelTitle = styled.div`
  text-align: center;
  width: 56%;
  height: 100%;
  display: inline-block;
  float: left;
  font-family: 'Helvetica Bold';
  font-size: 15px;
  line-height: 28px;
  color: #002d65;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`

const TargetText = styled.div`
  width: 20%;
  line-height: 28px;
  display: inline-block;
  float: left;
  font-family: 'Helvetica Neue';
  font-size: 11px;
  color: #002d65;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`

const TagWrapper = styled.div`
  width: 24%;
  display: inline-block;
  float: right;
  margin-top: 5px;
`
