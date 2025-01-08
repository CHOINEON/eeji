import { CaretRightOutlined } from '@ant-design/icons'
import { Collapse, CollapseProps, theme } from 'antd'
import { IFeatureDescription } from 'apis/type/IndexResponse'
import React, { CSSProperties } from 'react'

const DescriptionCollapsePanel = ({ selectedFeature }: { selectedFeature: IFeatureDescription }) => {
  const { token } = theme.useToken()

  const panelStyle: React.CSSProperties = {
    marginBottom: 24,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: 'none',
  }

  const getItems: (panelStyle: CSSProperties) => CollapseProps['items'] = (panelStyle) => [
    {
      key: '1',
      label: '자세히 보기',
      children: (
        <>
          <div className="my-2">
            <span>
              <b>{selectedFeature?.feature_name}</b>
            </span>
            {/* <span> (단위 : {selectedFeature?.unit})</span> */}
            <div>{selectedFeature?.description}</div>
            <div>{selectedFeature?.causal_relationship}</div>
            {/* <div>(출처 : {selectedFeature?.source})</div> */}
          </div>
        </>
      ),
      style: panelStyle,
    },
  ]

  return (
    <Collapse
      bordered={false}
      defaultActiveKey={['1']}
      expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
      style={{ background: token.colorBgContainer }}
      items={getItems(panelStyle)}
    />
  )
}

export default DescriptionCollapsePanel
