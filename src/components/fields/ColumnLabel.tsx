import styled from '@emotion/styled'
import React from 'react'

const ColumnLabel = ({ required, label }: any) => {
  return (
    <ColumnLabelWrapper>
      <span className={`${required ? 'text-red-500' : 'hidden'}`}>* </span>
      <Label>{label}</Label>
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
