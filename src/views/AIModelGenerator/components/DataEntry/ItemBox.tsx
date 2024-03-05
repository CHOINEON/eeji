import React, { useEffect, useState } from 'react'

export interface ItemBoxProps {
  title?: string
  component?: any
  style?: any
  visible?: boolean
}

const ItemBox: React.FC<ItemBoxProps> = (props) => {
  const { title, component, style, visible } = props
  const [displayOption, setDisplayOption] = useState('block')

  useEffect(() => {
    if (visible === undefined || true) setDisplayOption('block')
    if (visible === false) setDisplayOption('none')
  }, [props.visible])

  return (
    <div style={{ display: displayOption }}>
      <h3>{title}</h3>
      <div style={style}>{component}</div>
    </div>
  )
}

export default ItemBox
