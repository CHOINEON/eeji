import styled from '@emotion/styled'
import { useRecoilState } from 'recoil'
import { selectedDataState } from 'views/AIModelGenerator/store/dataset/atom'
import { Text, Title } from '../Input/Text'

const DataInfoBox = () => {
  const selectedData = useRecoilState(selectedDataState)

  return (
    <>
      <SummaryDiv>
        <>
          <ItemContent>
            <Title>Target variable</Title>
            <Text>{selectedData[0]?.targetY}</Text>
          </ItemContent>
          <ItemContent>
            <Title>Type</Title>
            <Text>{selectedData[0]?.isClassification ? 'classification' : 'regression'}</Text>
          </ItemContent>
          <ItemContent>
            <Title>Created</Title>
            <Text>{selectedData[0]?.createDate}</Text>
          </ItemContent>
        </>
      </SummaryDiv>
    </>
  )
}

export default DataInfoBox

const SummaryDiv = styled.div`
  width: 100px;
  margin: 10px;
  border-radius: 15px;
  display: inline-block;
  text-align: center;
  width: 100%;
  border: 1px dotted #d5dcef;
  box-shadow: 0px 0px 10px #0000001a;
  padding: 1em;
  background-color: #d5dcef;
`

const ItemContent = styled.div`
  width: 33%;
  height: 100%;
  display: inline-block;
  float: left;
`
