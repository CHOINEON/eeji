import React, { useEffect, useState } from 'react'
import './style.css'
import { ContextMenuComponent, MenuItemModel } from '@syncfusion/ej2-react-navigations'

const ChartContextMenu = (props: any) => {
  const { onItemClicked } = props
  const [clicked, setClicked] = useState(false)

  const menuItems: MenuItemModel[] = [
    {
      text: 'Exclude data',
      iconCss: 'e-cm-icons e-cut',
    },
    {
      text: 'Replace data',
      iconCss: 'e-cm-icons e-cut',
    },
    {
      text: 'Add threshold',
      iconCss: 'e-cm-icons e-cut',
    },
    {
      text: 'Add Series',
      iconCss: 'e-cm-icons e-cut',
    },
  ]

  const onSelectItem = (e: any) => {
    // console.log('e.item', e.item)
    // if (e.item.id === 'menuitem_2') {
    onItemClicked(e.item.id, true)
    // }
  }
  return (
    <ContextMenuComponent
      target="#contextmenutarget"
      items={menuItems}
      select={onSelectItem}
      // animationSettings={animationSettings}
      // beforeItemRender={addDisabled}
    />
  )
}

export default ChartContextMenu
