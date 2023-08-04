import React, { useEffect, useState } from 'react'
import './style.css'
import { ContextMenuComponent, MenuItemModel } from '@syncfusion/ej2-react-navigations'
import { useRecoilValue } from 'recoil'
import { indexColumnStore } from 'views/DataAnalysis/store/variable/atom'

const ChartContextMenu = (props: any) => {
  const { onItemClicked } = props
  const indexColumn = useRecoilValue(indexColumnStore)

  const menuItems: MenuItemModel[] = [
    {
      id: 'item1',
      text: 'Exclude data',
      // iconCss: 'e-cm-icons e-cut',
    },
    {
      id: 'item2',
      text: 'View history',
      // iconCss: 'e-cm-icons e-cut',
    },
    // {
    //   text: 'Replace data',
    //   iconCss: 'e-cm-icons e-cut',
    // },
    // {
    //   text: 'Add threshold',
    //   iconCss: 'e-cm-icons e-cut',
    // },
    // {
    //   text: 'Add Series',
    //   iconCss: 'e-cm-icons e-cut',
    // },
  ]

  const onSelectItem = (e: any) => {
    // console.log('e.item', e)
    // if (e.item.id === 'menuitem_2') {
    onItemClicked(e.item.id, true)
    // }
  }
  return (
    <ContextMenuComponent
      target="#contextmenutarget"
      items={menuItems}
      select={onSelectItem}

      // items={indexColumn !== '' ? menuItems : []}
      // animationSettings={animationSettings}
      // beforeItemRender={addDisabled}
    />
  )
}

export default ChartContextMenu
