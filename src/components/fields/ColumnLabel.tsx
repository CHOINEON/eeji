import styled from '@emotion/styled'
import InfoCircle from 'views/AIModelGenerator/components/Icon/InfoCircle'

const ColumnLabel = ({ required, label, tooptipTitle }: any) => {
  return (
    <ColumnLabelWrapper>
      <span className={`${required ? 'text-red-500' : 'hidden'}`}>* </span>
      <Label>{label}</Label>
      {tooptipTitle && <InfoCircle content={tooptipTitle} styleClass="ml-2 text-sm" />}
    </ColumnLabelWrapper>
  )
}

export default ColumnLabel

const ColumnLabelWrapper = styled.div`
  display: block;
  margin-bottom: 1px;
  width: 100%;
`
const Label = styled.span`
  font-family: 'Helvetica Neue';
  color: #002d65;
  font-size: 12px;
  letter-spacing: 0.2px;
`
