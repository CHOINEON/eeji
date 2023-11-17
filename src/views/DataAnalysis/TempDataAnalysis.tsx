import { Button, Tabs } from 'antd'
import { remove } from 'lodash'
import React, { useEffect, useState } from 'react'
import { styled } from 'styled-components'
import RegressionCoefficient from './RegressionCoefficient'

type TargetKey = React.MouseEvent | React.KeyboardEvent | string

const defaultPanes = new Array(2).fill(null).map((_, index) => {
  const id = String(index + 1)
  return {
    label: `Data Analysis ${id}`,
    children: `Content of Tab Pane ${index + 1}`,
    key: id,
    // closable: index == 0 ? false : true,
  }
})

const newTemplate = (data: any) => {
  useEffect(() => {
    console.log('newTemplate data:', data)
  }, [data])

  return (
    <div style={{ border: '1px solid red', width: '100%', height: '100%' }}>
      <RegressionCoefficient data={null} />
    </div>
  )
}

const TempDataAnalysis = () => {
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
    <Container>
      <div style={{ border: '1px solid red', width: '90%' }}>
        <Tabs hideAdd activeKey={activeKey} type="editable-card" items={items} onChange={onChange} onEdit={onEdit} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <Button onClick={add}>Generate Model</Button>
      </div>
    </Container>
  )
}

export default TempDataAnalysis

interface Container {
  width?: any
  height?: any
  minHeight?: any
  position?: string
}

const Container = styled.div`
  width: 100%;
  height: 35vw;
  margin-top: 6vw;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
`
