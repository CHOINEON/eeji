import styled from '@emotion/styled'
import React from 'react'

const ColumnLabel = ({ required, label }: any) => {
  return (
    <div className="mb-1">
      <span className={`${required ? 'text-red-500' : 'hidden'}`}>* </span>
      <Label>{label}</Label>
    </div>
  )
}

export default ColumnLabel

const Label = styled.span`
  font-family: 'Helvetica Neue';
  color: #002d65;
  font-size: 12px;
`
