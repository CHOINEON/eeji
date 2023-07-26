import React from 'react'

export interface ItemBoxProps {
  title: string
  component: any
}

const ItemBox: React.FC<ItemBoxProps> = (props) => {
  const { title, component } = props

  return (
    <div>
      <h3>{title}</h3>
      <div className="item-box">{component}</div>
    </div>
  )
}

export default ItemBox
