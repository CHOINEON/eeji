import React, { StyleHTMLAttributes, useEffect } from 'react'

export interface ItemBoxProps {
  title?: string
  component?: any
  style?: any
}

const ItemBox: React.FC<ItemBoxProps> = (props) => {
  const { title, component, style } = props

  return (
    <>
      <h3>{title}</h3>
      <div style={style}>{component}</div>
    </>
  )
}

export default ItemBox
