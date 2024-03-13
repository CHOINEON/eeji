import React, { useEffect, useState } from 'react'
import { Button, Tabs } from 'antd'
import tw from 'tailwind-styled-components'
import TabChild from './ModelGeneratorResult'
import { v4 } from 'uuid'

const TabTitle = tw.p`
  text-sm
  text-[#FFFFFF]
  text-center
  // color:'black'
`

type TargetKey = React.MouseEvent | React.KeyboardEvent | string

const TabContainer = () => {
  const defaultPanes = Array(1)
    .fill(null)
    .map((_, index) => {
      const id = String(index + 1)
      const key = v4()

      return {
        label: <TabTitle>{`Data Analysis ${id}`}</TabTitle>,
        children: <TabChild key={key} />,
        key: key,
        // closable: index == 0 ? false : true,
      }
    })

  const [activeKey, setActiveKey] = useState(defaultPanes[0].key)
  const [items, setItems] = useState(defaultPanes)
  const onChange = (key: string) => {
    setActiveKey(key)
  }

  const add = () => {
    //
  }

  const remove = (targetKey: TargetKey) => {
    const targetIndex = items.findIndex((pane) => pane.key === targetKey)
    const newPanes = items.filter((pane) => pane.key !== targetKey)

    if (newPanes.length && targetKey === activeKey) {
      const { key } = newPanes[targetIndex === newPanes.length ? targetIndex - 1 : targetIndex]
      setActiveKey(key)
    }
    setItems(newPanes)
  }

  const onEdit = (targetKey: TargetKey, action: 'add' | 'remove') => {
    if (action === 'add') add()
    else remove(targetKey)
  }

  return (
    <>
      <Tabs hideAdd activeKey={activeKey} type="editable-card" items={items} onChange={onChange} onEdit={onEdit} />
    </>
  )
}

export default TabContainer
