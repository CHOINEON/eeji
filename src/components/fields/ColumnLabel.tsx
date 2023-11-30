import React from 'react'

const ColumnLabel = ({ required, label }: any) => {
  return (
    <div className="mb-1">
      <span className={`${required ? 'text-red-500' : 'hidden'}`}>* </span>
      <span style={{ color: '#002d65', fontSize: '12px' }}>{label}</span>
    </div>
  )
}

export default ColumnLabel
