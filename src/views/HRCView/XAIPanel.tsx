import { LineChartOutlined } from '@ant-design/icons'
import { Button, Modal, TableColumnsType } from 'antd'

import { TableProps } from 'antd'

import { Divider } from 'antd'
import React, { useEffect, useState } from 'react'
import FeatureImpactTable from './FeatureImpactTable'
import WaterfallChart from './WaterfallChart'

interface DataType {
  key: React.Key
  name: string
  impact: number
}

const columns: TableColumnsType<DataType> = [
  {
    title: '변수 이름',
    dataIndex: 'name',
    render: (text: string) => <a>{text}</a>,
    align: 'center',
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: '영향도',
    dataIndex: 'impact',
    align: 'center',
    sorter: (a, b) => b.impact - b.impact,
  },
]

export interface XAITableProps {
  xaiData?: XAIDataType
  dramatic_delta_date_list?: Array<string>
  turning_points_date_list?: Array<string>
  onChangeFeature?: (name: string) => void
  onChangeDate?: (date: string) => void
}

// Update the XAIDataType to allow dynamic keys
export interface XAIDataType {
  [key: string]: InnerXAIDataType
}

export interface InnerXAIDataType {
  aggregated_xai: Array<Record<string, number>>
  base_date: string
  base_value: number
  time_delta: number
  value_delta: number
  value: number
  xai_description: string
}

const XAIPanel = ({ xaiData, onChangeFeature, onChangeDate }: XAITableProps) => {
  const [viewChart, setViewChart] = useState(false)
  const [buttonValue, setButtonValue] = useState(0)

  const [tableData, setTableData] = useState<TableProps['dataSource']>([])
  const [description, setDescriptipn] = useState<{ pred: string }>()

  const [waterfallData, setWaterfallData] = useState<InnerXAIDataType>()

  useEffect(() => {
    //예측 날짜 바뀔때마다 테이블과 텍스트 변경함
    if (xaiData) {
      // console.log('xaiData:', xaiData)
      const pred = Object.keys(xaiData).slice(0, 7)[buttonValue]

      //디스크립션
      setDescriptipn({
        ...description,
        pred: xaiData[pred]?.xai_description,
      })

      //테이블
      setTableData(formatArray(xaiData[pred]?.aggregated_xai)?.sort((a, b) => b.impact - a.impact))

      //Waterfall chart
      setWaterfallData(xaiData[pred])

      //차트로 날짜 보내서 시각화
      onChangeDate(pred)
    }
  }, [xaiData, buttonValue])

  function formatArray(arr: Array<Record<string, number>>): Array<{ key: string; name: string; impact: number }> {
    return arr?.map((item, index) => {
      const [key, value] = Object.entries(item)[0] // 각 객체의 키와 값을 추출
      return {
        key: (index + 1).toString(), // 1부터 시작하는 key
        name: key, // Feature + index 값
        impact: value, // impact는 절대값으로
      }
    })
  }

  return (
    <>
      <div className="m-3">
        <div className="mt-3">
          <div className="text-right m-2">
            <Button type="link" onClick={() => setViewChart(!viewChart)} icon={<LineChartOutlined />}></Button>
          </div>
          <FeatureImpactTable
            dataSource={tableData}
            columns={columns}
            onSelectFeature={(value: string) => onChangeFeature(value)}
            onSelectPeriod={(value: number) => setButtonValue(value)}
          />
        </div>
        <Divider />
        <div>
          <p className="text-lg font-bold text-center mb-4">예측 설명</p>
          <div className="overflow-scroll h-[240px]" dangerouslySetInnerHTML={{ __html: description?.pred }} />
        </div>
      </div>

      <Modal width={1000} open={viewChart} title="" onCancel={() => setViewChart(false)} footer={() => <></>}>
        <WaterfallChart data={waterfallData} />
      </Modal>
    </>
  )
}

export default XAIPanel
