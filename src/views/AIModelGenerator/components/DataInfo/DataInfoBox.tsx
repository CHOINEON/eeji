import styled from '@emotion/styled'
import { useRecoilState } from 'recoil'
import { selectedDataState } from 'views/AIModelGenerator/store/dataset/atom'
import { Text, Title } from '../Input/Text'
import { SquareItemBox } from './DescriptionBox'

const DataInfoBox = () => {
  const selectedData = useRecoilState(selectedDataState)

  return (
    <>
      <SummaryDiv>
        <>
          <div className="w-1/3 h-full inline-block">
            <Title>Target variable</Title>
            <Text>{selectedData[0]?.targetY}</Text>
          </div>
          <div className="w-1/3 h-full inline-block">
            <Title>Type</Title>
            <Text>{selectedData[0]?.isClassification ? 'classification' : 'regression'}</Text>
          </div>
          <div className="w-1/3 h-full inline-block">
            <Title>Created</Title>
            <Text>{selectedData[0]?.createDate}</Text>
          </div>
        </>
      </SummaryDiv>
    </>
  )
}

export default DataInfoBox

const SummaryDiv = styled(SquareItemBox)`
  width: 100%;
  height: 100px;
  border: 1px dotted #d5dcef;
  box-shadow: 0px 0px 10px #0000001a;
  padding: 2em;
  background-color: #d5dcef;
`
