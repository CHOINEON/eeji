import { LineChartOutlined } from '@ant-design/icons'
import { Button, Modal, Radio, Table, TableColumnsType } from 'antd'

import { TableProps } from 'antd'

import { Divider } from 'antd'
import { useEffect, useState } from 'react'
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
  },
  {
    title: '영향도',
    dataIndex: 'impact',
    align: 'center',
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
export type XAIDataType = {
  [key: string]: InnerXAIDataType
}

export type InnerXAIDataType = {
  aggregated_xai: Array<Record<string, number>>
  base_date: string
  base_value: number
  time_delta: number
  value_delta: number
  value: number
  xai_description: string
}

type DescriptionDataType = {
  pred: string
  deltaInfo: string
  turningPoints: Array<unknown>
}

const XAIPanel = ({ xaiData, onChangeFeature, onChangeDate }: XAITableProps) => {
  const [viewChart, setViewChart] = useState(false)
  const [buttonValue, setButtonValue] = useState(0)

  const [tableData, setTableData] = useState([])
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
      }) // Now this will work without error

      //테이블
      setTableData(formatArray(xaiData[pred]?.aggregated_xai))

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

  // rowSelection object indicates the need for row selection
  const rowSelection: TableProps<DataType>['rowSelection'] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      onChangeFeature(selectedRows[0].name)
    },
    getCheckboxProps: (record: DataType) => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  }

  const handlePeriodClick = (args: any) => {
    setButtonValue(args.target.value)
  }

  return (
    <>
      <div className="m-3">
        <div className="mt-3">
          <p className="text-lg font-bold text-center m-2">HRC가격 변동 요인</p>
          <div className="text-center">
            <div className="m-auto">
              {/* <p className="text-lg font-bold text-center m-2">예측 기간</p> */}
              <Radio.Group defaultValue="a" onChange={handlePeriodClick} value={buttonValue}>
                <Radio.Button value={0}>1일</Radio.Button>
                <Radio.Button value={1}>7일</Radio.Button>
                <Radio.Button value={2}>30일</Radio.Button>
                <Radio.Button value={3}>60일</Radio.Button>
                <Radio.Button value={4}>90일</Radio.Button>
                <Radio.Button value={5}>120일</Radio.Button>
                <Radio.Button value={6}>150일</Radio.Button>
              </Radio.Group>
            </div>
          </div>
          <div className="text-right">
            <Button type="link" onClick={() => setViewChart(!viewChart)} icon={<LineChartOutlined />}></Button>
          </div>
          <Table<DataType>
            size="small"
            rowSelection={{ type: 'radio', ...rowSelection }}
            columns={columns}
            dataSource={tableData}
            pagination={{ pageSize: 5, pageSizeOptions: [10], position: ['bottomCenter'], showSizeChanger: false }}
          />
        </div>
        <Divider />
        {/* <Radio.Group onChange={handleTypeClick} value={descType}>
          <Radio value={'pred'}>예측 설명</Radio>
          <Radio value={'point'}>변곡점 설명</Radio>
        </Radio.Group> */}
        <div>
          <p className="text-lg font-bold text-center mb-4">예측 설명</p>
          <div className="overflow-scroll h-[240px]" dangerouslySetInnerHTML={{ __html: description?.pred }} />
        </div>
      </div>

      <Modal
        width={1000}
        open={viewChart}
        title=""
        // onOk={handleOk}
        onCancel={() => setViewChart(false)}
        footer={(_) => <></>}
      >
        <WaterfallChart data={waterfallData} />
      </Modal>
    </>
  )
}

export default XAIPanel
